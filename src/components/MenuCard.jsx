
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
      className={`rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />

        {item.popular && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {item.name}
          </h3>

          <span className="text-orange-500 font-bold">
            ${item.price}
          </span>
        </div>

        <p
          className={`text-sm mb-4 line-clamp-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {item.description}
        </p>

        {/* STOCK INFORMATION */}
        {item.isAvailable && item.quantityAvailable !== null && (
          <p className="text-xs text-gray-500 mt-2 mb-3">
            {Math.max(
              0,
              item.quantityAvailable - currentQuantity
            )}{" "}
            available
          </p>
        )}

        <div className="flex justify-between items-center">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              darkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.category}
          </span>

          <button
            disabled={
              !item.isAvailable || quantityLimitReached
            }
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-1 ${
              !item.isAvailable || quantityLimitReached
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : isAdded
                ? "bg-green-500 text-white"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
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

