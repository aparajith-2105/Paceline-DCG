# 🛍️ Paceline

A modern e-commerce web application built with **HTML, CSS, and JavaScript**, featuring a complete shopping flow from product browsing to checkout and order management.

## 🚀 Overview

**Paceline** is a front-end e-commerce project designed for a DCG club recruitment and a model of the home page and the about page was given already where i made many additions like interactive buttons and changed the images.

The project includes product browsing, cart management, checkout, payment selection, persistent order history, order tracking, cancellation, and return/exchange functionality.

**Live Demo**:

## ✨ Features

* 🛍️ Product browsing
* 🛒 Add products to cart
* 📦 Dynamic cart management
* 💳 Checkout and payment selection
* 💰 Pay on Delivery
* 📱 UPI payment option
* 💳 Credit/Debit Card option
* 📋 Persistent order history
* 🚚 Multi-stage order tracking

  * Ordered
  * Packed
  * Shipped
  * Out for Delivery
  * Delivered
* ❌ Order cancellation
* 🔄 Return / Exchange request system
* 💾 Local Storage-based data persistence
* 📱 Responsive user interface

## 🔄 Shopping Flow

```text
Product Browsing
       ↓
     Cart
       ↓
   Checkout
       ↓
   Payment
       ↓
 Order Placed
       ↓
 Order Tracking
       ↓
Delivered
   ↙       ↘
Return    Exchange
```

## 🛠️ Technologies Used

* **HTML5** – Page structure
* **CSS3** – Styling and responsive design
* **JavaScript** – Application logic and dynamic interactions
* **Local Storage** – Persistent cart and order data
* **DOM Manipulation** – Dynamic UI updates
* **Deployment** - Vercel

## 📂 Project Structure

```text
Paceline-DCG/
│
├── css/
│   └── Stylesheets
│
├── js/
│   └── JavaScript files
│
├── img/
│   └── Product and website images
│
├── index.html
├── footwear.html
├── cart.html
├── checkout.html
├── orders.html
└── README.md
```

## 📦 Order Management

Orders are stored using the browser's **Local Storage**, allowing order information to remain available when navigating between pages.

Each order contains information such as:

* Order ID
* Order date
* Products
* Quantity
* Payment method
* Total amount
* Delivery status
* Cancellation information
* Return / Exchange request information

## 🚚 Order Tracking

Each order has a visual tracking system with five stages:

```text
Ordered → Packed → Shipped → Out for Delivery → Delivered
```

The tracking interface updates according to the order's current status.

## ❌ Cancellation

Orders can be cancelled before they reach the **Delivered** stage.

## 🔄 Return / Exchange

Once an order reaches **Delivered**, the **Return / Exchange** option becomes available.

Users can:

1. Choose Return or Exchange.
2. Select a reason.
3. Submit the request.
4. View the updated order information.

## 💾 Data Storage

The application uses **Local Storage** to maintain shopping and order information on the client side.

This allows the project to demonstrate persistent application state without requiring a backend database.

## 🎯 Project Goal

The goal of Paceline DCG is to build a practical e-commerce interface while applying core front-end development concepts such as:

* DOM manipulation
* Event handling
* Client-side state management
* Local Storage
* Dynamic rendering
* Responsive design
* Multi-page application flow

## 👨‍💻 Author

**Aparajith**

Built as a hands-on web development project to practice and demonstrate front-end development skills.

