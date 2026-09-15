
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaFacebookF,
    FaInstagram,
    FaTelegramPlane,
    FaArrowRight,
    FaUtensils,
    FaCheckCircle,
} from "react-icons/fa";

const ContactPage = () => {
    const { darkMode } = useTheme();

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);

        setTimeout(() => {
            setSubmitted(false);
        }, 4000);

        setForm({
            name: "",
            email: "",
            message: "",
        });
    };

    const contactInfo = [
        {
            icon: <FaMapMarkerAlt />,
            title: "Visit Us",
            value: "Addis Ababa, Ethiopia",
            description: "Come and enjoy an unforgettable dining experience.",
        },
        {
            icon: <FaPhoneAlt />,
            title: "Call Us",
            value: "+251 900 000 000",
            description: "We are happy to answer your questions.",
        },
        {
            icon: <FaEnvelope />,
            title: "Email Us",
            value: "support@tsedeyrestaurant.com",
            description: "Send us your questions or feedback anytime.",
        },
    ];

    const openingHours = [
        { day: "Monday - Thursday", time: "10:00 AM - 10:00 PM" },
        { day: "Friday - Saturday", time: "10:00 AM - 11:00 PM" },
        { day: "Sunday", time: "12:00 PM - 10:00 PM" },
    ];

    return (
        <section
            className={`min-h-screen transition-colors duration-300 ${
                darkMode
                    ? "bg-gray-950 text-white"
                    : "bg-[#e7f2fd] text-gray-900"
            }`}
        >
            {/* HERO */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=85&w=2000&auto=format&fit=crop)",
                    }}
                />

                <div className="absolute inset-0 bg-black/65" />

                <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-28 md:py-36 text-center">
                    <span className="contact-label inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <FaUtensils />
                        We'd Love To Hear From You
                    </span>

                    <h1 className="contact-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                        Let's Start a
                        <span className="contact-highlight block mt-2">
                            Conversation
                        </span>
                    </h1>

                    <p className="contact-description max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
                        Have a question, feedback, or simply want to say hello?
                        Our team is always happy to hear from you.
                    </p>
                </div>
            </div>

            {/* CONTACT CONTENT */}
            <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">

                <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2">

                        <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-sm">
                            Get In Touch
                        </span>

                        <h2 className="text-3xl md:text-4xl font-black mt-3 mb-5 leading-tight">
                            We Are Here
                            <span className="block text-orange-500">
                                For You
                            </span>
                        </h2>

                        <p
                            className={`leading-relaxed mb-10 ${
                                darkMode
                                    ? "text-gray-400"
                                    : "text-gray-600"
                            }`}
                        >
                            Whether you're planning a visit, placing an order,
                            sharing feedback, or looking for more information,
                            feel free to reach out. We value every message from
                            our guests.
                        </p>

                        {/* CONTACT INFORMATION */}
                        <div className="space-y-5">
                            {contactInfo.map((item) => (
                                <div
                                    key={item.title}
                                    className={`group flex gap-4 p-4 rounded-2xl transition-all duration-300 ${
                                        darkMode
                                            ? "hover:bg-gray-900"
                                            : "hover:bg-white/70"
                                    }`}
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-lg group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                        {item.icon}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-base mb-1">
                                            {item.title}
                                        </h3>

                                        <p className="text-orange-500 font-semibold text-sm mb-1">
                                            {item.value}
                                        </p>

                                        <p
                                            className={`text-sm ${
                                                darkMode
                                                    ? "text-gray-500"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* OPENING HOURS */}
                        <div
                            className={`mt-10 pt-8 border-t ${
                                darkMode
                                    ? "border-gray-800"
                                    : "border-gray-200"
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                    <FaClock />
                                </div>

                                <div>
                                    <h3 className="font-bold">
                                        Opening Hours
                                    </h3>

                                    <p
                                        className={`text-xs ${
                                            darkMode
                                                ? "text-gray-500"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        We're ready to welcome you
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {openingHours.map((item) => (
                                    <div
                                        key={item.day}
                                        className="flex justify-between gap-5 text-sm"
                                    >
                                        <span
                                            className={
                                                darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                            }
                                        >
                                            {item.day}
                                        </span>

                                        <span className="font-semibold whitespace-nowrap">
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SOCIAL */}
                        <div className="mt-10">
                            <p
                                className={`text-sm font-semibold mb-4 ${
                                    darkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                }`}
                            >
                                Follow our journey
                            </p>

                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white ${
                                        darkMode
                                            ? "bg-gray-900 text-gray-300"
                                            : "bg-white text-gray-700 shadow-sm"
                                    }`}
                                >
                                    <FaFacebookF />
                                </a>

                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white ${
                                        darkMode
                                            ? "bg-gray-900 text-gray-300"
                                            : "bg-white text-gray-700 shadow-sm"
                                    }`}
                                >
                                    <FaInstagram />
                                </a>

                                <a
                                    href="#"
                                    aria-label="Telegram"
                                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 hover:text-white ${
                                        darkMode
                                            ? "bg-gray-900 text-gray-300"
                                            : "bg-white text-gray-700 shadow-sm"
                                    }`}
                                >
                                    <FaTelegramPlane />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT FORM */}
                    <div className="lg:col-span-3">
                        <div
                            className={`relative rounded-3xl p-7 md:p-10 border shadow-2xl transition-colors duration-300 ${
                                darkMode
                                    ? "bg-gray-900 border-gray-800"
                                    : "bg-white border-gray-100"
                            }`}
                        >
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative">
                                <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs">
                                    Send A Message
                                </span>

                                <h2 className="text-2xl md:text-3xl font-black mt-2 mb-3">
                                    How Can We Help?
                                </h2>

                                <p
                                    className={`text-sm leading-relaxed mb-8 ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                    }`}
                                >
                                    Fill out the form below and we'll get back
                                    to you as soon as possible.
                                </p>

                                {/* SUCCESS */}
                                {submitted && (
                                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-4 rounded-xl mb-6">
                                        <FaCheckCircle />

                                        <div>
                                            <p className="font-semibold">
                                                Message sent successfully!
                                            </p>

                                            <p className="text-sm opacity-80">
                                                Thank you for reaching out to
                                                us.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* NAME */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold mb-2"
                                        >
                                            Your Name
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter your name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className={`contact-input w-full px-5 py-4 rounded-xl border focus:outline-none transition-all duration-300 ${
                                                darkMode
                                                    ? "bg-gray-950 border-gray-800 placeholder-gray-600"
                                                    : "bg-gray-50 border-gray-200 placeholder-gray-400"
                                            }`}
                                            required
                                        />
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold mb-2"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={`contact-input w-full px-5 py-4 rounded-xl border focus:outline-none transition-all duration-300 ${
                                                darkMode
                                                    ? "bg-gray-950 border-gray-800 placeholder-gray-600"
                                                    : "bg-gray-50 border-gray-200 placeholder-gray-400"
                                            }`}
                                            required
                                        />
                                    </div>

                                    {/* MESSAGE */}
                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-semibold mb-2"
                                        >
                                            Your Message
                                        </label>

                                        <textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us how we can help..."
                                            value={form.message}
                                            onChange={handleChange}
                                            rows="6"
                                            className={`contact-input w-full px-5 py-4 rounded-xl border focus:outline-none transition-all duration-300 resize-none ${
                                                darkMode
                                                    ? "bg-gray-950 border-gray-800 placeholder-gray-600"
                                                    : "bg-gray-50 border-gray-200 placeholder-gray-400"
                                            }`}
                                            required
                                        />
                                    </div>

                                    {/* BUTTON */}
                                    <button
                                        type="submit"
                                        className="group w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                                    >
                                        Send Message

                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM CTA */}
                <div className="mt-20">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 md:px-12 py-12 md:py-16 text-center text-white shadow-2xl shadow-orange-500/20">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                        <div className="relative">
                            <FaUtensils className="mx-auto text-3xl mb-5 opacity-90" />

                            <h2 className="text-3xl md:text-4xl font-black mb-4">
                                Good Food Is Better Together
                            </h2>

                            <p className="max-w-xl mx-auto text-orange-50 leading-relaxed">
                                Visit us, explore our menu, and let us make
                                your next meal something worth remembering.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTERNAL CSS */}
            <style>{`
                .contact-title {
                    color: white;
                }

                .contact-description {
                    color: white;
                }

                .contact-highlight {
                    color: #fb923c;
                }

                .contact-label {
                    color: #fdba74;
                    background: rgba(249, 115, 22, 0.20);
                    border: 1px solid rgba(251, 146, 60, 0.30);
                }

                .contact-input:focus {
                    border-color: #f97316;
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
                }
            `}</style>
        </section>
    );
};

export default ContactPage;

