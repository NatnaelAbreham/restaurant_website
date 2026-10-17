
import { useState } from "react";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy", emoji: "🌱" },
  { value: "medium", label: "Medium", emoji: "⚡" },
  { value: "hard", label: "Hard", emoji: "🔥" },
];

function getResult(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }

  return {
    winner: board.every(Boolean) ? "draw" : null,
    line: [],
  };
}

function findWinningMove(board, player) {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const next = [...board];
      next[i] = player;

      if (getResult(next).winner === player) return i;
    }
  }

  return -1;
}

function minimax(board, isMaximizing, depth = 0) {
  const { winner } = getResult(board);

  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (winner === "draw") return 0;

  const available = board
    .map((cell, i) => (cell ? -1 : i))
    .filter((i) => i !== -1);

  if (isMaximizing) {
    let best = -Infinity;

    for (const i of available) {
      const next = [...board];
      next[i] = "O";
      best = Math.max(best, minimax(next, false, depth + 1));
    }

    return best;
  }

  let best = Infinity;

  for (const i of available) {
    const next = [...board];
    next[i] = "X";
    best = Math.min(best, minimax(next, true, depth + 1));
  }

  return best;
}

function getComputerMove(board, difficulty) {
  const available = board
    .map((cell, i) => (cell ? -1 : i))
    .filter((i) => i !== -1);

  if (!available.length) return -1;

  if (difficulty === "easy") {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Take a winning move whenever possible.
  const winningMove = findWinningMove(board, "O");
  if (winningMove !== -1) return winningMove;

  if (difficulty === "medium") {
    // Block the player's immediate win.
    const blockingMove = findWinningMove(board, "X");
    if (blockingMove !== -1) return blockingMove;

    // Prefer the center, then corners.
    if (available.includes(4)) return 4;

    const corners = [0, 2, 6, 8].filter((i) =>
      available.includes(i)
    );

    if (corners.length) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return available[Math.floor(Math.random() * available.length)];
  }

  // Hard: minimax evaluates every possible outcome.
  let bestScore = -Infinity;
  let bestMoves = [];

  for (const i of available) {
    const next = [...board];
    next[i] = "O";

    const score = minimax(next, false, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [i];
    } else if (score === bestScore) {
      bestMoves.push(i);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [difficulty, setDifficulty] = useState("medium");
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [isThinking, setIsThinking] = useState(false);

  const result = getResult(board);
  const gameOver = Boolean(result.winner);

  function playCell(index) {
    if (board[index] || gameOver || isThinking) return;

    const next = [...board];
    next[index] = "X";

    const playerResult = getResult(next);

    if (playerResult.winner) {
      finishGame(next, playerResult.winner);
      return;
    }

    const computerMove = getComputerMove(next, difficulty);

    if (computerMove === -1) {
      finishGame(next, "draw");
      return;
    }

    next[computerMove] = "O";
    const finalResult = getResult(next);

    if (finalResult.winner) {
      finishGame(next, finalResult.winner);
    } else {
      setBoard(next);
    }
  }

  function finishGame(finalBoard, winner) {
    setBoard(finalBoard);
    setScores((previous) => ({
      ...previous,
      [winner]: previous[winner] + 1,
    }));
  }

  function resetBoard() {
    setBoard(Array(9).fill(null));
    setIsThinking(false);
  }

  function resetAll() {
    resetBoard();
    setScores({ X: 0, O: 0, draw: 0 });
  }

  let status = "Your turn! Pick a square.";
  if (result.winner === "X") status = "🎉 You win! Great strategy!";
  if (result.winner === "O") status = "🤖 Computer wins! Try again.";
  if (result.winner === "draw") status = "🤝 It's a draw! Well played.";

  return (
    <section className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
      <div className="bg-emerald-950 px-5 py-7 text-center text-white sm:px-8">
        <div className="mb-2 text-4xl">⭕ ❌</div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
          Take a break & play
        </p>
        <h2 className="mt-2 text-3xl font-black sm:text-4xl">
          Tic-Tac-Toe
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-emerald-100">
          Can you beat the computer? Choose your challenge and make your move!
        </p>
      </div>

      <div className="p-4 sm:p-7">
        <p className="mb-3 text-center text-sm font-bold text-gray-700 dark:text-gray-200">
          Choose difficulty
        </p>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setDifficulty(item.value);
                resetBoard();
              }}
              className={`rounded-xl border-2 px-2 py-3 text-sm font-bold transition ${
                difficulty === item.value
                  ? "border-emerald-700 bg-emerald-800 text-white"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              <span className="mr-1">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            You: X
          </span>
          <span className="rounded-full bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            Computer: O
          </span>
        </div>

        <div
          className="mx-auto grid w-full max-w-sm grid-cols-3 gap-2 sm:gap-3"
          role="group"
          aria-label="Tic-Tac-Toe board"
        >
          {board.map((cell, index) => {
            const winningCell = result.line.includes(index);

            return (
              <button
                key={index}
                onClick={() => playCell(index)}
                disabled={Boolean(cell) || gameOver || isThinking}
                aria-label={`Square ${index + 1}${cell ? `, ${cell}` : ", empty"}`}
                className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-4xl font-black transition sm:text-5xl ${
                  winningCell
                    ? "scale-95 border-emerald-400 bg-emerald-100 dark:bg-emerald-900"
                    : cell
                    ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                    : "border-emerald-100 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100 active:scale-95 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-emerald-950"
                } ${
                  cell === "X"
                    ? "text-blue-600 dark:text-blue-400"
                    : cell === "O"
                    ? "text-rose-500 dark:text-rose-400"
                    : ""
                }`}
              >
                {cell}
              </button>
            );
          })}
        </div>

        <div
          className="mt-5 rounded-2xl bg-emerald-50 px-4 py-4 text-center dark:bg-emerald-950"
          aria-live="polite"
        >
          <p className="font-bold text-emerald-950 dark:text-emerald-100">
            {status}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Your wins", value: scores.X, color: "text-blue-600" },
            { label: "Computer wins", value: scores.O, color: "text-rose-500" },
            { label: "Draws", value: scores.draw, color: "text-emerald-600" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900"
            >
              <div className={`text-2xl font-black ${item.color}`}>
                {item.value}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={resetBoard}
            className="flex-1 rounded-xl bg-emerald-800 px-4 py-3 font-bold text-white transition hover:bg-emerald-700"
          >
            Play Again ↻
          </button>
          <button
            onClick={resetAll}
            className="rounded-xl border border-gray-200 px-4 py-3 font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Reset Scores
          </button>
        </div>
      </div>
    </section>
  );
}
