// src/components/OrderSuccess.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const OrderSuccess = ({
    onClose,
    order
}) => {
    const { darkMode } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only animation
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        return () => {
            clearTimeout(showTimer);
        };
    }, []);

    if (!order) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-[60] transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
        >

            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* MODAL */}
            <div
                className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 ${
                    isVisible ? "scale-100" : "scale-95"
                } ${
                    darkMode
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                }`}
            >

                {/* SUCCESS ICON */}
                <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
                        darkMode
                            ? "bg-green-500/10"
                            : "bg-green-100"
                    }`}
                >
                    <svg
                        className="w-10 h-10 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-bold mb-2">
                    Order Placed Successfully!
                </h3>

                <p
                    className={`mb-6 ${
                        darkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                    }`}
                >
                    Thank you for your order!
                    Your order has been successfully received.
                </p>

                {/* ORDER INFORMATION */}
                <div
                    className={`rounded-xl p-4 mb-6 text-left ${
                        darkMode
                            ? "bg-gray-800"
                            : "bg-gray-50"
                    }`}
                >

                    {/* ORDER NUMBER */}
                    <div className="flex justify-between items-center mb-3">
                        <span
                            className={
                                darkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                            }
                        >
                            Order Number
                        </span>

                        <span className="font-bold text-orange-500">
                            {order.orderNumber}
                        </span>
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-between items-center mb-3">
                        <span
                            className={
                                darkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                            }
                        >
                            Total
                        </span>

                        <span className="font-bold">
                            ${Number(order.totalPrice).toFixed(2)}
                        </span>
                    </div>

                    {/* STATUS */}
                    <div className="flex justify-between items-center">
                        <span
                            className={
                                darkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                            }
                        >
                            Status
                        </span>

                        <span className="font-semibold text-green-500">
                            {order.status}
                        </span>
                    </div>

                </div>

                {/* DELIVERY INFORMATION */}
                <div
                    className={`rounded-lg p-3 mb-6 ${
                        darkMode
                            ? "bg-gray-800 text-orange-300"
                            : "bg-orange-50 text-orange-600"
                    }`}
                >
                    <p className="text-sm">
                        Estimated delivery time: 25–35 minutes
                    </p>
                </div>

                {/* OK BUTTON */}
                <button
                    onClick={onClose}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300"
                >
                    OK
                </button>

            </div>
        </div>
    );
};

export default OrderSuccess;