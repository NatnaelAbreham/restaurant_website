
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import MenuCard from "./MenuCard";
import { useTheme } from "../context/ThemeContext";
import api from "../api/api";

const Menu = ({ limit }) => {
  // Menu schedule
  const [menuStatus, setMenuStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [countdown, setCountdown] = useState("");

  // Menu items
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { darkMode } = useTheme();

  // =========================================================
  // CHECK MENU SCHEDULE
  // =========================================================

  const checkMenuStatus = useCallback(async () => {
    try {
      const response = await api.get("/status");
      const status = response.data;

      setMenuStatus(status);
      setError("");

      return status;
    } catch (err) {
      console.error("Failed to check menu schedule:", err);
      setError("Unable to check menu availability. Please try again.");
      return null;
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  // =========================================================
  // FETCH MENU ITEMS
  // =========================================================

  const getMenuItems = useCallback(async () => {
    try {
      const response = await api.get("/getitem");
      const data = response.data.data ?? [];

      const items = data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        category: item.categoryId === 1 ? "Food" : "Drinks",

        image: `/uploads/${(item.imageUrl ?? "").replace(
          /^itemimage[\\/]/,
          ""
        )}`,

        popular: false,

        // Stock and availability
        quantityLimit: item.quantityLimit,
        isAvailable: item.isAvailable,
        quantityAvailable: item.quantityAvailable,
      }));

      setMenuItems(items);
      setError("");
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError("Failed to load menu.");
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // INITIALIZE MENU
  // CHECK SCHEDULE BEFORE FETCHING ITEMS
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const initializeMenu = async () => {
      const status = await checkMenuStatus();

      if (cancelled) return;

      if (status?.isOpen) {
        await getMenuItems();
      } else {
        setMenuItems([]);
        setLoading(false);
      }
    };

    initializeMenu();

    return () => {
      cancelled = true;
    };
  }, [checkMenuStatus, getMenuItems]);

  // =========================================================
  // AUTOMATIC SCHEDULE REFRESH EVERY 30 SECONDS
  // =========================================================

  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await checkMenuStatus();

      if (!status) return;

      if (!status.isOpen) {
        setMenuItems([]);
        setLoading(false);
      } else {
        // If the schedule has just opened, fetch the menu.
        await getMenuItems();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [checkMenuStatus, getMenuItems]);

  // =========================================================
  // REFRESH ITEMS EVERY 5 SECONDS WHILE MENU IS OPEN
  // =========================================================

  useEffect(() => {
    if (!menuStatus?.isOpen) return;

    const interval = setInterval(() => {
      getMenuItems();
    }, 5000);

    return () => clearInterval(interval);
  }, [menuStatus?.isOpen, getMenuItems]);

  // =========================================================
  // COUNTDOWN TO NEXT OPENING
  // =========================================================

  useEffect(() => {
    if (
      !menuStatus ||
      menuStatus.isOpen ||
      !menuStatus.nextOpening
    ) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const target = new Date(menuStatus.nextOpening).getTime();
      const difference = target - Date.now();

      if (Number.isNaN(target) || difference <= 0) {
        setCountdown("00:00:00");
        return;
      }

      const hours = Math.floor(difference / 3600000);
      const minutes = Math.floor(
        (difference % 3600000) / 60000
      );
      const seconds = Math.floor(
        (difference % 60000) / 1000
      );

      setCountdown(
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`
      );
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [menuStatus]);

  // =========================================================
  // CATEGORY FILTERING
  // =========================================================

  const categories = useMemo(
    () => [
      "All",
      ...new Set(menuItems.map((item) => item.category)),
    ],
    [menuItems]
  );

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === activeCategory
        );

  const displayItems = limit
    ? filteredItems.slice(0, limit)
    : filteredItems;

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loadingStatus || (loading && menuStatus?.isOpen)) {
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
            {loadingStatus
              ? "Checking menu availability..."
              : "Preparing our menu..."}
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (error) {
    return (
      <section
        className={`min-h-[500px] flex items-center justify-center px-4 ${
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

          <p className="text-red-500 font-medium">{error}</p>

          <p
            className={`text-sm mt-2 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Please try again.
          </p>

          <button
            onClick={async () => {
              setError("");
              setLoading(true);
              setLoadingStatus(true);

              const status = await checkMenuStatus();

              if (status?.isOpen) {
                await getMenuItems();
              } else {
                setMenuItems([]);
                setLoading(false);
              }
            }}
            className="mt-5 rounded-full bg-orange-500 px-6 py-2.5 text-white font-semibold hover:bg-orange-600 transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // =========================================================
  // MENU CLOSED SCREEN
  // =========================================================

  if (menuStatus && !menuStatus.isOpen) {
    return (
      <section
        className={`min-h-screen flex items-center justify-center px-5 py-16 transition-colors duration-300 ${
          darkMode
            ? "bg-gray-950 text-white"
            : "bg-[#e7f2fd] text-gray-900"
        }`}
      >
        <div className="w-full max-w-2xl text-center">
          <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10 text-5xl">
            🍽️
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Thank you for visiting
          </p>

          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Our Kitchen Is Taking a Break
          </h1>

          <p
            className={`mx-auto mt-5 max-w-lg text-base leading-7 sm:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            We're not accepting menu orders right now, but
            we'll be delighted to serve you when we reopen.
          </p>

          {menuStatus.nextOpening && (
            <div
              className={`mx-auto mt-9 max-w-md rounded-3xl border p-7 shadow-xl ${
                darkMode
                  ? "border-gray-800 bg-gray-900"
                  : "border-white bg-white/80"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                WE OPEN IN
              </p>

              <div className="my-4 font-mono text-4xl font-extrabold tracking-wider text-orange-500 sm:text-5xl">
                {countdown || "--:--:--"}
              </div>

              <div
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {menuStatus.nextOpeningDay && (
                  <span>{menuStatus.nextOpeningDay}</span>
                )}

                {menuStatus.nextOpeningTime && (
                  <span> at {menuStatus.nextOpeningTime}</span>
                )}
              </div>
            </div>
          )}

          {!menuStatus.nextOpening && (
            <p className="mt-8 text-sm text-gray-500">
              Our next opening time has not been announced.
              Please check back soon.
            </p>
          )}

          <p className="mt-8 text-sm text-gray-500">
            We look forward to serving you!
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // ORIGINAL MENU DESIGN
  // =========================================================

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
                Our <span className="text-orange-500">Menu</span>
              </>
            )}
          </h2>

          <p
            className={`mt-4 text-base sm:text-lg leading-7 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {limit
              ? "A selection of dishes our guests love, prepared with fresh ingredients and authentic flavor."
              : "Discover delicious food and refreshing drinks prepared with care, tradition, and fresh ingredients."}
          </p>

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
              <MenuCard key={item.id} item={item} />
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
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
            >
              View Full Menu
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;