import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";

// Toast notification component


const AddMenu = () => {
  const { darkMode } = useTheme();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "food",
    is_available: true,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryId = (category) => {
    const categories = { food: 1, drink: 2 };
    return categories[category] || 1;
  };

  const showToast = (message, type = "info") => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast.info(message);
  };

  const handlePrice = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    setForm((prev) => ({ ...prev, price: value }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setForm((prev) => ({ ...prev, image: null }));
      setPreview(null);
      setFileName("No file selected");
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image file (JPEG, PNG, WEBP)', 'error');
      e.target.value = '';
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      e.target.value = '';
      return;
    }

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      showToast('Please enter the item name', 'error');
      return false;
    }

    if (!form.description.trim()) {
      showToast('Please enter the item description', 'error');
      return false;
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      showToast('Please enter a valid price', 'error');
      return false;
    }

    if (!form.image) {
      showToast('Please select an image for the menu item', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("Name", form.name.trim());
    formData.append("Description", form.description.trim());
    formData.append("Price", Number(form.price));
    formData.append("CategoryId", String(getCategoryId(form.category)));
    formData.append("IsAvailable", form.is_available.toString());
    formData.append("CreatedBy", "admin");
    formData.append("image", form.image);

    try {
      const response = await api.post("/addmenu", formData);

      // Axios already parses JSON
      const data = response.data;

      if (data?.success) {
        showToast(
          data.message || "Menu item added successfully!",
          "success"
        );

        // Reset form
        setForm({
          name: "",
          description: "",
          price: "",
          category: "food",
          is_available: true,
          image: null,
        });

        setPreview(null);
        setFileName("No file selected");

        // Reset file input
        const fileInput = document.querySelector(
          'input[type="file"]'
        );

        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        showToast(
          data?.message || data?.error || "Failed to add menu item",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Network error. Please check your connection.";

      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        className={`min-h-screen flex items-center justify-center px-4 py-16 transition-all duration-300 ${darkMode
          ? "bg-gradient-to-b from-gray-950 to-gray-900 text-white"
          : "bg-gradient-to-b from-[#e7f2fd] to-white text-gray-900"
          }`}
      >
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight">
            Add Menu Item 🍽️
          </h1>

          <div
            className={`backdrop-blur-xl shadow-2xl rounded-3xl p-8 border transition-all duration-300 ${darkMode
              ? "bg-gray-900/80 border-gray-800"
              : "bg-white/80 border-gray-100"
              }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Burger Deluxe"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200"
                    }`}
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write something delicious..."
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200"
                    }`}
                  required
                />
              </div>

              {/* PRICE + CATEGORY */}
              <div className="grid grid-cols-2 gap-4">
                {/* PRICE */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.price}
                    onChange={handlePrice}
                    placeholder="0.00"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 ${darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200"
                      }`}
                    required
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 ${darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                  </select>
                </div>
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Upload Image <span className="text-red-500">*</span>
                </label>
                <label
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-750"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-sm truncate">{fileName}</span>
                  <span className="text-xs text-orange-500 font-medium">
                    Choose File
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>

                {preview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-32 h-32 object-cover rounded-2xl shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFileName("No file selected");
                        setForm((prev) => ({ ...prev, image: null }));
                        const fileInput = document.querySelector('input[type="file"]');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* AVAILABLE */}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={form.is_available}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <span>Available</span>
              </label>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${isSubmitting
                  ? 'opacity-75 cursor-not-allowed'
                  : 'hover:opacity-90 active:scale-95'
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "Add Item"
                )}
              </button>
            </form>
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

export default AddMenu;