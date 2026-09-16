import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const InventoryPage = () => {
    const { darkMode } = useTheme();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const response = await fetch("https://10.13.10.21:8687/getitem");
            const data = await response.json();

            setItems(
                data.data.map((item) => ({
                    ...item,
                    quantity: item.quantity || 0,
                    quantity_limit: item.quantity_limit ?? false,
                }))
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (id, value) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: value } : item
            )
        );
    };

    const handleQuantityLimitChange = (id, checked) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity_limit: checked,
                        quantity: checked ? item.quantity : 0,
                    }
                    : item
            )
        );
    };

    const saveQuantity = async (item) => {
        try {
            setSavingId(item.id);

            const response = await fetch(
                "https://10.13.10.21:8687/addquantity",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        itemId: item.id,
                        quantity: Number(item.quantity),
                        quantity_limit: Boolean(item.quantity_limit),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add quantity");
            }

            toast.success("Stock updated successfully ");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to update stock");
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${darkMode ? "bg-gray-950 text-white" : "bg-[#e7f2fd] text-gray-900"
                    }`}
            >
                Loading items...
            </div>
        );
    }

    return (
        <>
            <section
                className={`min-h-screen px-4 py-10 transition-colors duration-300 ${darkMode ? "bg-gray-950 text-white" : "bg-[#e7f2fd] text-gray-900"
                    }`}
            >
                <div className="max-w-7xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold">
                            Inventory Management
                        </h1>
                        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Update available stock quantities.
                        </p>
                    </div>

                    {/* TABLE CARD */}
                    <div
                        className={`rounded-3xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-900 shadow-black/40" : "bg-white shadow-gray-200"
                            }`}
                    >
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                {/* HEADER */}
                                <thead className="bg-orange-500 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Image</th>
                                        <th className="px-6 py-4 text-left">Item</th>
                                        <th className="px-6 py-4 text-left">Price</th>
                                        <th className="px-6 py-4 text-center">Quantity Limit</th>
                                        <th className="px-6 py-4 text-left">Quantity</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>

                                {/* BODY (IMPORTANT FIX HERE) */}
                                <tbody
                                    className={`divide-y ${darkMode ? "divide-gray-800" : "divide-gray-200"
                                        }`}
                                >
                                    {items.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={`transition ${darkMode
                                                ? "hover:bg-gray-800/40"
                                                : "hover:bg-gray-100"
                                                } ${index % 2 === 0
                                                    ? darkMode
                                                        ? "bg-gray-900/20"
                                                        : "bg-gray-50"
                                                    : ""
                                                }`}
                                        >

                                            {/* IMAGE */}
                                            <td className="px-6 py-5">
                                                <img
                                                    src={`https://10.13.10.21:8687/${item.imageUrl}`}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-xl object-cover"
                                                />
                                            </td>

                                            {/* ITEM */}
                                            <td className="px-6 py-5">
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                    {item.description}
                                                </p>
                                            </td>

                                            {/* PRICE */}
                                            <td className="px-6 py-5 font-semibold text-orange-500">
                                                ETB {item.price}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={item.quantity_limit}
                                                        onChange={(e) =>
                                                            handleQuantityLimitChange(item.id, e.target.checked)
                                                        }
                                                    />

                                                    <div className="w-11 h-6 bg-gray-300 rounded-full
            peer peer-checked:bg-orange-500
            after:content-['']
            after:absolute
            after:top-[2px]
            after:left-[2px]
            after:bg-white
            after:border
            after:rounded-full
            after:h-5
            after:w-5
            after:transition-all
            peer-checked:after:translate-x-full">
                                                    </div>
                                                </label>
                                            </td>
                                            {/* QUANTITY */}
                                            <td className="px-6 py-5">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.quantity}
                                                    disabled={!item.quantity_limit}
                                                    onChange={(e) =>
                                                        handleQuantityChange(item.id, e.target.value)
                                                    }
                                                    className={`w-28 px-3 py-2 rounded-xl border
        focus:outline-none focus:ring-2 focus:ring-orange-400
        ${!item.quantity_limit
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                        }
        ${darkMode
                                                            ? "bg-gray-800 border-gray-700 text-white"
                                                            : "bg-white border-gray-200"
                                                        }`}
                                                />
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-6 py-5 text-center">
                                                <button
                                                    onClick={() => saveQuantity(item)}
                                                    disabled={savingId === item.id}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold transition disabled:opacity-50"
                                                >
                                                    {savingId === item.id ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                            Saving...
                                                        </span>
                                                    ) : (
                                                        "Save"
                                                    )}
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                    </div>

                </div>
            </section>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme={darkMode ? "dark" : "light"}
            />
        </>
    );
};

export default InventoryPage;