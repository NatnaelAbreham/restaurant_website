
import { useEffect, useState } from "react";

const QUESTIONS = [
  {
    category: "🍎 Fruits",
    difficulty: "Easy",
    question: "Which fruit is famous for keeping the doctor away in a popular saying?",
    options: ["Banana", "Apple", "Grape", "Mango"],
    answer: "Apple",
    fact: "Apples are rich in fiber and contain vitamin C."
  },
  {
    category: "🍕 Food Facts",
    difficulty: "Easy",
    question: "Which ingredient is traditionally used to make bread rise?",
    options: ["Yeast", "Salt", "Pepper", "Vinegar"],
    answer: "Yeast",
    fact: "Yeast produces carbon dioxide, helping bread dough rise."
  },
  {
    category: "🥛 Dairy",
    difficulty: "Easy",
    question: "Which of these foods is commonly made from milk?",
    options: ["Rice", "Cheese", "Lentils", "Potato"],
    answer: "Cheese",
    fact: "Cheese is made by coagulating milk and separating the curds."
  },
  {
    category: "🌍 World Cuisine",
    difficulty: "Easy",
    question: "Which country is especially famous for sushi?",
    options: ["Brazil", "Japan", "Egypt", "Mexico"],
    answer: "Japan",
    fact: "Sushi is a well-known part of Japanese cuisine."
  },
  {
    category: "🇪🇹 Ethiopian Cuisine",
    difficulty: "Easy",
    question: "What is injera traditionally made primarily from in Ethiopia?",
    options: ["Teff", "Corn", "Potato", "Barley only"],
    answer: "Teff",
    fact: "Teff is a tiny grain used to make Ethiopia's famous injera."
  },
  {
    category: "🥕 Nutrition",
    difficulty: "Easy",
    question: "Which vegetable is well known for containing beta-carotene?",
    options: ["Carrot", "Cucumber", "Celery", "Onion"],
    answer: "Carrot",
    fact: "The body can convert beta-carotene into vitamin A."
  },
  {
    category: "🍝 World Cuisine",
    difficulty: "Medium",
    question: "Which grain is traditionally used to make risotto?",
    options: ["Wheat", "Rice", "Barley", "Oats"],
    answer: "Rice",
    fact: "Risotto is commonly prepared with starchy rice varieties such as Arborio."
  },
  {
    category: "☕ Drinks",
    difficulty: "Medium",
    question: "Ethiopia is widely recognized as the historic birthplace of which drink's beans?",
    options: ["Cocoa", "Coffee", "Black tea", "Lemonade"],
    answer: "Coffee",
    fact: "Ethiopia has a long-standing coffee-growing tradition and is central to coffee's history."
  },
  {
    category: "🧂 Cooking",
    difficulty: "Medium",
    question: "What does the cooking term 'sauté' generally mean?",
    options: [
      "Cook quickly in a little fat",
      "Cook submerged in water",
      "Freeze until firm",
      "Dry food in the sun"
    ],
    answer: "Cook quickly in a little fat",
    fact: "Sautéing uses relatively high heat and a small amount of oil or fat."
  },
  {
    category: "🍯 Ingredients",
    difficulty: "Medium",
    question: "Which ingredient is responsible for the heat in chili peppers?",
    options: ["Citric acid", "Capsaicin", "Pectin", "Lactose"],
    answer: "Capsaicin",
    fact: "Capsaicin activates heat-sensitive receptors, creating a burning sensation."
  },
  {
    category: "🍋 Food Science",
    difficulty: "Medium",
    question: "Which vitamin is especially associated with citrus fruits?",
    options: ["Vitamin B12", "Vitamin C", "Vitamin D", "Vitamin K"],
    answer: "Vitamin C",
    fact: "Oranges and lemons are well-known sources of vitamin C."
  },
  {
    category: "🍞 Baking",
    difficulty: "Medium",
    question: "What is gluten mainly formed from in wheat-based dough?",
    options: [
      "Proteins hydrated and developed during mixing",
      "Milk sugar heated in a pan",
      "Oil mixed with salt",
      "Water frozen into crystals"
    ],
    answer: "Proteins hydrated and developed during mixing",
    fact: "Gluten-forming wheat proteins help dough become elastic."
  },
  {
    category: "🧀 Food Science",
    difficulty: "Hard",
    question: "What is the main purpose of pasteurization?",
    options: [
      "Remove all water from food",
      "Reduce harmful microorganisms using controlled heat",
      "Add artificial color",
      "Increase the salt content"
    ],
    answer: "Reduce harmful microorganisms using controlled heat",
    fact: "Pasteurization uses a controlled time and temperature treatment to improve food safety."
  },
  {
    category: "🍫 Ingredients",
    difficulty: "Hard",
    question: "Which substance gives chocolate much of its characteristic bitterness?",
    options: ["Cocoa solids", "Gelatin", "Cornstarch", "Milk lactose alone"],
    answer: "Cocoa solids",
    fact: "Cocoa solids contain naturally bitter compounds; dark chocolate often has a higher proportion."
  },
  {
    category: "🥖 Baking",
    difficulty: "Hard",
    question: "What is the Maillard reaction?",
    options: [
      "Water turning into ice",
      "A browning reaction between reducing sugars and amino compounds",
      "Salt dissolving in water",
      "Oil separating from vinegar"
    ],
    answer: "A browning reaction between reducing sugars and amino compounds",
    fact: "The Maillard reaction contributes color and flavor to seared meat and toasted bread."
  },
  {
    category: "🌶️ Spices",
    difficulty: "Hard",
    question: "Which spice is traditionally obtained from the dried stigmas of a flower?",
    options: ["Cumin", "Saffron", "Cinnamon", "Ginger"],
    answer: "Saffron",
    fact: "Saffron comes from the stigmas of the Crocus sativus flower."
  },
  {
    category: "🫘 Nutrition",
    difficulty: "Hard",
    question: "Which nutrient is primarily responsible for building and repairing body tissues?",
    options: ["Protein", "Water", "Dietary fiber", "Vitamin C alone"],
    answer: "Protein",
    fact: "Proteins provide amino acids used to build and repair body tissues."
  },
  {
    category: "🫒 Cooking",
    difficulty: "Hard",
    question: "Which type of heat transfer primarily cooks the inside of a thick steak after searing?",
    options: ["Conduction", "Evaporation only", "Freezing", "Fermentation"],
    answer: "Conduction",
    fact: "Heat moves from the hotter outer layers toward the cooler center by conduction."
  }
];

