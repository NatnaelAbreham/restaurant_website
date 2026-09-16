import { useEffect, useMemo, useState } from "react";
import MenuCard from "./MenuCard";
import { useTheme } from "../context/ThemeContext";
import api from "../api/api";

const Menu = ({ limit }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");

  const { darkMode } = useTheme();

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        const response = await api.get("/getitem");

        const items = response.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          categoryId: item.categoryId,
          category: item.categoryId === 1 ? "Food" : "Drinks",
          image: `/uploads/${item.imageUrl}`,
          popular: false,

          // Stock information
          quantityLimit: item.quantityLimit,
          isAvailable: item.isAvailable,
          quantityAvailable: item.quantityAvailable,
        }));

        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError("Failed to load menu.");
      } finally {
        setLoading(false);
      }
    };

    // Load immediately
    getMenuItems();

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      getMenuItems();
    }, 5000);

    // Cleanup when component is removed
    return () => clearInterval(interval);
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(menuItems.map((item) => item.category))];
  }, [menuItems]);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const displayItems = limit
    ? filteredItems.slice(0, limit)
    : filteredItems;

  if (loading) {
    return (
      <section
        className={`min-h-[500px] flex items-center justify-center ${
          darkMode
            ? "bg-gray-950 text-white"
            : "bg-[#e7f2fd] text-gray-900"
        }`}
      >
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Preparing our menu...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={`min-h-[500px] flex items-center justify-center ${
          darkMode
            ? "bg-gray-950 text-white"
            : "bg-[#e7f2fd] text-gray-900"
        }`}
      >
        <div
          className={`text-center p-8 rounded-2xl border ${
            darkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="text-4xl mb-3">!</div>

          <p className="text-red-500 font-medium">
            {error}
          </p>

          <p
            className={`text-sm mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-[#e7f2fd] text-gray-900"
      }`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 -left-24 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[45%] -right-24 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-14">

          {/* Small label */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-5 ${
              darkMode
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                : "bg-orange-50 text-orange-600 border border-orange-100"
            }`}
          >
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            {limit ? "Taste Something Special" : "Explore Our Menu"}
          </div>

          {/* Heading */}
          <h2
            className={`text-4xl sm:text-5xl font-bold tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {limit ? (
              <>
                Featured{" "}
                <span className="text-orange-500">Menu</span>
              </>
            ) : (
              <>
                Our{" "}
                <span className="text-orange-500">Menu</span>
              </>
            )}
          </h2>

          {/* Description */}
          <p
            className={`mt-4 text-base sm:text-lg leading-7 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {limit
              ? "A selection of dishes our guests love, prepared with fresh ingredients and authentic flavor."
              : "Discover delicious food and refreshing drinks prepared with care, tradition, and fresh ingredients."}
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-7">
            <span
              className={`w-12 h-px ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span
              className={`w-12 h-px ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            />
          </div>
        </div>

        {/* CATEGORY FILTER */}
        {!limit && (
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105"
                    : darkMode
                    ? "bg-gray-900 text-gray-400 border border-gray-800 hover:border-orange-500/40 hover:text-orange-400"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500 shadow-sm"
                }`}
              >
                {category}

                {activeCategory === category && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* MENU GRID */}
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div
              className={`w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center text-2xl ${
                darkMode
                  ? "bg-gray-900 text-gray-600"
                  : "bg-white text-gray-300"
              }`}
            >
              🍽
            </div>

            <h3 className="text-lg font-semibold">
              No dishes found
            </h3>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              There are no items in this category right now.
            </p>
          </div>
        )}

        {/* FEATURED MENU CTA */}
        {limit && displayItems.length > 0 && (
          <div className="text-center mt-14">
            <a
              href="/menu"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
            >
              View Full Menu
              <span className="text-lg leading-none">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;

