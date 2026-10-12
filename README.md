#  Restaurant Ordering System — Customer Frontend

A modern, responsive restaurant ordering application built with **React, Vite, and Tailwind CSS**. The customer-facing frontend connects to a shared backend used by both the customer and administration interfaces, providing a seamless ordering experience with real-time menu availability, secure order verification, payment validation, and SMS notifications.

## Project Overview

The restaurant management system is divided into two independent frontend applications:

* **Customer Frontend:** Enables customers to explore the menu, add items to their cart, place orders, make payments, and contact the restaurant.
* **Admin Frontend:** Allows restaurant administrators to manage menu items, control inventory, schedule menus, and manage customer orders.

Both frontends consume the same backend API, ensuring that menu availability, inventory quantities, scheduling, and order status remain consistent across the system.

##  Key Features

###  Modern Landing Page

* Attractive hero section introducing the restaurant.
* Clean, modern interface designed to showcase the restaurant and its offerings.
* Responsive layout for desktop, tablet, and mobile devices.
* Easy navigation between the home page, menu, about section, and contact page.

###  Dynamic Menu Management

* Displays menu items and their details, including names, descriptions, prices, and images.
* Retrieves menu data directly from the shared backend.
* Automatically reflects menu availability and updates made by administrators.
* Supports administrator-controlled menu scheduling for specific days and time periods.
* Displays available stock quantities to customers when quantity tracking is enabled.
* Prevents customers from ordering unavailable items.

### 🛒 Shopping Cart

* Add menu items to the cart.
* Increase or decrease item quantities.
* View selected items and order totals before checkout.
* Enforce stock limits when quantity tracking is enabled.
* Prevent ordering beyond the available quantity.
* Keep customers informed when an item becomes unavailable or its stock changes.

### 💳 Payment Integration

The system supports two payment methods:

**1. Cash Payment**

* Requires OTP (One-Time Password) verification as part of the order confirmation process.
* Uses SMS verification to help ensure that the order is confirmed by the customer.

**2. Internal Bank Transfer**

* Automatically retrieves the customer's account details before order placement.
* Checks the customer's available account balance against the order requirements before proceeding.
* Sends an OTP to the phone number registered to the customer's account.
* Requires successful OTP verification as part of the order confirmation process.
* Validates payment and order requirements through the backend before completing the transaction.

The backend is responsible for enforcing payment validation and order-processing rules rather than relying on frontend checks alone.

### 📦 Order Management and Stock Consistency

* Automatically refreshes relevant menu and availability data every five seconds.
* Reflects inventory changes made by the administrator.
* Updates visible quantities when stock tracking is enabled.
* Checks stock availability during order processing to prevent competing orders from exceeding available inventory.
* Handles situations where another customer purchases the remaining stock before an order is completed.
* Uses backend validation and transaction rollback to prevent unsuccessful or invalid transactions from being treated as successful orders.

### 📱 SMS Notifications

The system integrates SMS notifications into important stages of the customer ordering workflow:

* OTP delivery for verification.
* Order confirmation after a successful order.
* Notification when an order is ready or has been served.

These notifications help customers stay informed about their orders without constantly checking the application.

### 📞 About and Contact Pages

* Dedicated pages for restaurant information and customer communication.
* Contact interface for customers who need to reach the restaurant.
* Consistent styling and navigation throughout the application.

### 🌗 Dark and Light Mode

* Toggle between dark and light themes.
* Theme-aware page backgrounds, text, and interface elements.
* Improved readability across different lighting preferences.

### 📱 Responsive Design

* Mobile-first, responsive layouts.
* Optimized navigation and content presentation across desktop, tablet, and mobile screens.
* Responsive menu cards, cart interfaces, forms, and interactive components.

### 🔔 User Feedback and Interactive Components

* Toast notifications using React Toastify.
* Modal dialogs for important actions and confirmation flows.
* Loading, validation, and error feedback to improve the customer experience.

## 🛠️ Technology Stack

