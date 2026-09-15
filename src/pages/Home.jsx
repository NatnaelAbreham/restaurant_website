import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FaArrowRight,
  FaClock,
  FaHeart,
  FaUtensils,
  FaStar,
  FaLeaf,
  FaCheck,
} from "react-icons/fa";

const Home = () => {
  const { darkMode } = useTheme();

  const heroImage =
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=85&w=2000&auto=format&fit=crop";
  const stats = [
    {
      value: "15+",
      label: "Years Experience",
      icon: <FaClock />,
    },
    {
      value: "20K+",
      label: "Happy Customers",
      icon: <FaHeart />,
    },
    {
      value: "50+",
      label: "Signature Dishes",
      icon: <FaUtensils />,
    },
    {
      value: "4.9",
      label: "Customer Rating",
      icon: <FaStar />,
    },
  ];

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${darkMode
          ? "bg-gray-950 text-white"
          : "bg-[#e7f2fd] text-gray-900"
        }`}
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />

        {/* Image Overlay */}
        <div
          className={`absolute inset-0 ${darkMode
              ? "bg-black/60"
              : "bg-black/40"
            }`}
        />

        {/* Gradient for text readability */}
        <div
          className={`absolute inset-0 ${darkMode
              ? "bg-gradient-to-r from-black/80 via-black/45 to-black/20"
              : "bg-gradient-to-r from-black/65 via-black/30 to-transparent"
            }`}
        />

        {/* Warm Glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[150px]" />

        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-orange-500/15 blur-[150px]" />

        {/* =================================================
            HERO CONTENT
        ================================================== */}

        <div className="relative z-10 min-h-[calc(100vh-76px)] flex items-center">

          <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-28">

            <div className="max-w-3xl">

              {/* Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-7">

                <FaLeaf className="text-orange-400 text-sm" />

                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                  Authentic Ethiopian Cuisine
                </span>

              </div>


              {/* Heading */}
              <h1 className="home-hero-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">

                Taste Tradition

                <span className="home-hero-highlight block mt-3">
                  In Every Bite
                </span>

              </h1>

              {/* Description */}
              <p className="home-hero-description mt-7 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed">
                Discover authentic Ethiopian flavors prepared with fresh
                ingredients, traditional recipes, and a passion for bringing
                people together around great food.
              </p>

              <style>{`
    .home-hero-heading {
        color: white;
    }

    .home-hero-description {
        color: white;
    }

    .home-hero-highlight {
        color: #fb923c;
    }
`}</style>



              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-9">

                {/* Order */}
                <Link
                  to="/menu"
                  className="group flex items-center gap-3 px-7 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xl shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1"
                >
                  Order Now

                  <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Menu */}
                <Link
                  to="/menu"
                  className="flex items-center gap-3 px-7 py-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md border border-white/30 font-semibold transition-all duration-300"
                >
                  Explore Menu
                </Link>

              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-9 text-sm text-gray-200">

                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500">
                    <FaCheck className="text-[9px]" />
                  </span>

                  Fresh Ingredients
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500">
                    <FaCheck className="text-[9px]" />
                  </span>

                  Traditional Recipes
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500">
                    <FaCheck className="text-[9px]" />
                  </span>

                  Warm Hospitality
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================== */}

        <div className="absolute bottom-0 left-0 right-0 z-20">

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-6">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">

              {stats.map((item) => (
                <div
                  key={item.label}
                  className="bg-black/35 hover:bg-black/50 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-4 transition-all duration-300"
                >

                  <div className="flex items-center justify-center gap-3">

                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/15 text-orange-400">
                      {item.icon}
                    </div>

                    <div className="text-center sm:text-left">

                      <div className="text-xl sm:text-2xl font-black text-white">
                        {item.value}
                      </div>

                      <div className="text-[10px] sm:text-xs text-gray-300 font-medium">
                        {item.label}
                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          </div>
        </div>

      </section>

      {/* =====================================================
          WELCOME SECTION
      ====================================================== */}

      <section
        className={`py-20 sm:py-24 transition-colors duration-300 ${darkMode
            ? "bg-gray-950"
            : "bg-[#e7f2fd]"
          }`}
      >

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <span className="text-orange-500 font-bold text-sm uppercase tracking-[0.2em]">
              Welcome to Tsedey
            </span>

            <h2
              className={`mt-3 text-3xl sm:text-4xl md:text-5xl font-black ${darkMode
                  ? "text-white"
                  : "text-gray-900"
                }`}
            >
              More than just a meal.

              <span className="block text-orange-500">
                It's an experience.
              </span>
            </h2>

            <p
              className={`mt-5 max-w-2xl leading-relaxed ${darkMode
                  ? "text-gray-400"
                  : "text-gray-600"
                }`}
            >
              At Tsedey Restaurant, we bring together authentic Ethiopian
              flavors, carefully selected ingredients, and genuine hospitality
              to create memorable dining experiences.
            </p>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 mt-7 text-orange-500 font-bold hover:text-orange-600 transition"
            >
              Discover our menu
              <FaArrowRight className="text-sm" />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Home;