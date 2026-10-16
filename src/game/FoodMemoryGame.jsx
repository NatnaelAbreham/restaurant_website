
import { useEffect, useRef, useState } from "react";

const FOOD_ITEMS = [
  { emoji: "🍔", name: "Burger" },
  { emoji: "🍕", name: "Pizza" },
  { emoji: "🍟", name: "Fries" },
  { emoji: "🥤", name: "Drink" },
  { emoji: "🍰", name: "Cake" },
  { emoji: "🍗", name: "Chicken" },
];

const createDeck = () =>
  [...FOOD_ITEMS, ...FOOD_ITEMS]
    .map((food, index) => ({
      ...food,
      id: index,
      pairId: food.name,
    }))
    .sort(() => Math.random() - 0.5);

export default function FoodMemoryGame() {
  const [cards, setCards] = useState(createDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("foodGameBest")) || 0;
    } catch {
      return 0;
    }
  });

  const timeoutRef = useRef(null);
  const won = matched.length === FOOD_ITEMS.length;

  useEffect(() => {
    if (!started || won) return;

    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, won]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (!won || moves === 0) return;

    const score = Math.max(
      0,
      1000 - moves * 20 - seconds * 2
    );

    setBestScore((previous) => {
      const next = Math.max(previous, score);

      try {
        localStorage.setItem("foodGameBest", String(next));
      } catch {
        // The game still works if storage is unavailable.
      }

      return next;
    });
  }, [won, moves, seconds]);

  function flipCard(card) {
    if (
      locked ||
      flipped.includes(card.id) ||
      matched.includes(card.pairId) ||
      won
    ) {
      return;
    }

    setStarted(true);

    if (flipped.length === 0) {
      setFlipped([card.id]);
      return;
    }

    const firstCard = cards.find(
      (item) => item.id === flipped[0]
    );

    setMoves((current) => current + 1);
    setFlipped([flipped[0], card.id]);

    if (firstCard.pairId === card.pairId) {
      setMatched((current) => [...current, card.pairId]);
      setFlipped([]);
      return;
    }

    setLocked(true);

    timeoutRef.current = setTimeout(() => {
      setFlipped([]);
      setLocked(false);
    }, 800);
  }

  function restartGame() {
    clearTimeout(timeoutRef.current);
    setCards(createDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
    setLocked(false);
  }

  const formatTime = (time) =>
    `${Math.floor(time / 60)
      .toString()
      .padStart(2, "0")}:${(time % 60)
      .toString()
      .padStart(2, "0")}`;

  const score = Math.max(0, 1000 - moves * 20 - seconds * 2);

  return (
    <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
      <div className="relative overflow-hidden bg-emerald-950 px-5 py-8 text-white sm:px-8">
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-emerald-700/30 blur-2xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
              A little food fun
            </p>

            <h2 className="text-3xl font-black sm:text-4xl">
              Food Memory Match
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-emerald-100">
              Find all six matching food pairs. Test your memory
              and beat your best score!
            </p>
          </div>

          <span className="hidden text-5xl sm:block" aria-hidden="true">
            🍔
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-4 py-5 sm:gap-4 sm:px-8">
        {[
          { label: "Your score", value: score, emoji: "⭐" },
          { label: "Moves", value: moves, emoji: "🎯" },
          { label: "Time", value: formatTime(seconds), emoji: "⏱️" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-emerald-50 p-3 text-center dark:bg-gray-900 sm:p-4"
          >
            <div className="text-xl">{stat.emoji}</div>
            <div className="mt-1 text-xl font-black text-emerald-950 dark:text-white sm:text-2xl">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-5 sm:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {won
              ? "🎉 Delicious! You found every pair!"
              : `${matched.length} of ${FOOD_ITEMS.length} pairs found`}
          </p>

          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Best: {bestScore}
          </p>
        </div>

        <div
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4"
          aria-label="Food memory cards"
        >
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.id);
            const isMatched = matched.includes(card.pairId);
            const isVisible = isFlipped || isMatched;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => flipCard(card)}
                disabled={locked || isMatched || isFlipped || won}
                aria-label={
                  isVisible
                    ? `${card.name}${isMatched ? ", matched" : ""}`
                    : "Reveal a food card"
                }
                className={`flex aspect-square min-h-0 flex-col items-center justify-center rounded-2xl border-2 transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 ${
                  isMatched
                    ? "scale-[0.97] border-emerald-300 bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950"
                    : isVisible
                    ? "rotate-0 border-amber-300 bg-amber-50 dark:bg-gray-800"
                    : "border-emerald-800 bg-emerald-800 text-white shadow-md hover:-translate-y-1 hover:bg-emerald-700 active:scale-95 dark:border-emerald-700"
                }`}
              >
                <span className="text-3xl sm:text-4xl" aria-hidden="true">
                  {isVisible ? card.emoji : "?"}
                </span>

                {isVisible && (
                  <span className="mt-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {card.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {won && (
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-center dark:bg-emerald-950">
            <p className="text-lg font-black text-emerald-900 dark:text-emerald-100">
              You did it! 🏆
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              You scored {score} points in {formatTime(seconds)} with {moves} moves.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={restartGame}
          className="mt-5 w-full rounded-xl bg-emerald-800 px-5 py-3 font-bold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        >
          {won ? "Play Again ↻" : "Restart Game ↻"}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          No pressure, just a little fun while you explore our menu.
        </p>
      </div>
    </section>
  );
}