| Technology     | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| React          | Component-based frontend development                     |
| Vite           | Development server and build tooling                     |
| Tailwind CSS   | Responsive styling and UI design                         |
| Axios          | HTTP requests and backend API integration                |
| React Router   | Client-side navigation                                   |
| React Toastify | Toast notifications and user feedback                    |
| React Icons    | Interface icons                                          |
| Context API    | Shared application state, including cart and theme state |

## 🏗️ System Architecture

The customer and admin applications are separate frontends that communicate with the same backend API.

```text
                 ┌──────────────────────┐
                 │   Customer Frontend  │
                 │ React + Vite         │
                 │ Menu, Cart, Checkout │
                 └──────────┬───────────┘
                            │
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Shared Backend API │
                 │ ASP.NET Core / .NET 8│
                 │                      │
                 │ Authentication       │
                 │ Menu & Scheduling    │
                 │ Inventory Validation │
                 │ Order Processing     │
                 │ Payment Verification │
                 │ SMS Integration      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │     SQL Database     │
                 │ Menu, Stock, Orders  │
                 │ Users and Payments   │
                 └──────────────────────┘
                            ▲
                            │
                 ┌──────────┴───────────┐
                 │    Admin Frontend    │
                 │ React + Vite         │
                 │ Menu, Stock, Orders  │
                 └──────────────────────┘
```

**Important:** The backend is responsible for authoritative stock validation, account-balance checks, OTP verification, transaction handling, and order status updates. The frontend presents the results and provides the customer interface.

## 🔐 Reliability and Validation

The system incorporates multiple checks to improve the reliability of order processing:

* **Stock validation:** Prevents ordering unavailable items or exceeding tracked quantities.
* **Balance validation:** Checks account balance before processing internal bank transfer orders.
* **OTP verification:** Requires verification through the registered phone number as part of the ordering workflow.
* **Transaction rollback:** Supports rollback when order-processing requirements cannot be satisfied.
* **Error logging:** Records relevant errors during processing to assist with troubleshooting and transaction investigation.
* **Backend enforcement:** Critical business rules are validated on the server to prevent reliance on client-side validation alone.

These controls help maintain consistency between menu availability, inventory, payments, and customer orders.

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js and npm
* Git
* Access to the restaurant backend API

### 1. Clone the Repository

```bash
git clone https://github.com/NatnaelAbreham/restaurant_website.git
cd https://github.com/NatnaelAbreham/restaurant_website
```

Replace the repository URL and folder name with your actual values.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Backend API

Configure the Axios base URL to point to the backend API.

Example:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "YOUR_BACKEND_API_URL/api",
  withCredentials: true,
});

export default api;
```

Use the appropriate backend URL for your development or production environment. If the backend uses cookie-based authentication, configure the backend CORS and cookie settings appropriately.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

### 5. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📁 Main Application Areas

The application is organized around the following customer-facing features:

* **Home:** Restaurant hero section and landing page.
* **Menu:** Dynamically loaded menu items and availability.
* **Cart:** Selected items, quantities, and order totals.
* **Checkout:** OTP verification and supported payment workflows.
* **About:** Restaurant information.
* **Contact:** Customer communication interface.
* **Theme:** Dark and light mode support.

## 🎯 Project Goals

This project aims to deliver a convenient and reliable restaurant ordering experience by combining an intuitive customer interface with backend-enforced business rules.

Its primary goals are to:

* Simplify online food ordering.
* Keep menu availability synchronized with administrative changes.
* Reduce overselling through stock validation.
* Support verified cash and internal bank transfer workflows.
* Improve customer communication through SMS notifications.
* Provide a consistent experience across desktop and mobile devices.

## 🔮 Future Enhancements

Potential improvements include:

* Live order-status updates without periodic polling.
* Online order history and customer profiles.
* Expanded payment integrations.
* Automated testing and end-to-end checkout tests.
* Accessibility improvements and performance optimization.

## 👨‍💻 Developer

**Natnael Abreham**

Software Developer | Full-Stack Web Developer

* **Portfolio:** https://natnaelabreham.github.io/portfolio/
* **GitHub:** https://github.com/Natnaelabreham

---

*Built with React, Vite, and Tailwind CSS as the customer-facing application of a shared-backend restaurant ordering and management system.*
