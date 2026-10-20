
import { useCallback, useEffect, useRef, useState } from "react";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 440;
const BASKET_WIDTH = 100;
const BASKET_HEIGHT = 48;

const FOOD = ["🍔", "🍕", "🍟", "🌮", "🍩", "🥪", "🍗", "🧁"];
const BAD_FOOD = ["🤢", "🤮"];

const LEVELS = {
  Easy: { speed: 115, spawnRate: 1050 },
  Medium: { speed: 175, spawnRate: 800 },
  Hard: { speed: 245, spawnRate: 600 },
};

function readBestScore() {
  try {
    return Number(localStorage.getItem("tsedey-catch-food-best")) || 0;
  } catch {
    return 0;
  }
}

export default function CatchTheFood() {
  const canvasRef = useRef(null);
  const gameRef = useRef({
    items: [],
    basketX: GAME_WIDTH / 2,
    elapsed: 0,
    lastSpawn: 0,
    lastTime: 0,
    key: -1,
  });

  const [difficulty, setDifficulty] = useState("Easy");
  const [status, setStatus] = useState("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bestScore, setBestScore] = useState(readBestScore);
  const [resetKey, setResetKey] = useState(0);

  const moveBasket = useCallback((clientX) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * GAME_WIDTH;

    gameRef.current.basketX = Math.max(
      BASKET_WIDTH / 2,
      Math.min(GAME_WIDTH - BASKET_WIDTH / 2, x)
    );
  }, []);

  const startGame = () => {
    gameRef.current = {
      items: [],
      basketX: GAME_WIDTH / 2,
      elapsed: 0,
      lastSpawn: 0,
      lastTime: 0,
      key: resetKey + 1,
    };

    setScore(0);
    setLives(3);
    setResetKey((key) => key + 1);
    setStatus("running");
  };

  const saveBestScore = useCallback((value) => {
    setBestScore((previous) => {
      const best = Math.max(previous, value);

      try {
        localStorage.setItem("tsedey-catch-food-best", String(best));
      } catch {
        // The game still works if browser storage is unavailable.
      }

      return best;
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (status !== "running") return;

    const handleKeyDown = (event) => {
      if (
        ["ArrowLeft", "ArrowRight", " "].includes(event.key) &&
        event.target.tagName !== "INPUT"
      ) {
        event.preventDefault();
      }

      if (event.key === "ArrowLeft") {
        gameRef.current.basketX = Math.max(
          BASKET_WIDTH / 2,
          gameRef.current.basketX - 34
        );
      }

      if (event.key === "ArrowRight") {
        gameRef.current.basketX = Math.min(
          GAME_WIDTH - BASKET_WIDTH / 2,
          gameRef.current.basketX + 34
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status]);

  // Game animation and collision detection
  useEffect(() => {
    if (status !== "running") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const game = gameRef.current;

    if (game.key !== resetKey) {
      game.items = [];
      game.basketX = GAME_WIDTH / 2;
      game.elapsed = 0;
      game.lastSpawn = 0;
      game.lastTime = 0;
      game.key = resetKey;
    }

    let animationId;
    let active = true;
    let lastBestSaved = bestScore;

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(
        0, 0, GAME_WIDTH, GAME_HEIGHT
      );

      gradient.addColorStop(0, "#fff7ed");
      gradient.addColorStop(1, "#ffedd5");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Decorative bubbles
      for (let i = 0; i < 16; i++) {
        const x = (i * 137 + 35) % GAME_WIDTH;
        const y = (i * 83 + 28) % GAME_HEIGHT;

        ctx.beginPath();
        ctx.arc(x, y, 3 + (i % 4), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 115, 22, 0.10)";
        ctx.fill();
      }

      ctx.fillStyle = "#fed7aa";
      ctx.fillRect(0, GAME_HEIGHT - 8, GAME_WIDTH, 8);
    };

    const drawBasket = () => {
      const x = game.basketX - BASKET_WIDTH / 2;
      const y = GAME_HEIGHT - BASKET_HEIGHT - 12;

      // Basket shadow
      ctx.fillStyle = "rgba(124, 45, 18, 0.15)";
      ctx.beginPath();
      ctx.ellipse(
        game.basketX, GAME_HEIGHT - 8, 65, 8, 0, 0, Math.PI * 2
      );
      ctx.fill();

      // Basket handle
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(game.basketX, y + 12, 28, Math.PI, 0);
      ctx.stroke();

      // Basket body
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.roundRect(x, y + 7, BASKET_WIDTH, BASKET_HEIGHT - 7, 10);
      ctx.fill();

      ctx.fillStyle = "#c2410c";
      ctx.fillRect(x + 4, y + 23, BASKET_WIDTH - 8, 5);

      ctx.fillStyle = "#fed7aa";
      ctx.fillRect(x + 10, y + 35, BASKET_WIDTH - 20, 4);

      ctx.font = '32px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🍽️", game.basketX, y + 12);
    };

    const drawItem = (item) => {
      ctx.font = '32px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.emoji, item.x, item.y);

      if (item.bad) {
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#b91c1c";
        ctx.fillText("AVOID!", item.x, item.y + 25);
      }
    };

    const tick = (time) => {
      if (!active) return;

      const delta = game.lastTime
        ? Math.min((time - game.lastTime) / 1000, 0.04)
        : 0;

      game.lastTime = time;
      game.elapsed += delta * 1000;

      const level = LEVELS[difficulty];

      if (game.elapsed - game.lastSpawn >= level.spawnRate) {
        const bad = Math.random() < 0.22;

        game.items.push({
          x: 28 + Math.random() * (GAME_WIDTH - 56),
          y: -25,
          emoji: bad
            ? BAD_FOOD[Math.floor(Math.random() * BAD_FOOD.length)]
            : FOOD[Math.floor(Math.random() * FOOD.length)],
          bad,
          speed: level.speed * (0.75 + Math.random() * 0.65),
          wobble: Math.random() * Math.PI * 2,
        });

        game.lastSpawn = game.elapsed;
      }

      drawBackground();

      const basketTop = GAME_HEIGHT - BASKET_HEIGHT - 12;
      const remaining = [];

      for (const item of game.items) {
        item.y += item.speed * delta;
        item.wobble += delta * 3;
        item.x += Math.sin(item.wobble) * 12 * delta;

        const caught =
          item.y + 16 >= basketTop &&
          item.y - 16 <= basketTop + BASKET_HEIGHT &&
          item.x >= game.basketX - BASKET_WIDTH / 2 - 8 &&
          item.x <= game.basketX + BASKET_WIDTH / 2 + 8;

        if (caught) {
          if (item.bad) {
            setLives((current) => {
              const next = Math.max(0, current - 1);

              if (next === 0) {
                setStatus("gameover");
              }

              return next;
            });
          } else {
            setScore((current) => {
              const next = current + 10;

              if (next > lastBestSaved) {
                lastBestSaved = next;
                saveBestScore(next);
              }

              return next;
            });
          }

          continue;
        }

        // Missing good food is okay; missing rotten food is okay too.
        if (item.y < GAME_HEIGHT + 30) {
          remaining.push(item);
        }
      }

      game.items = remaining;

      for (const item of game.items) {
        drawItem(item);
      }

      drawBasket();

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(animationId);
    };
  }, [status, difficulty, resetKey, saveBestScore, bestScore]);

  const changeDifficulty = (level) => {
    setDifficulty(level);

    if (status === "running" || status === "paused") {
      gameRef.current.items = [];
      gameRef.current.elapsed = 0;
      gameRef.current.lastSpawn = 0;
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-6 text-white sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">
              Tsedey Restaurant Arcade
            </p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">
              Catch the Food! 🍔
            </h2>
            <p className="mt-2 text-sm text-orange-50">
              Catch delicious food. Avoid the rotten stuff!
            </p>
          </div>
          <div className="rounded-2xl bg-white/20 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider">
              Best Score
            </p>
            <p className="text-2xl font-black">{bestScore}</p>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-2 border-b border-orange-100 bg-orange-50/70 p-3 sm:gap-4 sm:p-5">
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Score
          </p>
          <p className="mt-1 text-2xl font-black text-orange-600">{score}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Lives
          </p>
          <p className="mt-1 text-xl sm:text-2xl">
            {"❤️".repeat(lives)}
            {"🖤".repeat(3 - lives)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Difficulty
          </p>
          <p className="mt-2 text-lg font-black text-gray-800">{difficulty}</p>
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-5 sm:px-6">
        <p className="text-sm font-bold text-gray-700">Choose your challenge</p>
        <div className="flex gap-2">
          {Object.keys(LEVELS).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => changeDifficulty(level)}
              className={`rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${
                difficulty === level
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Game area */}
      <div className="px-3 pb-3 pt-4 sm:px-6 sm:pb-6">
        <div className="relative overflow-hidden rounded-2xl border-2 border-orange-100 bg-orange-50">
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            aria-label="Catch the food game. Move your basket to catch good food and avoid rotten food."
            className="block h-auto w-full touch-none"
            onPointerMove={(event) => {
              if (status === "running") moveBasket(event.clientX);
            }}
            onPointerDown={(event) => {
              if (status === "running") {
                event.currentTarget.setPointerCapture?.(event.pointerId);
                moveBasket(event.clientX);
              }
            }}
          />

          {status !== "running" && (
            <div className="absolute inset-0 flex items-center justify-center bg-orange-50/85 p-4 backdrop-blur-[2px]">
              <div className="w-full max-w-sm rounded-3xl border border-white bg-white p-6 text-center shadow-xl sm:p-8">
                <div className="text-5xl">
                  {status === "gameover" ? "😅" : "🍔🍕"}
                </div>

                <h3 className="mt-3 text-2xl font-black text-gray-900">
                  {status === "gameover"
                    ? "Game Over!"
                    : status === "paused"
                    ? "Take a Break!"
                    : "Ready to Play?"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {status === "gameover"
                    ? `You scored ${score} points. Give it another try!`
                    : status === "paused"
                    ? "Your game is paused. Continue when you're ready."
                    : "Move your basket, catch the good food, and avoid rotten items!"}
                </p>

                <button
                  type="button"
                  onClick={startGame}
                  className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-md transition hover:bg-orange-600 active:scale-[0.98]"
                >
                  {status === "gameover" ? "🔄 Play Again" : "▶ Start Game"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            <p className="font-bold text-gray-800">🎮 How to play</p>
            <p className="mt-1">
              Move your basket with your mouse, finger, or ← → arrow keys.
            </p>
          </div>

          <div className="flex gap-2">
            {status === "running" && (
              <button
                type="button"
                onClick={() => setStatus("paused")}
                className="rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-50"
              >
                ⏸ Pause
              </button>
            )}

            {status === "paused" && (
              <button
                type="button"
                onClick={() => setStatus("running")}
                className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                ▶ Resume
              </button>
            )}

            {(status === "running" || status === "paused") && (
              <button
                type="button"
                onClick={startGame}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
              >
                ↻ Restart
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-bold">Tip:</span> Each good food item earns 10 points.
          Catching rotten food costs one life. You have 3 lives!
        </div>
      </div>
    </section>
  );
}
