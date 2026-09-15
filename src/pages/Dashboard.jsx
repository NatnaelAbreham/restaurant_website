import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LabelList,
} from "recharts";
import api from "../api/api";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
    const { darkMode } = useTheme();

    const [summary, setSummary] = useState({
        todayRevenue: 0,
        todayOrders: 0,
        pendingOrders: 0,
        servedOrders: 0,
        averageOrderValue: 0,
        itemsSold: 0,
    });
    const [revenueTrend, setRevenueTrend] = useState([]);
    const [ordersTrend, setOrdersTrend] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [foodVsDrinks, setFoodVsDrinks] = useState([]);
    const [inventoryStatus, setInventoryStatus] = useState({
        summary: {
            unlimited: 0,
            inStock: 0,
            lowStock: 0,
            outOfStock: 0,
        },
        alerts: [],
    });
    const [transferAnalytics, setTransferAnalytics] = useState({
        successful: 0,
        failed: 0,
        unverified: 0,
        totalTransfers: 0,
        successfulAmount: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardSummary = async () => {
        try {
            setLoading(true);

            const [
                summaryResponse,
                revenueResponse,
                ordersResponse,
                paymentResponse,
                topItemsResponse,
                foodDrinksResponse,
                inventoryResponse,
                transferResponse,
                recentOrdersResponse,
            ] = await Promise.all([
                api.get("/dashboard-summary"),
                api.get("/revenue-trend"),
                api.get("/orders-trend"),
                api.get("/payment-methods"),
                api.get("/top-selling-items"),
                api.get("/food-vs-drinks"),
                api.get("/inventory-status"),
                api.get("/internal-transfer-analytics"),
                api.get("/recent-orders"),
            ]);

            if (summaryResponse.data.success) {
                setSummary(summaryResponse.data.data);
            }

            if (revenueResponse.data.success) {
                setRevenueTrend(revenueResponse.data.data);
            }

            if (ordersResponse.data.success) {
                setOrdersTrend(ordersResponse.data.data);
            }

            if (paymentResponse.data.success) {
                setPaymentMethods(paymentResponse.data.data);
            }

            if (topItemsResponse.data.success) {
                setTopSellingItems(topItemsResponse.data.data);
            }
            if (foodDrinksResponse.data.success) {
                setFoodVsDrinks(foodDrinksResponse.data.data);
            }
            if (inventoryResponse.data.success) {
                setInventoryStatus(inventoryResponse.data.data);
            }
            if (transferResponse.data.success) {
                setTransferAnalytics(transferResponse.data.data);
            }
            if (recentOrdersResponse.data.success) {
                setRecentOrders(recentOrdersResponse.data.data);
            }
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardSummary();
    }, []);

    const cards = [
        {
            title: "Today's Revenue",
            value: `${summary.todayRevenue.toFixed(2)}`,
            icon: "💰",
            description: "Completed sales",
            iconBg: "bg-green-500/10",
        },
        {
            title: "Today's Orders",
            value: summary.todayOrders,
            icon: "🧾",
            description: "Orders placed today",
            iconBg: "bg-blue-500/10",
        },
        {
            title: "Pending Orders",
            value: summary.pendingOrders,
            icon: "⏳",
            description: "Waiting to be served",
            iconBg: "bg-orange-500/10",
        },
        {
            title: "Served Orders",
            value: summary.servedOrders,
            icon: "✓",
            description: "Completed orders",
            iconBg: "bg-green-500/10",
        },
        {
            title: "Average Order",
            value: `${summary.averageOrderValue.toFixed(2)}`,
            icon: "📊",
            description: "Average completed order",
            iconBg: "bg-purple-500/10",
        },
        {
            title: "Items Sold",
            value: summary.itemsSold,
            icon: "🍽️",
            description: "Items sold today",
            iconBg: "bg-pink-500/10",
        },
    ];

    return (
        <div
            className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${darkMode
                ? "bg-gray-950 text-white"
                : "bg-[#e7f2fd] text-gray-900"
                }`}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Dashboard
                    </h1>

                    <p
                        className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        Restaurant performance overview
                    </p>
                </div>

                <button
                    onClick={fetchDashboardSummary}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition disabled:opacity-50"
                >
                    {loading ? "Refreshing..." : "↻ Refresh"}
                </button>
            </div>
            {lastUpdated && (
                <p
                    className={`text-xs mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                >
                    Last updated {lastUpdated.toLocaleTimeString()}
                </p>
            )}
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${darkMode
                            ? "bg-gray-900 border-gray-800"
                            : "bg-white/90 border-gray-100"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${card.iconBg}`}
                            >
                                {card.icon}
                            </div>
                        </div>

                        <p
                            className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            {card.title}
                        </p>

                        <h2 className="text-2xl font-bold mt-1">
                            {loading ? "—" : card.value}
                        </h2>

                        <p
                            className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                        >
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>




            {/* Revenue & Orders Trends */}
            <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Revenue Trend */}
                <div
                    className={`rounded-2xl border p-6 shadow-sm ${darkMode
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white/90 border-gray-100"
                        }`}
                >
                    <div className="mb-5">
                        <h2 className="text-lg font-bold">
                            Revenue Trend
                        </h2>

                        <p
                            className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Completed revenue over the last 7 days
                        </p>
                    </div>

                    <div className="h-[320px]">
                        {loading ? (
                            <div
                                className={`h-full flex items-center justify-center ${darkMode ? "text-gray-500" : "text-gray-400"
                                    }`}
                            >
                                Loading revenue data...
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueTrend}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                                    />

                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) =>
                                            new Date(date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }
                                        tick={{
                                            fill: darkMode ? "#9ca3af" : "#6b7280",
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tick={{
                                            fill: darkMode ? "#9ca3af" : "#6b7280",
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            `${Number(value).toFixed(2)}`,
                                            "Revenue",
                                        ]}
                                        labelFormatter={(date) =>
                                            new Date(date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }
                                        contentStyle={{
                                            backgroundColor: darkMode ? "#111827" : "#ffffff",
                                            border: darkMode
                                                ? "1px solid #374151"
                                                : "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                        }}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#f97316"
                                        fill="#f97316"
                                        fillOpacity={0.15}
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>


                {/* Orders Trend */}
                <div
                    className={`rounded-2xl border p-6 shadow-sm ${darkMode
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white/90 border-gray-100"
                        }`}
                >
                    <div className="mb-5">
                        <h2 className="text-lg font-bold">
                            Orders Trend
                        </h2>

                        <p
                            className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Orders placed over the last 7 days
                        </p>
                    </div>

                    <div className="h-[320px]">
                        {loading ? (
                            <div
                                className={`h-full flex items-center justify-center ${darkMode ? "text-gray-500" : "text-gray-400"
                                    }`}
                            >
                                Loading orders data...
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={ordersTrend}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                                    />

                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) =>
                                            new Date(date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }
                                        tick={{
                                            fill: darkMode ? "#9ca3af" : "#6b7280",
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fill: darkMode ? "#9ca3af" : "#6b7280",
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            value,
                                            "Orders",
                                        ]}
                                        labelFormatter={(date) =>
                                            new Date(date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }
                                        contentStyle={{
                                            backgroundColor: darkMode ? "#111827" : "#ffffff",
                                            border: darkMode
                                                ? "1px solid #374151"
                                                : "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                        }}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.12}
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                <div
                    className={`rounded-2xl border p-6 shadow-sm ${darkMode
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white/90 border-gray-100"
                        }`}
                >
                    <div className="mb-5">
                        <h2 className="text-lg font-bold">
                            Payment Methods
                        </h2>

                        <p
                            className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Payment distribution over the last 7 days
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                        {/* Donut Chart */}
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentMethods}
                                        dataKey="orders"
                                        nameKey="paymentMethod"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={105}
                                        paddingAngle={3}
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {paymentMethods.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.paymentMethod === "Cash"
                                                        ? "#22c55e"
                                                        : "#3b82f6"
                                                }
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        formatter={(value, name) => [
                                            value,
                                            name,
                                        ]}
                                        contentStyle={{
                                            backgroundColor: darkMode ? "#111827" : "#ffffff",
                                            border: darkMode
                                                ? "1px solid #374151"
                                                : "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-4">
                            {paymentMethods.map((payment) => (
                                <div
                                    key={payment.paymentMethod}
                                    className={`flex items-center justify-between p-4 rounded-xl ${darkMode
                                        ? "bg-gray-800"
                                        : "bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-3 h-3 rounded-full ${payment.paymentMethod === "Cash"
                                                ? "bg-green-500"
                                                : "bg-blue-500"
                                                }`}
                                        />

                                        <div>
                                            <p className="font-semibold">
                                                {payment.paymentMethod === "InternalTransfer"
                                                    ? "Internal Transfer"
                                                    : payment.paymentMethod}
                                            </p>

                                            <p
                                                className={`text-xs ${darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                                    }`}
                                            >
                                                {payment.orders} orders
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold">
                                            {Number(payment.amount).toFixed(2)}
                                        </p>

                                        <p
                                            className={`text-xs ${darkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            Total
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Food vs Drinks */}
                <div
                    className={`rounded-2xl border p-6 shadow-sm ${darkMode
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white/90 border-gray-100"
                        }`}
                >
                    <div className="mb-6">
                        <h2 className="text-lg font-bold">
                            Food vs Drinks
                        </h2>

                        <p
                            className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Sales comparison over the last 7 days
                        </p>
                    </div>

                    <div className="h-[320px]">
                        {foodVsDrinks.length === 0 ? (
                            <div
                                className={`h-full flex items-center justify-center ${darkMode ? "text-gray-500" : "text-gray-400"
                                    }`}
                            >
                                No sales data available
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={foodVsDrinks}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 0,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                                    />

                                    <XAxis
                                        dataKey="category"
                                        tick={{
                                            fill: darkMode ? "#d1d5db" : "#374151",
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fill: darkMode ? "#9ca3af" : "#6b7280",
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            value,
                                            "Items Sold",
                                        ]}
                                        contentStyle={{
                                            backgroundColor: darkMode ? "#111827" : "#ffffff",
                                            border: darkMode
                                                ? "1px solid #374151"
                                                : "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                        }}
                                    />

                                    <Bar
                                        dataKey="quantitySold"
                                        fill="#f97316"
                                        radius={[8, 8, 0, 0]}
                                        barSize={60}
                                    >
                                        <LabelList
                                            dataKey="quantitySold"
                                            position="top"
                                            fill={darkMode ? "#d1d5db" : "#374151"}
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Revenue summary */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {foodVsDrinks.map((item) => (
                            <div
                                key={item.category}
                                className={`rounded-xl p-4 ${darkMode
                                    ? "bg-gray-800"
                                    : "bg-gray-50"
                                    }`}
                            >
                                <p
                                    className={`text-sm ${darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {item.category}
                                </p>

                                <p className="text-lg font-bold mt-1">
                                    {Number(item.revenue || 0).toLocaleString()} ETB
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Revenue & Orders Trends */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                {/* Top Selling Items */}
                <div className="mt-6">
                    <div
                        className={`rounded-2xl border p-6 shadow-sm ${darkMode
                            ? "bg-gray-900 border-gray-800"
                            : "bg-white/90 border-gray-100"
                            }`}
                    >
                        <div className="mb-6">
                            <h2 className="text-lg font-bold">
                                Top Selling Items
                            </h2>

                            <p
                                className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Best-selling menu items over the last 7 days
                            </p>
                        </div>

                        <div className="h-[420px]">
                            {topSellingItems.length === 0 ? (
                                <div
                                    className={`h-full flex items-center justify-center ${darkMode ? "text-gray-500" : "text-gray-400"
                                        }`}
                                >
                                    No sales data available
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={topSellingItems}
                                        layout="vertical"
                                        margin={{
                                            top: 5,
                                            right: 50,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={false}
                                            stroke={darkMode ? "#374151" : "#e5e7eb"}
                                        />

                                        <XAxis
                                            type="number"
                                            allowDecimals={false}
                                            tick={{
                                                fill: darkMode ? "#9ca3af" : "#6b7280",
                                                fontSize: 12,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <YAxis
                                            type="category"
                                            dataKey="itemName"
                                            width={110}
                                            tick={{
                                                fill: darkMode ? "#d1d5db" : "#374151",
                                                fontSize: 12,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />

                                        <Tooltip
                                            formatter={(value) => [
                                                value,
                                                "Items Sold",
                                            ]}
                                            contentStyle={{
                                                backgroundColor: darkMode ? "#111827" : "#ffffff",
                                                border: darkMode
                                                    ? "1px solid #374151"
                                                    : "1px solid #e5e7eb",
                                                borderRadius: "12px",
                                            }}
                                        />

                                        <Bar
                                            dataKey="quantitySold"
                                            fill="#f97316"
                                            radius={[0, 8, 8, 0]}
                                            barSize={24}
                                        >
                                            <LabelList
                                                dataKey="quantitySold"
                                                position="right"
                                                fill={darkMode ? "#d1d5db" : "#374151"}
                                                fontSize={12}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Inventory Status */}
                <div
                    className={`rounded-2xl border p-6 shadow-sm ${darkMode
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white/90 border-gray-100"
                        }`}
                >
                    <div className="mb-6">
                        <h2 className="text-lg font-bold">
                            Inventory Status
                        </h2>

                        <p
                            className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Current menu inventory overview
                        </p>
                    </div>

                    {/* Inventory Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* In Stock */}
                        <div
                            className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-green-50"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                In Stock
                            </p>

                            <p className="text-2xl font-bold text-green-500 mt-1">
                                {inventoryStatus.summary.inStock}
                            </p>
                        </div>

                        {/* Low Stock */}
                        <div
                            className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-orange-50"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Low Stock
                            </p>

                            <p className="text-2xl font-bold text-orange-500 mt-1">
                                {inventoryStatus.summary.lowStock}
                            </p>
                        </div>

                        {/* Out of Stock */}
                        <div
                            className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-red-50"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Out of Stock
                            </p>

                            <p className="text-2xl font-bold text-red-500 mt-1">
                                {inventoryStatus.summary.outOfStock}
                            </p>
                        </div>

                        {/* Unlimited */}
                        <div
                            className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-blue-50"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Unlimited
                            </p>

                            <p className="text-2xl font-bold text-blue-500 mt-1">
                                {inventoryStatus.summary.unlimited}
                            </p>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="mt-6">
                        <h3 className="font-semibold mb-3">
                            Stock Alerts
                        </h3>

                        {inventoryStatus.alerts.length === 0 ? (
                            <div
                                className={`rounded-xl p-4 text-sm ${darkMode
                                    ? "bg-green-950/30 text-green-400"
                                    : "bg-green-50 text-green-600"
                                    }`}
                            >
                                ✓ All limited items have sufficient stock.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto">
                                {inventoryStatus.alerts.map((item) => (
                                    <div
                                        key={item.itemId}
                                        className={`flex items-center justify-between rounded-xl p-3 ${darkMode
                                            ? "bg-gray-800"
                                            : "bg-gray-50"
                                            }`}
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {item.itemName}
                                            </p>

                                            <p
                                                className={`text-xs mt-1 ${darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                                    }`}
                                            >
                                                {item.status === "OutOfStock"
                                                    ? "Currently unavailable"
                                                    : "Stock running low"}
                                            </p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "OutOfStock"
                                                ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                                : "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                                                }`}
                                        >
                                            {item.status === "OutOfStock"
                                                ? "Out of Stock"
                                                : `${item.quantityAvailable} left`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Internal Transfer Analytics */}
            <div className="mt-6">
                <div
                    className={`rounded-2xl border p-6 shadow-sm ${darkMode
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white/90 border-gray-100"
                        }`}
                >
                    <div className="mb-6">
                        <h2 className="text-lg font-bold">
                            Internal Transfer Analytics
                        </h2>

                        <p
                            className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Transfer activity over the last 7 days
                        </p>
                    </div>

                    {/* Main Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Successful */}
                        <div
                            className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-green-50"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Successful
                            </p>

                            <p className="text-2xl font-bold text-green-500 mt-1">
                                {transferAnalytics.successful}
                            </p>
                        </div>

                        {/* Failed */}
                        <div
                            className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-red-50"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Failed
                            </p>

                            <p className="text-2xl font-bold text-red-500 mt-1">
                                {transferAnalytics.failed}
                            </p>
                        </div>

                        {/* Unverified */}
                        <div
                            className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-orange-50"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Unverified
                            </p>

                            <p className="text-2xl font-bold text-orange-500 mt-1">
                                {transferAnalytics.unverified}
                            </p>
                        </div>

                        {/* Total */}
                        <div
                            className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-blue-50"
                                }`}
                        >
                            <p
                                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                Total Transfers
                            </p>

                            <p className="text-2xl font-bold text-blue-500 mt-1">
                                {transferAnalytics.totalTransfers}
                            </p>
                        </div>
                    </div>

                    {/* Successful Amount */}
                    <div
                        className={`mt-4 rounded-xl p-5 ${darkMode ? "bg-gray-800" : "bg-gray-50"
                            }`}
                    >
                        <p
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Successful Transfer Amount
                        </p>

                        <p className="text-2xl font-bold mt-1">
                            {Number(
                                transferAnalytics.successfulAmount || 0
                            ).toLocaleString()}{" "}
                            ETB
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-6">
                <div
                    className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white/90 border-gray-100"
                        }`}
                >
                    <div className="p-6">
                        <h2 className="text-lg font-bold">
                            Recent Orders
                        </h2>

                        <p
                            className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Latest customer orders
                        </p>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div
                            className={`px-6 pb-6 text-center ${darkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                        >
                            No recent orders available.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead
                                    className={
                                        darkMode
                                            ? "bg-gray-800 text-gray-400"
                                            : "bg-gray-50 text-gray-500"
                                    }
                                >
                                    <tr>
                                        <th className="text-left px-6 py-4 font-semibold">
                                            Order
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold">
                                            Date
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold">
                                            Items
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold">
                                            Payment
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold">
                                            Amount
                                        </th>

                                        <th className="text-left px-6 py-4 font-semibold">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody
                                    className={
                                        darkMode
                                            ? "divide-y divide-gray-800"
                                            : "divide-y divide-gray-100"
                                    }
                                >
                                    {recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className={
                                                darkMode
                                                    ? "hover:bg-gray-800/60 transition"
                                                    : "hover:bg-gray-50 transition"
                                            }
                                        >
                                            {/* Order Number */}
                                            <td className="px-6 py-4 font-semibold">
                                                #{order.orderNumber}
                                            </td>

                                            {/* Date */}
                                            <td
                                                className={
                                                    darkMode
                                                        ? "px-6 py-4 text-gray-400"
                                                        : "px-6 py-4 text-gray-500"
                                                }
                                            >
                                                {new Date(
                                                    order.orderDate
                                                ).toLocaleString()}
                                            </td>

                                            {/* Items */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {order.items?.map((item, index) => (
                                                        <div key={index}>
                                                            {item.itemName} × {item.quantity}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            {/* Payment */}
                                            <td className="px-6 py-4">
                                                {order.paymentMethod ===
                                                    "InternalTransfer"
                                                    ? "Internal Transfer"
                                                    : order.paymentMethod}
                                            </td>

                                            {/* Amount */}
                                            <td className="px-6 py-4 font-semibold">
                                                {Number(
                                                    order.totalAmount || 0
                                                ).toLocaleString()}{" "}
                                                ETB
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${order.status === "Served"
                                                        ? "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400"
                                                        : order.status === "Pending"
                                                            ? "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                                                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;