
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useTheme } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateMenu = () => {
    const { darkMode } = useTheme();

    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    // Load all menu items
    const fetchItems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/getitem");

            const data = response.data;

            if (data?.data) {
                setItems(data.data);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Failed to load menu items:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load menu items."
            );
        } finally {
            setLoading(false);
        }
    };
    const handleUpdate = async () => {
        if (!selectedItem) {
            showToast("Please select a menu item.", "error");
            return;
        }

        // Validation
        if (!selectedItem.name?.trim()) {
            showToast("Item name is required.", "error");
            return;
        }

        if (!selectedItem.description?.trim()) {
            showToast("Description is required.", "error");
            return;
        }

        const price = Number(selectedItem.price);

        if (!selectedItem.price || isNaN(price) || price <= 0) {
            showToast("Price must be greater than zero.", "error");
            return;
        }

        if (
            selectedItem.categoryId !== 0 &&
            selectedItem.categoryId !== 1
        ) {
            showToast("Please select a valid category.", "error");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const payload = {
                name: selectedItem.name.trim(),
                description: selectedItem.description.trim(),
                price: price,
                categoryId: Number(selectedItem.categoryId),
                isAvailable: selectedItem.isAvailable,
                updatedBy: "admin",
            };

            const response = await api.put(
                `/updatemenu/${selectedItem.id}`,
                payload
            );

            const data = response.data;

            if (data?.success) {
                // Update item in the list
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === selectedItem.id
                            ? {
                                ...item,
                                ...payload,
                            }
                            : item
                    )
                );

                // Update selected item
                setSelectedItem((prev) => ({
                    ...prev,
                    ...payload,
                }));

                showToast(
                    data.message || "Menu item updated successfully.",
                    "success"
                );
            } else {
                showToast(
                    data?.message || "Failed to update menu item.",
                    "error"
                );
            }
        } catch (error) {
            console.error("Update menu item failed:", error);

            showToast(
                error.response?.data?.message ||
                "Failed to update menu item.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };
    const showToast = (message, type = "success") => {
        toast[type](message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: darkMode ? "dark" : "light",
        });
    };
    useEffect(() => {
        fetchItems();
    }, []);

    // Filter items by name
    const filteredItems = items.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Select item
    const handleSelectItem = (item) => {
        setSelectedItem(item);

        setNewImage(null);
        setImagePreview(null);
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            showToast(
                "Only JPG, JPEG, PNG and WEBP images are allowed.",
                "error"
            );

            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast(
                "Image size must be less than 5MB.",
                "error"
            );

            e.target.value = "";
            return;
        }

        setNewImage(file);

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };
    const handleUpdateImage = async () => {
        if (!selectedItem) {
            showToast("Please select a menu item.", "error");
            return;
        }

        if (!newImage) {
            showToast("Please select a new image.", "error");
            return;
        }

        try {
            setImageUploading(true);

            const formData = new FormData();

            formData.append("image", newImage);

            const response = await api.put(
                `/updatemenu-image/${selectedItem.id}`,
                formData
            );

            const data = response.data;

            if (data?.success) {
                const updatedImageUrl = data.imageUrl;

                setSelectedItem((prev) => ({
                    ...prev,
                    imageUrl: updatedImageUrl,
                }));

                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === selectedItem.id
                            ? {
                                ...item,
                                imageUrl: updatedImageUrl,
                            }
                            : item
                    )
                );

                setNewImage(null);
                setImagePreview(null);

                showToast(
                    data.message || "Image updated successfully.",
                    "success"
                );
            } else {
                showToast(
                    data?.message || "Failed to update image.",
                    "error"
                );
            }
        } catch (error) {
            console.error("Image update failed:", error);

            showToast(
                error.response?.data?.message ||
                "Failed to update image.",
                "error"
            );
        } finally {
            setImageUploading(false);
        }
    };
    return (
        <div
            className={`min-h-screen p-6 transition-colors duration-300 ${darkMode
                ? "bg-gray-950 text-white"
                : "bg-[#e7f2fd] text-gray-900"
                }`}
        >
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Update Menu
                    </h1>

                    <p
                        className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        Select a menu item to update its information.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Item List */}
                    <div
                        className={`rounded-2xl border shadow-sm p-5 ${darkMode
                            ? "bg-gray-900 border-gray-800"
                            : "bg-white/90 border-gray-100"
                            }`}
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            Menu Items
                        </h2>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search menu item..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border outline-none transition ${darkMode
                                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                                }`}
                        />

                        {/* Loading */}
                        {loading && (
                            <div className="text-center py-8 text-sm text-gray-500">
                                Loading menu items...
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Items */}
                        {!loading && !error && (
                            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
                                {filteredItems.length === 0 ? (
                                    <div className="text-center py-8 text-sm text-gray-500">
                                        No menu items found.
                                    </div>
                                ) : (
                                    filteredItems.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleSelectItem(item)}
                                            className={`w-full text-left p-3 rounded-lg border transition ${selectedItem?.id === item.id
                                                ? "bg-orange-500 text-white border-orange-500"
                                                : darkMode
                                                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">
                                                    {item.name}
                                                </span>

                                                <span className="text-sm">
                                                    {Number(item.price || 0).toLocaleString()} ETB
                                                </span>
                                            </div>

                                            <div
                                                className={`text-xs mt-1 ${selectedItem?.id === item.id
                                                    ? "text-orange-100"
                                                    : darkMode
                                                        ? "text-gray-400"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                {item.categoryId === 0 ? "Food" : "Drink"}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Edit Area */}
                    <div
                        className={`lg:col-span-2 rounded-2xl border shadow-sm p-6 ${darkMode
                            ? "bg-gray-900 border-gray-800"
                            : "bg-white/90 border-gray-100"
                            }`}
                    >
                        {!selectedItem ? (
                            <div className="h-full min-h-[400px] flex items-center justify-center text-center">
                                <div>
                                    <div className="text-5xl mb-4">🍽️</div>

                                    <h2 className="text-lg font-semibold">
                                        Select a Menu Item
                                    </h2>

                                    <p
                                        className={`mt-2 text-sm ${darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        Choose an item from the list to edit its
                                        information.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">
                                    Edit: {selectedItem.name}
                                </h2>

                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Item Name
                                        </label>

                                        <input
                                            type="text"
                                            value={selectedItem.name || ""}
                                            onChange={(e) =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    name: e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode
                                                ? "bg-gray-800 border-gray-700 text-white"
                                                : "bg-white border-gray-300 text-gray-900"
                                                }`}
                                        />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Price
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={selectedItem.price || ""}
                                            onChange={(e) =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    price: e.target.value,
                                                })
                                            }
                                            className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode
                                                ? "bg-gray-800 border-gray-700 text-white"
                                                : "bg-white border-gray-300 text-gray-900"
                                                }`}
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Category
                                        </label>

                                        <select
                                            value={selectedItem.categoryId}
                                            onChange={(e) =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    categoryId: Number(e.target.value),
                                                })
                                            }
                                            className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode
                                                ? "bg-gray-800 border-gray-700 text-white"
                                                : "bg-white border-gray-300 text-gray-900"
                                                }`}
                                        >
                                            <option value={0}>Food</option>
                                            <option value={1}>Drink</option>
                                        </select>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Availability
                                        </label>

                                        <select
                                            value={selectedItem.isAvailable ? "true" : "false"}
                                            onChange={(e) =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    isAvailable: e.target.value === "true",
                                                })
                                            }
                                            className={`w-full px-4 py-3 rounded-lg border outline-none ${darkMode
                                                ? "bg-gray-800 border-gray-700 text-white"
                                                : "bg-white border-gray-300 text-gray-900"
                                                }`}
                                        >
                                            <option value="true">Available</option>
                                            <option value="false">Unavailable</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mt-5">
                                    <label className="block text-sm font-medium mb-2">
                                        Description
                                    </label>

                                    <textarea
                                        rows="4"
                                        value={selectedItem.description || ""}
                                        onChange={(e) =>
                                            setSelectedItem({
                                                ...selectedItem,
                                                description: e.target.value,
                                            })
                                        }
                                        className={`w-full px-4 py-3 rounded-lg border outline-none resize-none ${darkMode
                                            ? "bg-gray-800 border-gray-700 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                            }`}
                                    />
                                </div>
                                {/* Image Upload */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium mb-3">
                                        Menu Image
                                    </label>

                                    <div
                                        className={`p-4 rounded-xl border ${darkMode
                                            ? "bg-gray-800 border-gray-700"
                                            : "bg-gray-50 border-gray-200"
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row gap-5 md:items-center">

                                            {/* Image Preview */}
                                            <div className="w-32 h-32 rounded-xl overflow-hidden border">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="New preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : selectedItem.imageUrl ? (
                                                    <img
                                                        src={`https://10.13.10.21:8687/${selectedItem.imageUrl}`}
                                                        alt={selectedItem.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className={`w-full h-full flex items-center justify-center ${darkMode
                                                            ? "bg-gray-700 text-gray-400"
                                                            : "bg-gray-100 text-gray-500"
                                                            }`}
                                                    >
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png,.webp"
                                                    onChange={handleImageChange}
                                                    className={`w-full rounded-lg border p-3 ${darkMode
                                                        ? "bg-gray-900 border-gray-700 text-white"
                                                        : "bg-white border-gray-300"
                                                        }`}
                                                />

                                                <p className="text-xs text-gray-500 mt-2">
                                                    JPG, JPEG, PNG or WEBP. Maximum size 5MB.
                                                </p>

                                                {newImage && (
                                                    <p className="text-sm mt-2">
                                                        Selected:{" "}
                                                        <span className="font-medium">
                                                            {newImage.name}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {newImage && (
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={handleUpdateImage}
                                            disabled={imageUploading}
                                            className="px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium transition"
                                        >
                                            {imageUploading
                                                ? "Uploading..."
                                                : "Update Image"}
                                        </button>
                                    </div>
                                )}

                                {/* Current Inventory */}
                                <div
                                    className={`mt-6 p-4 rounded-xl border ${darkMode
                                        ? "bg-gray-800 border-gray-700"
                                        : "bg-gray-50 border-gray-200"
                                        }`}
                                >
                                    <h3 className="font-semibold mb-3">
                                        Current Inventory
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-500">
                                                Quantity Available
                                            </span>

                                            <p className="text-lg font-semibold mt-1">
                                                {selectedItem.quantityLimit
                                                    ? selectedItem.quantityAvailable ?? 0
                                                    : "Unlimited"}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="text-sm text-gray-500">
                                                Quantity Limit
                                            </span>

                                            <p className="text-lg font-semibold mt-1">
                                                {selectedItem.quantityLimit
                                                    ? "Limited"
                                                    : "Unlimited"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Update button */}
                                <div className="flex justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={handleUpdate}
                                        disabled={loading}
                                        className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium transition"
                                    >
                                        {loading ? "Updating..." : "Update Menu Item"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme={darkMode ? "dark" : "light"}
            />
        </div>
    );
};

export default UpdateMenu;

