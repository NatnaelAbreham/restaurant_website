import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import api from "../api/api";

const InternalTransferConfirmation = ({
    isOpen,
    onClose,
    accountNumber,
    accountDetails,
    cartItems,
    totalPrice,
    onOrderCreated,
}) => {
    const { darkMode } = useTheme();
    const { clearCart } = useCart();

    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderError, setOrderError] = useState("");

    const handleConfirmOrder = async () => {
        try {
            setIsCreatingOrder(true);
            setOrderError("");

            const response = await api.post("/createorder", {
                phoneNumber: accountDetails?.phoneNumber,
                accountNumber: accountDetails?.accountNumber,
                paymentMethod: "InternalTransfer",
                totalAmount: totalPrice,

                items: cartItems.map((item) => ({
                    itemId: item.id,
                    quantity: item.quantity,
                })),
            });

            if (response.data.success) {
                const order = response.data.data;

                console.log("Internal transfer order created:", order);

                // Clear cart only after successful order creation
                clearCart();

                // Close confirmation
                onClose();

                // Send order to parent
                onOrderCreated(order);
            } else {
                setOrderError(
                    response.data.message || "Failed to create order"
                );
            }
        } catch (error) {
            console.error("Internal transfer order failed:", error);

            setOrderError(
                error.response?.data?.message ||
                "Failed to create order"
            );
        } finally {
            setIsCreatingOrder(false);
        }
    };

    if (!isOpen) return null;

    const maskAccountNumber = (account) => {
        if (!account) return "";

        return (
            "*********" +
            account.slice(-4)
        );
    };

    const maskPhoneNumber = (phone) => {
        if (!phone) return "";

        return (
            phone.substring(0, 2) +
            "*******" +
            phone.substring(phone.length - 4)
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[90]">

            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* MODAL */}
            <div
                className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl p-6 ${darkMode
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }`}
            >

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Confirm Your Order
                        </h2>

                        <p
                            className={`text-sm mt-1 ${darkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                        >
                            Internal Transfer
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className={`text-xl ${darkMode
                                ? "text-gray-400 hover:text-white"
                                : "text-gray-400 hover:text-gray-700"
                            }`}
                    >
                        ✕
                    </button>

                </div>

                {/* ORDER ITEMS */}
                <div className="space-y-3 max-h-60 overflow-y-auto mb-5">

                    {cartItems.map((item) => (

                        <div
                            key={item.id}
                            className={`flex justify-between items-center p-3 rounded-xl ${darkMode
                                    ? "bg-gray-800"
                                    : "bg-gray-50"
                                }`}
                        >

                            <div>
                                <p className="font-semibold">
                                    {item.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {item.quantity} × ${item.price}
                                </p>
                            </div>

                            <p className="font-semibold text-orange-500">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>

                        </div>

                    ))}

                </div>

                {/* TOTAL */}
                <div
                    className={`flex justify-between border-t pt-4 mb-6 ${darkMode
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`}
                >
                    <span className="text-lg font-bold">
                        Total
                    </span>

                    <span className="text-lg font-bold text-orange-500">
                        ${totalPrice.toFixed(2)}
                    </span>
                </div>

                {/* ACCOUNT INFORMATION */}
                <div
                    className={`rounded-xl p-4 mb-5 ${darkMode
                            ? "bg-gray-800"
                            : "bg-gray-50"
                        }`}
                >

                    <h3 className="font-semibold mb-3">
                        Payment Account
                    </h3>

                    <div className="flex justify-between text-sm mb-2">
                        <span>Account Number</span>

                        <span className="font-medium">
                            {maskAccountNumber(accountDetails?.accountNumber)}
                        </span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Phone Number</span>

                        <span className="font-medium">
                            {maskPhoneNumber(accountDetails?.phoneNumber)}
                        </span>
                    </div>

                </div>
                {orderError && (
                    <p
                        className="mb-3 text-sm text-center font-medium"
                        style={{ color: "red" }}
                    >
                        {orderError}
                    </p>
                )}
                {/* CONFIRM */}
                <button
                    onClick={handleConfirmOrder}
                    disabled={isCreatingOrder}
                    className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isCreatingOrder ? "Creating Order..." : "Confirm Order"}
                </button>

                {/* CANCEL */}
                <button
                    onClick={onClose}
                    className={`w-full mt-3 py-2 text-sm ${darkMode
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                >
                    Cancel
                </button>

            </div>

        </div>
    );
};

export default InternalTransferConfirmation;