const LEVELS = {
  Easy: { count: 5, time: 15, points: 10 },
  Medium: { count: 7, time: 12, points: 15 },
  Hard: { count: 10, time: 10, points: 20 }
};

const shuffle = (items) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export default function FoodQuiz() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [status, setStatus] = useState("ready");
  const [bestScore, setBestScore] = useState(() => {
    try {
      return Number(localStorage.getItem("tsedey-food-quiz-best")) || 0;
    } catch {
      return 0;
    }
  });

  const config = LEVELS[difficulty];
  const question = questions[index];
  const isCorrect = selected !== null && selected === question?.answer;
  const finished = status === "over";
  const percentage = questions.length
    ? Math.round((score / (questions.length * config.points)) * 100)
    : 0;

  const startGame = (level = difficulty) => {
    const settings = LEVELS[level];
    const pool = shuffle(QUESTIONS.filter(q => q.difficulty === level));

    setDifficulty(level);
    setQuestions(pool.slice(0, settings.count));
    setIndex(0);
    setSelected(null);
    setTimeLeft(settings.time);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setStatus("playing");
  };

  useEffect(() => {
    if (status !== "playing" || selected !== null) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          setSelected("__timeout__");
          setStreak(0);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, selected, index]);

  const answerQuestion = (option) => {
    if (selected !== null || status !== "playing") return;

    setSelected(option);

    if (option === question.answer) {
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 3 ? 5 : 0;

      setScore(previous => {
        const updated = previous + config.points + bonus;

        setBestScore(best => {
          const updatedBest = Math.max(best, updated);
          try {
            localStorage.setItem(
              "tsedey-food-quiz-best",
              String(updatedBest)
            );
          } catch {
            // Local storage is optional.
          }
          return updatedBest;
        });

        return updated;
      });

      setStreak(nextStreak);
      setBestStreak(previous => Math.max(previous, nextStreak));
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (index + 1 >= questions.length) {
      setStatus("over");
    } else {
      setIndex(previous => previous + 1);
      setSelected(null);
      setTimeLeft(config.time);
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-7 text-center">
          <div className="mb-3 text-5xl">🧠</div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
            Tsedey Restaurant Arcade
          </p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">
            Food <span className="text-emerald-400">Quiz</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
            Test your food knowledge, discover tasty facts, and
            prove you're a true food expert!
          </p>
        </header>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["⭐ SCORE", score],
            ["🏆 BEST", bestScore],
            ["🔥 STREAK", streak],
            ["📝 QUESTION", status === "ready" ? "—" : `${Math.min(index + 1, questions.length)}/${questions.length}`]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center">
              <div className="text-xs font-bold text-slate-400">{label}</div>
              <div className="mt-1 text-xl font-black">{value}</div>
            </div>
          ))}
        </div>

        {status === "ready" && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-center sm:p-9">
            <div className="mb-3 text-5xl">🍎 🥑 🍕</div>
            <h3 className="text-2xl font-black">Choose Your Challenge</h3>
            <p className="mb-6 mt-2 text-sm text-slate-300">
              Pick a difficulty and answer before time runs out.
            </p>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {Object.entries(LEVELS).map(([name, level]) => (
                <button
                  key={name}
                  onClick={() => setDifficulty(name)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    difficulty === name
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-white/10 bg-slate-900 hover:border-white/30"
                  }`}
                >
                  <div className="text-lg font-extrabold">{name}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {level.count} questions · {level.time}s each
                  </div>
                  <div className="mt-2 text-sm text-emerald-400">
                    {level.points} points per answer
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame(difficulty)}
              className="w-full rounded-xl bg-emerald-400 px-6 py-4 font-extrabold text-slate-950 transition hover:bg-emerald-300 sm:w-auto sm:min-w-56"
            >
              🎮 Start Food Quiz
            </button>
          </div>
        )}

        {status === "playing" && question && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
                {question.category}
              </span>
              <span className={`rounded-full px-3 py-2 text-sm font-extrabold ${
                timeLeft <= 4 ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white"
              }`}>
                ⏱️ {timeLeft}s
              </span>
            </div>

            <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timeLeft <= 4 ? "bg-red-400" : "bg-emerald-400"
                }`}
                style={{ width: `${(timeLeft / config.time) * 100}%` }}
              />
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              {difficulty} challenge · {config.points} points
            </p>
            <h3 className="mb-7 text-xl font-extrabold leading-relaxed sm:text-2xl">
              {question.question}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {question.options.map((option, i) => {
                const correct = option === question.answer;
                const chosen = option === selected;

                let style = "border-white/10 bg-white/[0.04] hover:border-emerald-400/60 hover:bg-emerald-400/5";

                if (selected !== null && correct) {
                  style = "border-emerald-400 bg-emerald-400/15 text-emerald-200";
                } else if (chosen && !correct) {
                  style = "border-red-400 bg-red-400/10 text-red-200";
                }

                return (
                  <button
                    key={option}
                    disabled={selected !== null}
                    onClick={() => answerQuestion(option)}
                    className={`flex min-h-16 items-center gap-3 rounded-2xl border p-4 text-left font-semibold transition disabled:cursor-default ${style}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-black">
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <span>{option}</span>
                    {selected !== null && correct && <span className="ml-auto">✓</span>}
                    {chosen && !correct && <span className="ml-auto">✕</span>}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div className={`mt-5 rounded-2xl border p-4 ${
                isCorrect
                  ? "border-emerald-400/30 bg-emerald-400/10"
                  : "border-amber-400/30 bg-amber-400/10"
              }`}>
                <p className="font-extrabold">
                  {selected === "__timeout__"
                    ? "⏰ Time's up!"
                    : isCorrect
                      ? `🎉 Correct! ${config.points + (streak >= 3 ? 5 : 0)} points earned`
                      : "💡 Not quite!"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {question.fact}
                </p>
                <button
                  onClick={nextQuestion}
                  className="mt-4 w-full rounded-xl bg-emerald-400 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-emerald-300 sm:w-auto"
                >
                  {index + 1 === questions.length ? "See Results 🏆" : "Next Question →"}
                </button>
              </div>
            )}

            <p className="mt-5 text-center text-xs text-slate-500">
              Answer quickly! A streak of 3 correct answers earns bonus points.
            </p>
          </div>
        )}

        {finished && (
          <div className="rounded-3xl border border-emerald-400/20 bg-white/[0.05] p-6 text-center sm:p-10">
            <div className="mb-3 text-6xl">
              {percentage >= 80 ? "🏆" : percentage >= 50 ? "🎉" : "🍳"}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
              Challenge Complete
            </p>
            <h3 className="mt-2 text-3xl font-black">
              {percentage >= 80 ? "Food Expert!" : percentage >= 50 ? "Great Tasting!" : "Keep Practicing!"}
            </h3>
            <div className="my-6 text-5xl font-black text-emerald-400">
              {score}
              <span className="ml-2 text-base text-slate-400">points</span>
            </div>

            <div className="mx-auto mb-6 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.05] p-4">
                <div className="text-sm text-slate-400">Accuracy score</div>
                <div className="mt-1 text-2xl font-extrabold">{percentage}%</div>
              </div>
              <div className="rounded-xl bg-white/[0.05] p-4">
                <div className="text-sm text-slate-400">Best streak</div>
                <div className="mt-1 text-2xl font-extrabold">{bestStreak} 🔥</div>
              </div>
            </div>

            <p className="mb-6 text-sm text-slate-300">
              {percentage >= 80
                ? "Amazing knowledge! You know your food."
                : "Every round is a chance to discover something delicious."}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => startGame(difficulty)}
                className="rounded-xl bg-emerald-400 px-6 py-3 font-extrabold text-slate-950 hover:bg-emerald-300"
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => setStatus("ready")}
                className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold hover:bg-white/20"
              >
                Change Difficulty
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="mb-3 font-extrabold">🍽️ Quiz Rules</h3>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <p>⏱️ Beat the countdown on every question.</p>
            <p>⭐ Build a streak to earn bonus points.</p>
            <p>📚 Learn interesting facts about food and cooking.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
