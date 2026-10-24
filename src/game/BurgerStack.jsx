
import { useEffect, useReducer } from "react";

const INGREDIENTS = [
  { emoji: "🥬", name: "Lettuce" },
  { emoji: "🍅", name: "Tomato" },
  { emoji: "🧀", name: "Cheese" },
  { emoji: "🥩", name: "Beef Patty" },
  { emoji: "🥒", name: "Pickle" },
  { emoji: "🧅", name: "Onion" },
  { emoji: "🥓", name: "Bacon" },
];

const DIFFICULTIES = {
  Easy: { speed: 950, lives: 5 },
  Medium: { speed: 700, lives: 4 },
  Hard: { speed: 480, lives: 3 },
};

const LANES = 5;
const CATCH_ROW = 4;

function createInitialState(difficulty = "Easy", best = 0) {
  return {
    difficulty,
    lane: 2,
    ingredients: [],
    stack: [],
    score: 0,
    lives: DIFFICULTIES[difficulty].lives,
    best,
    playing: false,
    gameOver: false,
    paused: false,
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case "START":
      return {
        ...createInitialState(action.difficulty, state.best),
        playing: true,
      };

    case "MOVE":
      if (!state.playing || state.paused || state.gameOver) {
        return state;
      }

      return {
        ...state,
        lane: Math.max(0, Math.min(LANES - 1, state.lane + action.direction)),
      };

    case "PAUSE":
      if (!state.playing || state.gameOver) return state;
      return { ...state, paused: !state.paused };

    case "TICK": {
      if (!state.playing || state.paused || state.gameOver) {
        return state;
      }

      let score = state.score;
      let lives = state.lives;
      let stack = [...state.stack];
      let best = state.best;
      let gameOver = false;

      const remaining = [];

      for (const item of state.ingredients) {
        const nextRow = item.row + 1;

        if (nextRow >= CATCH_ROW) {
          if (item.lane === state.lane) {
            score += 10;
            stack.push(item.emoji);
            best = Math.max(best, score);
          } else {
            lives -= 1;

            if (lives <= 0) {
              lives = 0;
              gameOver = true;
            }
          }
        } else {
          remaining.push({ ...item, row: nextRow });
        }
      }

      if (!gameOver) {
        const ingredient =
          INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)];

        remaining.push({
          id: `${Date.now()}-${Math.random()}`,
          emoji: ingredient.emoji,
          name: ingredient.name,
          lane: Math.floor(Math.random() * LANES),
          row: 0,
        });
      }

      return {
        ...state,
        ingredients: remaining,
        score,
        lives,
        stack,
        best,
        gameOver,
        playing: !gameOver,
      };
    }

    default:
      return state;
  }
}

