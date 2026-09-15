// src/components/CartSidebar.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeItem,
  totalPrice,
  onPlaceOrder,
}) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-md shadow-2xl z-50 transition-all duration-300 overflow-hidden ${darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900"
          }`}
      >
        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div
            className={`flex items-center justify-between border-b p-5 ${darkMode ? "border-gray-800" : "border-gray-200"
              }`}
          >
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <svg
                className="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6"
                />
              </svg>
              Your Order
            </h2>

            <button
              onClick={onClose}
              className={`transition ${darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-400 hover:text-gray-700"
                }`}
            >
              ✕
            </button>
          </div>

          {/* CART CONTENT */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* EMPTY STATE */}
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className={`text-lg font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Your cart is empty
                </p>
                <p className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Add some delicious items
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {cartItems.map((item) => (
                  
                  <div
                    key={item.id}
                    className={`flex gap-4 rounded-2xl p-3 transition ${darkMode ? "bg-gray-900" : "bg-gray-50"
                      }`}
                  >
                    {/* IMAGE */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    {/* DETAILS */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {item.name}
                          </h4>
                          <p className="mt-1 font-medium text-orange-500">
                            ${item.price}
                          </p>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-500 transition"
                        >
                          🗑
                        </button>
                      </div>

                      {/* QUANTITY */}
                      <div className="mt-3 flex items-center gap-3">
                        {/* MINUS */}
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${item.quantity <= 1
                            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                            : darkMode
                              ? "bg-gray-800 hover:bg-gray-700"
                              : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                          -
                        </button>

                        {/* CURRENT QUANTITY */}
                        <span className="w-5 text-center">
                          {item.quantity}
                        </span>

                        {/* PLUS */}
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantityLimit === true &&
                            item.quantityAvailable !== null &&
                            item.quantity >= item.quantityAvailable
                          }
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${item.quantityLimit === true &&
                            item.quantityAvailable !== null &&
                            item.quantity >= item.quantityAvailable
                            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                            : darkMode
                              ? "bg-gray-800 hover:bg-gray-700"
                              : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                          +
                        </button>
                      </div>

                      {/* STOCK INFORMATION */}
                      {item.quantityLimit === true &&
                        item.quantityAvailable !== null && (
                          <p className="mt-2 text-xs text-gray-500">
                            {Math.max(
                              0,
                              item.quantityAvailable - item.quantity
                            )}{" "}
                            available
                          </p>
                        )}
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* FOOTER */}
          {cartItems.length > 0 && (
            <div
              className={`border-t p-5 space-y-4 ${darkMode ? "border-gray-800" : "border-gray-200"
                }`}
            >
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-orange-500">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={onPlaceOrder}
                className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 transition"
              >
                Place Order
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CartSidebar;