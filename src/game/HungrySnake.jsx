
import { useCallback, useEffect, useRef, useState } from "react";

const SIZE = 18;
const START_SNAKE = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];

const FOOD_ITEMS = [
  { emoji: "🍔", points: 10 },
  { emoji: "🍕", points: 15 },
  { emoji: "🍎", points: 5 },
  { emoji: "🍗", points: 20 },
  { emoji: "🌮", points: 10 },
  { emoji: "🍟", points: 10 },
];

const randomFood = (snake) => {
  let position;

  do {
    position = {
      x: Math.floor(Math.random() * SIZE),
      y: Math.floor(Math.random() * SIZE),
    };
  } while (
    snake.some(
      (part) => part.x === position.x && part.y === position.y
    )
  );

  return {
    ...position,
    ...FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)],
  };
};

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const INITIAL_FOOD = randomFood(START_SNAKE);

export default function HungrySnake() {
  const [snake, setSnake] = useState(START_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [status, setStatus] = useState("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("tsedey-hungry-snake-best")) || 0;
    } catch {
      return 0;
    }
  });

  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction);

  const level = Math.min(10, Math.floor(score / 50) + 1);
  const speed = Math.max(75, 180 - (level - 1) * 12);

  const changeDirection = useCallback((next) => {
    const current = directionRef.current;

    // The snake cannot instantly reverse into itself.
    if (
      current.x + next.x === 0 &&
      current.y + next.y === 0
    ) {
      return;
    }

    nextDirectionRef.current = next;
    setDirection(next);
  }, []);

  const resetGame = useCallback((startImmediately = false) => {
    const initialDirection = { x: 1, y: 0 };

    setSnake(START_SNAKE);
    setFood(randomFood(START_SNAKE));
    setDirection(initialDirection);
    directionRef.current = initialDirection;
    nextDirectionRef.current = initialDirection;
    setScore(0);
    setLives(3);
    setStatus(startImmediately ? "playing" : "ready");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const next = DIRECTIONS[event.key] || DIRECTIONS[key];

      if (next) {
        event.preventDefault();
        if (status === "ready") setStatus("playing");
        changeDirection(next);
      }

      if (event.code === "Space") {
        event.preventDefault();
        setStatus((current) =>
          current === "playing"
            ? "paused"
            : current === "paused" || current === "ready"
              ? "playing"
              : current
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, status]);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = window.setInterval(() => {
      const move = nextDirectionRef.current;
      directionRef.current = move;

      setSnake((currentSnake) => {
        const head = {
          x: currentSnake[0].x + move.x,
          y: currentSnake[0].y + move.y,
        };

        const hitWall =
          head.x < 0 ||
          head.x >= SIZE ||
          head.y < 0 ||
          head.y >= SIZE;

        const eating = head.x === food.x && head.y === food.y;
        const bodyToCheck = eating
          ? currentSnake
          : currentSnake.slice(0, -1);

        const hitSelf = bodyToCheck.some(
          (part) => part.x === head.x && part.y === head.y
        );

        if (hitWall || hitSelf) {
          setLives((currentLives) => {
            const remaining = currentLives - 1;

            if (remaining <= 0) {
              setStatus("over");
              return 0;
            }

            const freshSnake = START_SNAKE.map((part) => ({ ...part }));
            setSnake(freshSnake);
            setDirection({ x: 1, y: 0 });
            directionRef.current = { x: 1, y: 0 };
            nextDirectionRef.current = { x: 1, y: 0 };
            return remaining;
          });

          return currentSnake;
        }

        const nextSnake = [head, ...currentSnake];

        if (eating) {
          setScore((currentScore) => {
            const updated = currentScore + food.points;
            setBestScore((best) => {
              const nextBest = Math.max(best, updated);

              try {
                localStorage.setItem(
                  "tsedey-hungry-snake-best",
                  String(nextBest)
                );
              } catch {
                // The game still works when storage is unavailable.
              }

              return nextBest;
            });

            return updated;
          });

          setFood(randomFood(nextSnake));
        } else {
          nextSnake.pop();
        }

        return nextSnake;
      });
    }, speed);

    return () => window.clearInterval(timer);
  }, [status, speed, food]);

  const moveButton = (key) => {
    const next = DIRECTIONS[key];
    if (next) {
      if (status === "ready") setStatus("playing");
      changeDirection(next);
    }
  };

  const isSnakePart = (x, y) =>
    snake.some((part) => part.x === x && part.y === y);

  const isHead = (x, y) =>
    snake[0]?.x === x && snake[0]?.y === y;

  return (
    <section className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mb-3 text-5xl">🐍</div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
            Tsedey Restaurant Arcade
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Hungry <span className="text-emerald-400">Snake</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
            Eat delicious food, grow your snake, and beat your
            high score. How hungry are you?
          </p>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "SCORE", value: score, emoji: "⭐" },
            { label: "BEST", value: bestScore, emoji: "🏆" },
            { label: "LIVES", value: "❤️".repeat(lives) || "💔", emoji: "💚" },
            { label: "LEVEL", value: level, emoji: "⚡" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center shadow-lg sm:p-4"
            >
              <div className="mb-1 text-xs font-bold tracking-widest text-slate-400">
                {stat.label}
              </div>
              <div className="text-xl font-black sm:text-2xl">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Game board */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-slate-950 p-2 shadow-2xl shadow-emerald-950/50 sm:p-4">
          <div
            className="grid aspect-square w-full gap-px overflow-hidden rounded-lg bg-emerald-900/30"
            style={{
              gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))`,
            }}
            role="img"
            aria-label={`Hungry Snake game board. Score ${score}, lives ${lives}.`}
          >
            {Array.from({ length: SIZE * SIZE }, (_, index) => {
              const x = index % SIZE;
              const y = Math.floor(index / SIZE);
              const head = isHead(x, y);
              const body = isSnakePart(x, y);
              const hasFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-center rounded-[2px] ${
                    (x + y) % 2 === 0
                      ? "bg-emerald-950/60"
                      : "bg-slate-900"
                  }`}
                >
                  {head && (
                    <span className="z-10 flex h-full w-full items-center justify-center rounded-sm bg-emerald-400 text-[min(3.5vw,20px)] leading-none shadow-[0_0_10px_rgba(52,211,153,0.7)]">
                      🐍
                    </span>
                  )}
                  {!head && body && (
                    <div className="h-[85%] w-[85%] rounded-[4px] bg-emerald-500 shadow-sm" />
                  )}
                  {hasFood && (
                    <span className="z-10 text-[min(3.5vw,21px)] leading-none drop-shadow-md">
                      {food.emoji}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overlay */}
          {status !== "playing" && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
              <div className="max-w-sm text-center">
                <div className="mb-3 text-5xl">
                  {status === "over"
                    ? "💥"
                    : status === "paused"
                      ? "⏸️"
                      : "🍔"}
                </div>
                <h3 className="text-2xl font-black sm:text-3xl">
                  {status === "over"
                    ? "Game Over!"
                    : status === "paused"
                      ? "Take a Break"
                      : "Ready to Feast?"}
                </h3>
                <p className="mx-auto mb-5 mt-2 text-sm leading-6 text-slate-300">
                  {status === "over"
                    ? `You scored ${score} points. Hungry for another round?`
                    : status === "paused"
                      ? "Your food is waiting. Jump back in when you're ready!"
                      : "Collect tasty treats, grow your snake, and avoid the walls."}
                </p>
                <button
                  onClick={() => resetGame(true)}
                  className="rounded-xl bg-emerald-500 px-7 py-3 font-extrabold text-slate-950 shadow-lg transition hover:scale-105 hover:bg-emerald-400 active:scale-95"
                >
                  {status === "over" ? "🔄 Play Again" : "▶ Start Game"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Game actions */}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {status === "playing" ? (
            <button
              onClick={() => setStatus("paused")}
              className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold transition hover:bg-white/20"
            >
              ⏸ Pause
            </button>
          ) : status === "paused" ? (
            <button
              onClick={() => setStatus("playing")}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              ▶ Resume
            </button>
          ) : null}

          <button
            onClick={() => resetGame(false)}
            className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold transition hover:bg-white/20"
          >
            🔄 Restart
          </button>
        </div>

        {/* Mobile controls */}
        <div className="mx-auto mt-7 w-48 sm:hidden">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            Touch to move
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button
              onClick={() => moveButton("ArrowUp")}
              aria-label="Move up"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 py-4 text-xl active:bg-emerald-500/50"
            >
              ⬆️
            </button>
            <div />
            <button
              onClick={() => moveButton("ArrowLeft")}
              aria-label="Move left"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 py-4 text-xl active:bg-emerald-500/50"
            >
              ⬅️
            </button>
            <button
              onClick={() => moveButton("ArrowDown")}
              aria-label="Move down"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 py-4 text-xl active:bg-emerald-500/50"
            >
              ⬇️
            </button>
            <button
              onClick={() => moveButton("ArrowRight")}
              aria-label="Move right"
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 py-4 text-xl active:bg-emerald-500/50"
            >
              ➡️
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <h4 className="mb-3 font-extrabold">🎮 How to Play</h4>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <p>🍕 Collect food to earn points and grow longer.</p>
            <p>⌨️ Use arrow keys or W, A, S, D to change direction.</p>
            <p>💚 Avoid walls and your own body. You have 3 lives!</p>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            Press SPACE to pause or resume • Every 50 points increases the level
          </p>
        </div>
      </div>
    </section>
  );
}
