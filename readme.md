# 🛒 My E-Commerce Platform

A full-stack e-commerce application with **admin dashboard**, **Stripe payments**, and **order management system** built using modern web technologies.

---

## 🚀 Features

### 🧑‍💻 User Side

* Browse products & categories
* Add to cart & checkout
* Secure payments via Stripe
* Order creation & tracking

---

### 🛠 Admin Dashboard

* 📦 Manage Products (Add / Edit / Delete)
* 🗂 Manage Categories
* 🧾 View & Manage Orders
* 👥 Manage Users
* 💳 Payments Control (Stripe)
* 📊 Analytics & Revenue tracking
* ⚙️ Account & Settings

---

## 💳 Payments (Stripe Integration)

* Create checkout sessions
* Secure card payments
* Webhook handling for payment confirmation
* Payment status tracking:

  * `pending`
  * `paid`
  * `failed`
* Retry failed payments
* Future-ready for refunds

---

## 📦 Order Management

* Create orders with multiple items
* Auto calculate total amount
* Track:

  * Order Status (`processing`, `completed`, `cancelled`)
  * Payment Status (`pending`, `paid`)
* Admin can:

  * Update order status
  * Delete orders
  * View full order details

---

## 📡 API Endpoints

### 🔐 Auth Required Routes

#### 🧾 Orders

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | `/api/orders`          | Create new order               |
| POST   | `/api/orders/checkout` | Create Stripe checkout session |
| GET    | `/api/orders`          | Get all orders (Admin)         |
| GET    | `/api/orders/:id`      | Get single order               |
| PUT    | `/api/orders/:id`      | Update order status (Admin)    |
| DELETE | `/api/orders/:id`      | Delete order (Admin)           |

---

### 🔔 Stripe Webhook

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| POST   | `/api/orders/webhook` | Handle Stripe payment events |

---

## 🧠 Backend Logic

### Order Flow

1. User places order → status: `processing`
2. Stripe session created
3. Payment success → webhook updates:

   * `paymentStatus = paid`
4. Admin updates order status

---

## 📊 Analytics (Admin)

* Total Revenue
* Total Orders
* Failed Payments
* Sales Trends (charts ready)
* Payment distribution

---

## 🖥 Dashboard Structure

### Sidebar Navigation

* Dashboard
* Orders
* Products
* Categories
* Users
* Payments
* Analytics
* Settings

---

### 💰 Finance Section

* All Payments
* Failed Payments
* Refunds
* Revenue Analytics

---

## ⚙️ Tech Stack

### Frontend

* React
* Tailwind CSS
* shadcn/ui
* Lucide Icons
* Recharts (Analytics)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Payments

* Stripe API
* Stripe Webhooks

---

## 🔒 Authentication

* JWT-based authentication
* Admin-only protected routes

---

## 📁 Project Structure

```
/backend
  /controllers
  /models
  /routes
  /middlewares

/frontend
  /components
  /pages
  /services
  /context
```

---

## ⚡ Future Improvements

* Refund system via Stripe API
* Inventory / stock tracking
* Discount & coupon system
* Email notifications
* Advanced analytics dashboard
* Role-based access control

---

## 🧪 Error Handling

* API error responses
* Loading states in UI
* Empty states (no data)
* Retry mechanisms (payments)

---

## 🎯 Goal of the Project

To build a **production-ready e-commerce system** with:

* Real payment flow
* Admin control panel
* Scalable architecture

---

## 🧑‍💼 Author

Built as a full-stack learning + production-ready project.

---

## ⭐ Notes

This project is designed to simulate a **real business dashboard**, focusing on:

* Order lifecycle
* Payment flow
* Admin operations
* Clean UI/UX

---
