import React from "react";
import { Link } from "react-router-dom";
import {
    FaUtensils,
    FaLeaf,
    FaHeart,
    FaUsers,
    FaArrowRight,
    FaStar,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const About = () => {
    const { darkMode } = useTheme();

    const values = [
        {
            icon: <FaLeaf />,
            title: "Fresh Ingredients",
            description:
                "We carefully select fresh, quality ingredients to create dishes that are full of authentic flavor.",
        },
        {
            icon: <FaUtensils />,
            title: "Traditional Recipes",
            description:
                "Our recipes are inspired by Ethiopian culinary traditions and prepared with care and passion.",
        },
        {
            icon: <FaHeart />,
            title: "Made With Love",
            description:
                "Every plate is prepared with attention to detail because we believe great food should feel special.",
        },
        {
            icon: <FaUsers />,
            title: "Warm Hospitality",
            description:
                "We want every guest to feel welcome, comfortable, and part of our restaurant family.",
        },
    ];

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${darkMode
                    ? "bg-gray-950 text-white"
                    : "bg-[#e7f2fd] text-gray-900"
                }`}
        >
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=85&w=2000&auto=format&fit=crop)",
                    }}
                />

                <div
                    className={`absolute inset-0 ${darkMode
                            ? "bg-black/70"
                            : "bg-black/55"
                        }`}
                />

       

<section className="relative overflow-hidden">
    <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
            backgroundImage:
                "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=85&w=2000&auto=format&fit=crop)",
        }}
    />

    <div className="absolute inset-0 bg-black/60" />

    <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-28 md:py-36 text-center">
        
        <span className="about-story-label inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <FaStar />
            Our Story
        </span>

        <h1 className="about-title text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            More Than Just
            <span className="about-highlight block">
                Great Food
            </span>
        </h1>

        <p className="about-description max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Discover the passion, tradition, and hospitality behind every dish
            we serve.
        </p>
    </div>

    <style>{`
        .about-title {
            color: white;
        }

        .about-description {
            color: white;
        }

        .about-highlight {
            color: #fb923c;
        }

        .about-story-label {
            color: #fdba74;
            background: rgba(249, 115, 22, 0.20);
            border: 1px solid rgba(251, 146, 60, 0.30);
        }
    `}</style>
</section>






            </section>

            {/* Our Story */}
            <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="absolute -top-5 -left-5 w-24 h-24 bg-orange-400/20 rounded-full blur-2xl" />

                        <img
                            src="https://images.unsplash.com/photo-1547592180-85f173990554?q=85&w=1200&auto=format&fit=crop"
                            alt="Traditional Ethiopian food"
                            className="relative w-full h-[420px] md:h-[520px] object-cover rounded-3xl shadow-2xl"
                        />

                        <div
                            className={`absolute -bottom-6 -right-4 md:-right-8 rounded-2xl px-6 py-5 shadow-xl border ${darkMode
                                    ? "bg-gray-900 border-gray-800"
                                    : "bg-white border-gray-100"
                                }`}
                        >
                            <p className="text-3xl font-black text-orange-500">
                                15+
                            </p>
                            <p
                                className={`text-sm font-medium ${darkMode
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                    }`}
                            >
                                Years of Experience
                            </p>
                        </div>
                    </div>

                    {/* Text */}
                    <div>
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">
                            Who We Are
                        </span>

                        <h2 className="text-3xl md:text-5xl font-black mt-3 mb-6 leading-tight">
                            Bringing Tradition
                            <span className="block text-orange-500">
                                To Your Table
                            </span>
                        </h2>

                        <p
                            className={`text-lg leading-relaxed mb-6 ${darkMode
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                        >
                            Our restaurant is built around a simple idea:
                            great food brings people together. We combine
                            authentic Ethiopian flavors with a welcoming
                            atmosphere to create memorable dining experiences.
                        </p>

                        <p
                            className={`leading-relaxed mb-8 ${darkMode
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                        >
                            From traditional dishes prepared with carefully
                            selected ingredients to the warm service our guests
                            receive, we take pride in making every visit
                            meaningful. Whether you are enjoying a meal with
                            family, meeting friends, or ordering from home,
                            you are always welcome at our table.
                        </p>

                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/25 transition-all duration-300 group"
                        >
                            Explore Our Menu
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section
                className={`py-20 md:py-28 ${darkMode
                        ? "bg-gray-900"
                        : "bg-white/70"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">
                            What Matters To Us
                        </span>

                        <h2 className="text-3xl md:text-5xl font-black mt-3 mb-5">
                            Our Values
                        </h2>

                        <p
                            className={`leading-relaxed ${darkMode
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                        >
                            Everything we do is guided by quality, tradition,
                            hospitality, and our love for bringing people
                            together through food.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className={`p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${darkMode
                                        ? "bg-gray-950 border-gray-800 hover:border-orange-500/50"
                                        : "bg-white border-gray-100 hover:border-orange-300 shadow-sm"
                                    }`}
                            >
                                <div className="w-14 h-14 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xl mb-5">
                                    {value.icon}
                                </div>

                                <h3 className="text-xl font-bold mb-3">
                                    {value.title}
                                </h3>

                                <p
                                    className={`text-sm leading-relaxed ${darkMode
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                        }`}
                                >
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-8">
                        <FaUtensils className="text-orange-500 text-3xl mx-auto mb-4" />
                        <h3 className="text-4xl font-black mb-2">50+</h3>
                        <p
                            className={
                                darkMode
                                    ? "text-gray-400"
                                    : "text-gray-600"
                            }
                        >
                            Signature Dishes
                        </p>
                    </div>

                    <div className="text-center p-8">
                        <FaUsers className="text-orange-500 text-3xl mx-auto mb-4" />
                        <h3 className="text-4xl font-black mb-2">20K+</h3>
                        <p
                            className={
                                darkMode
                                    ? "text-gray-400"
                                    : "text-gray-600"
                            }
                        >
                            Happy Customers
                        </p>
                    </div>

                    <div className="text-center p-8">
                        <FaHeart className="text-orange-500 text-3xl mx-auto mb-4" />
                        <h3 className="text-4xl font-black mb-2">4.9★</h3>
                        <p
                            className={
                                darkMode
                                    ? "text-gray-400"
                                    : "text-gray-600"
                            }
                        >
                            Customer Rating
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-5 md:px-8 pb-20 md:pb-28">
                <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 md:px-12 py-14 md:py-20 text-center text-white shadow-2xl shadow-orange-500/20">
                    <h2 className="text-3xl md:text-5xl font-black mb-5">
                        Ready to Taste the Tradition?
                    </h2>

                    <p className="max-w-2xl mx-auto text-orange-50 mb-8">
                        Explore our menu and discover your next favorite
                        Ethiopian dish.
                    </p>

                    <Link
                        to="/menu"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-orange-600 font-bold hover:bg-gray-100 transition-all duration-300 group"
                    >
                        Order Now
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;

