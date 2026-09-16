import { useEffect, useMemo, useState } from "react";
import MenuCard from "./MenuCard";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api/api";

const Menu = ({ limit }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");

  const { addToCart } = useCart();
  const { darkMode } = useTheme();


useEffect(() => {
    const getMenuItems = async () => {
        try {
            const response = await api.get("/getitem");

            const items = response.data.data.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                categoryId: item.categoryId,
                category: item.categoryId === 1 ? "Food" : "Drinks",
                image: `/uploads/${item.imageUrl}`,
                popular: false,

                // Stock information
                quantityLimit: item.quantityLimit,
                isAvailable: item.isAvailable,
                quantityAvailable: item.quantityAvailable
            }));

            setMenuItems(items);
        } catch (error) {
            console.error("Error fetching menu:", error);
            setError("Failed to load menu.");
        } finally {
            setLoading(false);
        }
    };

    // Load immediately
    getMenuItems();

    // Refresh every 5 seconds
    const interval = setInterval(() => {
        getMenuItems();
    }, 5000);

    // Cleanup when component is removed
    return () => clearInterval(interval);

}, []);



  const categories = useMemo(() => {
    return ["All", ...new Set(menuItems.map((item) => item.category))];
  }, [menuItems]);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const displayItems = limit
    ? filteredItems.slice(0, limit)
    : filteredItems;

  if (loading) {
    return (
      <div className="text-center py-20">
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section
      className={`min-h-screen transition-colors duration-300 ${darkMode
        ? "bg-gray-950 text-white"
        : "bg-[#e7f2fd] text-gray-900"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-16">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            {limit ? "Featured Menu" : "Our Menu"}
          </h2>

          {!limit && (
            <p
              className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}
            >
              Delicious food & refreshing drinks
            </p>
          )}
        </div>

        {!limit && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                  ? "bg-orange-500 text-white shadow-lg scale-105"
                  : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-orange-400"
                    : "bg-white text-gray-700 border hover:bg-gray-100 hover:text-orange-500"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Menu;