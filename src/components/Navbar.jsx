import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import {
  FaMoon,
  FaSun,
  FaShoppingBag,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { setIsCartOpen, totalItems } = useCart();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${darkMode
          ? "bg-gray-950/90 border-gray-800"
          : "bg-white/90 border-gray-200"
        } backdrop-blur-xl border-b`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="h-[76px] flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 group"
          >
            <div className="flex flex-col leading-none">
              <span
                className={`text-xl sm:text-2xl font-black tracking-tight ${darkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Tsedey
              </span>

              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-orange-500 mt-1">
                Restaurant
              </span>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex items-center">
            <div
              className={`flex items-center gap-1 p-1 rounded-full ${darkMode
                  ? "bg-gray-900 border border-gray-800"
                  : "bg-gray-50 border border-gray-200"
                }`}
            >
              {navLinks.map((link) => {
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${active
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : darkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${darkMode
                  ? "bg-gray-900 text-yellow-400 border border-gray-800 hover:bg-gray-800"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                }`}
            >
              {darkMode ? (
                <FaSun className="text-sm" />
              ) : (
                <FaMoon className="text-sm" />
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition shadow-md"
            >
              <FaShoppingCart />

              <span className="hidden sm:inline">
                Cart
              </span>

              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-5 h-5 px-1
                  flex items-center justify-center text-xs font-bold
                  text-white rounded-full bg-gradient-to-br
                  from-orange-400 to-red-500 shadow-[0_0_12px_rgba(255,100,0,0.6)]
                  animate-bounce"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Order Now */}
            <Link
              to="/menu"
              className="hidden lg:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30"
            >
              Order Now
              <FaArrowRight className="text-xs" />
            </Link>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full ${darkMode
                  ? "bg-gray-900 text-white border border-gray-800"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div
          className={`px-5 pb-6 pt-2 border-t ${darkMode
              ? "bg-gray-950 border-gray-800"
              : "bg-white border-gray-200"
            }`}
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
                      ? "bg-orange-500 text-white"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {link.name}

                  {active && (
                    <FaArrowRight className="text-xs" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Order Button */}
          <Link
            to="/menu"
            onClick={closeMobileMenu}
            className="mt-4 flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-all"
          >
            Order Now
            <FaArrowRight className="text-xs" />
          </Link>

          {/* Mobile Theme */}
          <button
            onClick={() => {
              toggleDarkMode();
              setMobileOpen(false);
            }}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold ${darkMode
                ? "bg-gray-900 text-yellow-400 border border-gray-800"
                : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

