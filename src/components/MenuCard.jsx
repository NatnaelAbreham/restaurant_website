
// src/components/MenuCard.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

const MenuCard = ({ item }) => {
  const [isAdded, setIsAdded] = useState(false);

  const { darkMode } = useTheme();
  const { addToCart, cartItems } = useCart();

  // Find this item in the cart
  const cartItem = cartItems?.find(
    (cartItem) => cartItem.id === item.id
  );

  const currentQuantity = cartItem?.quantity || 0;

  const quantityLimitReached =
    item.quantityLimit === true &&
    item.quantityAvailable !== null &&
    currentQuantity >= item.quantityAvailable;

  const handleAddToCart = () => {
    // Item is unavailable
    if (!item.isAvailable) return;

    // Quantity limit reached
    if (quantityLimitReached) return;

    addToCart(item);

    setIsAdded(true);

    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${
        darkMode
          ? "bg-gray-900 border-gray-800 shadow-lg shadow-black/20 hover:border-orange-500/30 hover:shadow-orange-500/10"
          : "bg-white border-gray-100 shadow-lg shadow-gray-200/50 hover:border-orange-200 hover:shadow-xl"
      }`}
    >
      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Popular badge */}
        {item.popular && (
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg">
            ★ Popular
          </span>
        )}

        {/* Category badge */}
        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium border border-white/20">
          {item.category}
        </span>

        {/* Availability */}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-5 py-2 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-semibold border border-white/20">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* Name + Price */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3
            className={`text-xl font-bold leading-tight transition-colors duration-300 ${
              darkMode
                ? "text-white group-hover:text-orange-400"
                : "text-gray-900 group-hover:text-orange-500"
            }`}
          >
            {item.name}
          </h3>

          <div className="shrink-0">
            <span className="text-lg font-bold text-orange-500">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-sm leading-6 mb-4 line-clamp-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {item.description}
        </p>

        {/* STOCK INFORMATION */}
        {item.isAvailable && item.quantityAvailable !== null && (
          <div
            className={`flex items-center gap-2 mb-4 text-xs font-medium ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                Math.max(
                  0,
                  item.quantityAvailable - currentQuantity
                ) <= 3
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            />

            <span>
              {Math.max(
                0,
                item.quantityAvailable - currentQuantity
              )}{" "}
              available
            </span>
          </div>
        )}

        {/* Divider */}
        <div
          className={`border-t mb-4 ${
            darkMode ? "border-gray-800" : "border-gray-100"
          }`}
        />

        {/* BOTTOM ACTION */}
        <div className="flex justify-between items-center gap-3">
          {/* Category */}
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              darkMode
                ? "bg-orange-500/10 text-orange-400"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            {item.category}
          </span>

          {/* Add to cart */}
          <button
            disabled={!item.isAvailable || quantityLimitReached}
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
              !item.isAvailable || quantityLimitReached
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : isAdded
                ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 active:scale-95"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isAdded ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              )}
            </svg>

            <span>
              {!item.isAvailable
                ? "Out of Stock"
                : quantityLimitReached
                ? "Limit Reached"
                : isAdded
                ? "Added!"
                : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;

