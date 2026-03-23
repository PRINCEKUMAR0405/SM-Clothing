# SM Clothing – Full-Stack Fashion E-Commerce Website

A complete, production-ready clothing e-commerce website inspired by Myntra, built with React + Vite (frontend) and Node.js + Express (backend).

## 🎨 Design
- **Color Palette**: Myntra-inspired — black, white & bold pink (`#FF3F6C`)
- **Fonts**: Playfair Display (headings) + Inter (body text)
- **Real product photos** from Unsplash with set prices (INR)

## 📄 Pages
| Page | URL |
|------|-----|
| 🏠 Home | `/` |
| 👔 Men | `/category/men` |
| 👗 Women | `/category/women` |
| 🧒 Kids | `/category/kids` |
| 👜 Accessories | `/category/accessories` |
| 🛍️ All Products | `/products` |
| 🔖 Sale | `/products?sale=true` |
| ✨ New Arrivals | `/products?new=true` |
| 📦 Product Detail | `/product/:id` |
| 🛒 Cart | `/cart` |
| 💳 Checkout & Billing | `/checkout` |
| ✅ Order Confirmation | `/order-confirmation/:id` |
| 📋 My Orders | `/orders` |
| ❤️ Wishlist | `/wishlist` |
| 👤 Profile | `/profile` |
| 🔑 Login | `/login` |
| 📝 Register | `/register` |
| 🔍 Search | `/search?q=...` |
| ℹ️ About | `/about` |
| 📬 Contact | `/contact` |
| 📊 Admin Dashboard | `/admin` |

## 📊 Admin Dashboard Features
- Revenue, Profit & Loss, COGS analytics
- Monthly revenue vs profit bar chart
- Revenue breakdown by category
- Top-selling products
- All orders table
- Full product catalogue view

## 🛒 E-Commerce Features
- **Cart** with quantity controls, coupon input, shipping calc
- **Checkout** with address + payment (UPI, Card, Net Banking, COD)
- **Billing system** with order summary, savings, GST calculation
- **Wishlist** with add-to-bag
- **Filters** by price, size, rating
- **Search** across all products
- **Order history** with status tracking

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
```

### Backend
```bash
cd backend
npm install
npm start         # http://localhost:5000
```

## 🔑 Demo Login
- **Admin**: `admin@smclothing.in` / any password → access Admin Dashboard
- **User**: any email / any password → regular account

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, Vite 8 |
| Styling | Pure CSS (no framework), CSS Custom Properties |
| Icons | Lucide React |
| Backend | Node.js, Express 5 |
| Database | SQLite via better-sqlite3 |
| Auth | JWT + bcrypt |
| Fonts | Google Fonts (Playfair Display + Inter) |
| Images | Unsplash CDN |