export default function BurgerStack() {
  const [game, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => createInitialState()
  );

  useEffect(() => {
    if (!game.playing || game.paused || game.gameOver) return;

    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, DIFFICULTIES[game.difficulty].speed);

    return () => clearInterval(timer);
  }, [game.playing, game.paused, game.gameOver, game.difficulty]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (["ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        dispatch({ type: "MOVE", direction: -1 });
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        dispatch({ type: "MOVE", direction: 1 });
      }

      if (event.code === "Space") {
        dispatch({ type: "PAUSE" });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startGame = (difficulty = game.difficulty) => {
    dispatch({ type: "START", difficulty });
  };

  const cells = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: LANES }, (_, lane) => ({ row, lane }))
  );

  return (
    <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-orange-100 p-4 text-gray-900 shadow-xl sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
            Tsedey Restaurant Arcade
          </p>
          <h2 className="mt-1 text-2xl font-black sm:text-3xl">
            🍔 Burger Stack
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Catch ingredients. Build your burger!
          </p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <div className="text-3xl">🍔</div>
          <div className="text-xs font-bold text-orange-700">STACK IT!</div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-semibold text-gray-500">SCORE</p>
          <p className="text-2xl font-black text-orange-600">
            {game.score}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-semibold text-gray-500">LIVES</p>
          <p className="text-xl">
            {Array.from({ length: game.lives }, (_, i) => (
              <span key={i}>❤️</span>
            ))}
            {game.lives === 0 && "💔"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-semibold text-gray-500">BEST</p>
          <p className="text-2xl font-black text-emerald-600">
            {game.best}
          </p>
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-bold">Difficulty</span>
        <div className="flex gap-2">
          {Object.keys(DIFFICULTIES).map((level) => (
            <button
              key={level}
              onClick={() => {
                if (!game.playing || game.gameOver) {
                  startGame(level);
                } else if (game.difficulty !== level) {
                  startGame(level);
                }
              }}
              className={`rounded-full px-3 py-2 text-xs font-bold transition sm:text-sm ${
                game.difficulty === level
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Game board */}
      <div className="relative overflow-hidden rounded-2xl border-4 border-amber-800 bg-gradient-to-b from-sky-100 to-amber-100 p-2 shadow-inner sm:p-3">
        <div className="mb-2 flex items-center justify-between px-1 text-xs font-bold text-amber-900">
          <span>⬇️ INGREDIENTS INCOMING</span>
          <span>{game.stack.length} STACKED</span>
        </div>

        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {cells.flat().map(({ row, lane }) => {
            const ingredient = game.ingredients.find(
              (item) => item.row === row && item.lane === lane
            );
            const isPlayer = row === CATCH_ROW && lane === game.lane;

            return (
              <div
                key={`${row}-${lane}`}
                className={`flex aspect-square items-center justify-center rounded-xl text-2xl sm:text-3xl ${
                  row === CATCH_ROW
                    ? "border-2 border-dashed border-amber-500 bg-amber-200/80"
                    : "bg-white/50"
                }`}
              >
                {ingredient && (
                  <span
                    title={ingredient.name}
                    className="animate-bounce"
                  >
                    {ingredient.emoji}
                  </span>
                )}

                {isPlayer && (
                  <span className="drop-shadow-md" title="Your burger basket">
                    🧺
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Burger stack */}
        <div className="mt-3 rounded-xl border border-amber-300 bg-white/80 p-3">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-amber-900">
            Your burger
          </p>
          <div className="flex min-h-12 flex-wrap items-center justify-center gap-1">
            <span className="text-3xl">🍞</span>
            {game.stack.slice(-12).map((emoji, index) => (
              <span key={index} className="text-2xl">
                {emoji}
              </span>
            ))}
            <span className="text-3xl">🍞</span>
          </div>
        </div>

        {/* Overlays */}
        {(!game.playing || game.paused || game.gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950/70 p-5">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl">
              <div className="mb-2 text-5xl">
                {game.gameOver ? "💔" : game.paused ? "⏸️" : "🍔"}
              </div>

              <h3 className="text-2xl font-black">
                {game.gameOver
                  ? "Game Over!"
                  : game.paused
                  ? "Game Paused"
                  : "Ready to Stack?"}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {game.gameOver
                  ? `You scored ${game.score} points! Try again to beat your best.`
                  : game.paused
                  ? "Take a breath. Your burger challenge is waiting."
                  : "Catch falling ingredients with your basket. Every catch earns 10 points!"}
              </p>

              <button
                onClick={() =>
                  game.paused
                    ? dispatch({ type: "PAUSE" })
                    : startGame()
                }
                className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow transition hover:bg-orange-600"
              >
                {game.gameOver ? "🔄 Play Again" : game.paused ? "▶️ Resume" : "▶️ Start Game"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          onClick={() => dispatch({ type: "MOVE", direction: -1 })}
          disabled={!game.playing || game.paused}
          className="rounded-2xl bg-gray-900 py-3 text-2xl text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Move left"
        >
          ◀️
        </button>

        <button
          onClick={() => dispatch({ type: "PAUSE" })}
          disabled={!game.playing && !game.paused}
          className="rounded-2xl bg-amber-400 py-3 font-bold text-amber-950 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {game.paused ? "▶ Resume" : "⏸ Pause"}
        </button>

        <button
          onClick={() => dispatch({ type: "MOVE", direction: 1 })}
          disabled={!game.playing || game.paused}
          className="rounded-2xl bg-gray-900 py-3 text-2xl text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Move right"
        >
          ▶️
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-white/70 p-3 text-center text-xs leading-5 text-gray-600 sm:text-sm">
        <p>
          <strong>Computer:</strong> Use ← → or A / D to move.
          Press Space to pause.
        </p>
        <p>
          <strong>Mobile:</strong> Use the left and right buttons.
          Catch ingredients in your basket to score points!
        </p>
      </div>

      <button
        onClick={() => startGame()}
        className="mt-3 w-full rounded-xl border-2 border-orange-500 py-3 font-bold text-orange-700 transition hover:bg-orange-500 hover:text-white"
      >
        🔄 Restart Game
      </button>
    </section>
  );
}
