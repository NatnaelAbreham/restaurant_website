import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import api from "../api/api";
import { useCart } from "../context/CartContext";

const OrderConfirmation = ({
    isOpen,
    onClose,
    cartItems,
    totalPrice,
    onOrderCreated,
}) => {


    const { darkMode } = useTheme();
    const { clearCart } = useCart();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPhoneNumber("");
            setPhoneError("");

            setOtp("");
            setOtpSent(false);
            setOtpError("");

            setIsVerifying(false);
            setIsVerified(false);
        }
    }, [isOpen]);
    const phoneRegex = /^(?:\+2519\d{8}|2519\d{8}|09\d{8})$/;

    // ==========================================
    // PHONE NUMBER
    // ==========================================

    const handlePhoneChange = (e) => {
        const value = e.target.value;

        setPhoneNumber(value);
        setPhoneError("");
        setOtpError("");

        // If user changes the phone number,
        // previous OTP verification is no longer valid.
        setOtpSent(false);
        setIsVerified(false);
        setOtp("");
    };

    // ==========================================
    // SEND OTP
    // ==========================================

    const handleSendOtp = async () => {
        if (!phoneRegex.test(phoneNumber)) {
            setPhoneError("Enter a valid phone number");
            return;
        }

        try {
            setIsSendingOtp(true);
            setPhoneError("");
            setOtpError("");

            const response = await api.post("/sendotp", {
                phoneNumber: phoneNumber
            });

            if (response.data.success) {
                setOtpSent(true);
                setOtp("");
                setOtpError("");
            } else {
                setOtpError(
                    response.data.message || "Failed to send OTP"
                );
            }

        } catch (error) {
            console.error("Error sending OTP:", error);

            setOtpError(
                error.response?.data?.message ||
                "Failed to send OTP"
            );
        } finally {
            setIsSendingOtp(false);
        }
    };

    // ==========================================
    // VERIFY OTP
    // ==========================================

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setOtpError("Please enter the 6-digit OTP");
            return;
        }

        try {
            setIsVerifying(true);
            setOtpError("");

            // ==========================================
            // STEP 1: VERIFY OTP
            // ==========================================

            const otpResponse = await api.post("/verifyotp", {
                phoneNumber: phoneNumber,
                otp: otp
            });

            if (!otpResponse.data.success) {
                setOtpError(
                    otpResponse.data.message || "Invalid OTP"
                );
                return;
            }

            // ==========================================
            // STEP 2: CREATE ORDER
            // ==========================================

            const orderResponse = await api.post("/createorder", {
                phoneNumber: phoneNumber,
                accountNumber: null,
                paymentMethod: "Cash",
                totalAmount: totalPrice,

                items: cartItems.map((item) => ({
                    itemId: item.id,
                    quantity: item.quantity
                }))
            });

            if (orderResponse.data.success) {

                const order = orderResponse.data.data;

                console.log("Order created:", order);

                setIsVerified(true);

                // Clear cart only AFTER backend confirms order creation
                clearCart();

                // Close confirmation modal
                onClose();

                // Show success information
                onOrderCreated(order);
            }
        } catch (error) {

            console.error(
                "Order creation failed:",
                error
            );

            setOtpError(
                error.response?.data?.message ||
                "Failed to create order"
            );

        } finally {
            setIsVerifying(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[70]">

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

                    <h2 className="text-2xl font-bold">
                        Confirm Your Order
                    </h2>

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

                {/* PHONE NUMBER */}
                {!isVerified && (
                    <div className="mb-5">

                        <label className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="09.........."
                            disabled={otpSent}
                            className={`w-full rounded-xl border px-4 py-3 ${otpSent
                                ? "bg-gray-200 cursor-not-allowed"
                                : ""
                                }`}
                        />

                        {phoneError && (
                            <p
                                className="mt-2 text-sm"
                                style={{ color: "red" }}
                            >
                                Enter a valid number:
                                <br />
                                +2519XXXXXXXX, 2519XXXXXXXX or 09XXXXXXXX
                            </p>
                        )}

                    </div>
                )}

                {/* SEND OTP */}
                {!otpSent && !isVerified && (
                    <button
                        disabled={
                            !phoneRegex.test(phoneNumber) ||
                            isSendingOtp
                        }
                        onClick={handleSendOtp}
                        className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white
                        disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSendingOtp
                            ? "Sending OTP..."
                            : "Send OTP"}
                    </button>
                )}

                {/* OTP SECTION */}
                {otpSent && !isVerified && (

                    <div className="mb-5">

                        <label className="block text-sm font-medium mb-2">
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => {

                                const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);

                                setOtp(value);
                                setOtpError("");
                            }}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            className="w-full rounded-xl border px-4 py-3"
                        />

                        {otpError && (
                            <p
                                className="mt-2 text-sm"
                                style={{ color: "red" }}
                            >
                                {otpError}
                            </p>
                        )}

                        <button
                            onClick={handleVerifyOtp}
                            disabled={
                                otp.length !== 6 ||
                                isVerifying
                            }
                            className="w-full mt-3 rounded-xl bg-green-500 py-3 font-semibold text-white
                            disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isVerifying
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>

                    </div>

                )}

                {/* VERIFIED */}
                {isVerified && (

                    <div className="mb-5">

                        <div
                            className={`rounded-xl p-4 text-center ${darkMode
                                ? "bg-green-500/10 text-green-400"
                                : "bg-green-100 text-green-700"
                                }`}
                        >
                            ✓ Phone number verified successfully
                        </div>

                    </div>

                )}
                {isVerified && (
                    <button

                        className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 transition"
                    >
                        Confirm Order
                    </button>
                )}
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

export default OrderConfirmation;