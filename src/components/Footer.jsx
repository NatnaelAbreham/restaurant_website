import React from "react";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const year = new Date().getFullYear();
  const { darkMode } = useTheme();

  return (
    <footer
      className={`mt-auto transition-colors duration-300 border-t ${
        darkMode
          ? "bg-gray-950 border-gray-800 text-white"
          : "bg-slate-50 border-slate-200 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">

        {/* Brand */}
        <h3 className="text-lg font-semibold">
          Tsedey Restaurant
        </h3>

        {/* Tagline */}
        <p
          className={`mt-2 text-sm ${
            darkMode ? "text-gray-400" : "text-slate-500"
          }`}
        >
          Fresh taste • Modern dining • Delivered with care
        </p>

        {/* Divider */}
        <div
          className={`my-7 h-px bg-gradient-to-r from-transparent ${
            darkMode
              ? "via-gray-700"
              : "via-slate-200"
          } to-transparent`}
        />

        {/* Copyright */}
        <p
          className={`text-xs ${
            darkMode ? "text-gray-400" : "text-slate-500"
          }`}
        >
          © {year} Tsedey Restaurant. All rights reserved.
        </p>

        {/* Accent */}
        <p className="mt-3 text-xs text-orange-500">
          Built with passion 
        </p>

      </div>
    </footer>
  );
};

export default Footer;