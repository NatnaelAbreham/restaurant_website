
import { useCallback, useEffect, useRef, useState } from "react";

const GAME_TIME = 45;
const START_LIVES = 3;

const DIFFICULTIES = {
  Easy: { spawnRate: 1050, speed: 3.2, maxItems: 4 },
  Medium: { spawnRate: 780, speed: 4.5, maxItems: 5 },
  Hard: { spawnRate: 560, speed: 5.8, maxItems: 7 },
};

const FOOD = ["🍕", "🍕", "🍕", "🍕", "🍔", "🌮", "🍩", "🍟"];
const BOMB = "💣";

function randomItem(id, difficulty) {
  const config = DIFFICULTIES[difficulty];
  const isBomb = Math.random() < (difficulty === "Hard" ? 0.3 : 0.2);

  return {
    id,
    emoji: isBomb ? BOMB : FOOD[Math.floor(Math.random() * FOOD.length)],
    x: 8 + Math.random() * 80,
    y: 105,
    speed: config.speed + Math.random() * 2,
    rotation: Math.random() * 40 - 20,
    isBomb,
  };
}

export default function PizzaSliceRush() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [combo, setCombo] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState("");
  const [slicedId, setSlicedId] = useState(null);

  const nextId = useRef(0);
  const itemsRef = useRef([]);
  const lastSpawn = useRef(0);
  const lastFrame = useRef(0);
  const comboRef = useRef(0);

  const startGame = useCallback((level = difficulty) => {
    setDifficulty(level);
    setItems([]);
    itemsRef.current = [];
    setScore(0);
    setLives(START_LIVES);
    setTimeLeft(GAME_TIME);
    setCombo(0);
    comboRef.current = 0;
    setSlicedId(null);
    setMessage("");
    lastSpawn.current = 0;
    lastFrame.current = 0;
    setPaused(false);
    setPlaying(true);
  }, [difficulty]);

  const finishGame = useCallback((reason = "Time's up!") => {
    setPlaying(false);
    setPaused(false);
    setMessage(reason);
    setItems([]);
    itemsRef.current = [];
  }, []);

  // Game countdown
  useEffect(() => {
    if (!playing || paused) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          finishGame("Time's up!");
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playing, paused, finishGame]);

  // Move and spawn items
  useEffect(() => {
    if (!playing || paused) return;

    let frameId;

    const animate = (timestamp) => {
      if (!lastFrame.current) lastFrame.current = timestamp;

      const delta = Math.min(timestamp - lastFrame.current, 40);
      lastFrame.current = timestamp;

      let nextItems = itemsRef.current.map((item) => ({
        ...item,
        y: item.y - (item.speed * delta) / 16,
        rotation: item.rotation + delta * 0.08,
      }));

      const missed = nextItems.filter((item) => item.y < -8);
      nextItems = nextItems.filter((item) => item.y >= -8);

      if (missed.some((item) => !item.isBomb)) {
        // Missing a flying food item is harmless.
      }

      if (
        timestamp - lastSpawn.current >= DIFFICULTIES[difficulty].spawnRate &&
        nextItems.length < DIFFICULTIES[difficulty].maxItems
      ) {
        nextItems.push(randomItem(nextId.current++, difficulty));
        lastSpawn.current = timestamp;
      }

      itemsRef.current = nextItems;
      setItems(nextItems);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [playing, paused, difficulty]);

  const sliceItem = (item) => {
    if (!playing || paused) return;

    const current = itemsRef.current;
    if (!current.some((candidate) => candidate.id === item.id)) return;

    const remaining = current.filter((candidate) => candidate.id !== item.id);
    itemsRef.current = remaining;
    setItems(remaining);
    setSlicedId(item.id);

    if (item.isBomb) {
      comboRef.current = 0;
      setCombo(0);
      setLives((previous) => {
        const next = previous - 1;

        if (next <= 0) {
          finishGame("Boom! Out of lives!");
          return 0;
        }

        setMessage("💥 Boom! Watch out for bombs!");
        return next;
      });
      return;
    }

    comboRef.current += 1;
    const nextCombo = comboRef.current;
    const points = 10 + Math.min(nextCombo - 1, 5) * 5;

    setCombo(nextCombo);
    setScore((previous) => {
      const next = previous + points;
      setBest((currentBest) => Math.max(currentBest, next));
      return next;
    });

    setMessage(nextCombo >= 3 ? `🔥 ${nextCombo}x combo! +${points}` : `+${points} points!`);
  };

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(""), 1200);
    return () => clearTimeout(timeout);
  }, [message]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code === "Space" && playing) {
        event.preventDefault();
        setPaused((previous) => !previous);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [playing]);

  return (
    <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-orange-50 to-amber-100 p-4 text-gray-900 shadow-xl sm:p-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Tsedey Arcade
          </p>
          <h2 className="mt-1 text-2xl font-black sm:text-3xl">
            🍕 Pizza Slice Rush
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Slice the food. Avoid the bombs!
          </p>
        </div>
        <span className="text-5xl" aria-hidden="true">🍕</span>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Score" value={score} />
        <Stat label="Best" value={best} />
        <Stat label="Time" value={`${timeLeft}s`} />
        <Stat label="Lives" value={"❤️".repeat(lives) || "💔"} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-bold">Difficulty</span>
        <div className="flex gap-2">
          {Object.keys(DIFFICULTIES).map((level) => (
            <button
              key={level}
              onClick={() => startGame(level)}
              className={`rounded-full px-3 py-2 text-sm font-bold ${
                difficulty === level
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-red-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[380px] overflow-hidden rounded-2xl border-4 border-red-200 bg-gradient-to-b from-sky-100 via-orange-50 to-amber-200 sm:h-[460px]">
        <div className="absolute inset-x-0 top-0 flex justify-between p-3 text-xs font-bold text-gray-500">
          <span>✂️ SLICE TO SCORE</span>
          <span>💣 AVOID BOMBS</span>
        </div>

        {items.map((item) => (
          <button
            key={item.id}
            onPointerDown={(event) => {
              event.preventDefault();
              sliceItem(item);
            }}
            aria-label={item.isBomb ? "Bomb" : "Slice food"}
            className="absolute flex h-14 w-14 touch-manipulation items-center justify-center rounded-full text-4xl transition-transform active:scale-75 sm:h-16 sm:w-16 sm:text-5xl"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              cursor: "crosshair",
            }}
          >
            {item.emoji}
          </button>
        ))}

        {message && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-5 py-3 text-center font-black text-red-600 shadow-lg">
            {message}
          </div>
        )}

        {(!playing || paused) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-950/65 p-5">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
              <div className="mb-2 text-5xl">
                {paused ? "⏸️" : timeLeft === 0 || lives === 0 ? "🏁" : "🍕"}
              </div>
              <h3 className="text-2xl font-black">
                {paused
                  ? "Game Paused"
                  : timeLeft === 0 || lives === 0
                  ? "Round Finished!"
                  : "Ready, Chef?"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {paused
                  ? "Your food is waiting. Resume when ready."
                  : timeLeft === 0 || lives === 0
                  ? `You scored ${score} points. Can you beat ${best}?`
                  : "Tap the flying food to slice it. Every slice earns points. Never tap a bomb!"}
              </p>
              <button
                onClick={() => {
                  if (paused) setPaused(false);
                  else startGame();
                }}
                className="mt-5 w-full rounded-xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600"
              >
                {paused
                  ? "▶ Resume"
                  : timeLeft === 0 || lives === 0
                  ? "🔄 Play Again"
                  : "▶ Start Game"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {playing && !paused && (
          <button
            onClick={() => setPaused(true)}
            className="flex-1 rounded-xl bg-amber-400 px-4 py-3 font-bold text-amber-950 hover:bg-amber-500"
          >
            ⏸ Pause
          </button>
        )}
        <button
          onClick={() => startGame()}
          className="flex-1 rounded-xl border-2 border-red-400 bg-white px-4 py-3 font-bold text-red-600 hover:bg-red-50"
        >
          🔄 Restart
        </button>
      </div>

      <p className="mt-4 rounded-xl bg-white/70 p-3 text-center text-sm text-gray-600">
        <strong>How to play:</strong> Tap or click flying food to score.
        Build combos for bonus points. Hitting a bomb costs one life.
        You have 45 seconds!
      </p>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-black text-red-600">{value}</p>
    </div>
  );
}
