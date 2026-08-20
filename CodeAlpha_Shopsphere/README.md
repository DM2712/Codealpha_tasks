# 🛍️ ShopSphere — Full-Stack E-Commerce Web Application

> **CodeAlpha Task 1: Simple E-Commerce Store**  
> A production-ready, full-stack e-commerce web platform engineered with **React (Vite)**, **Node.js + Express**, **Clerk Authentication**, and **Supabase PostgreSQL**, designed with the **LuxeCommerce Pro UI** design system.

---

## 🌟 Key Features

### 🛒 Customer Experience & Discovery
- **Dynamic Product Catalog**: Powered by an external product API proxy with real-time category filtering, search queries, price range slider, and multi-criteria sorting (Price Low/High, Rating).
- **Product Details & Specs**: High-res image gallery, rating review stats, in-stock indicators, discount tags, quantity picker, customer reviews, and related products carousel.
- **Interactive Shopping Cart**:
  - Slide-out quick cart drawer + dedicated full cart page.
  - Persistent state synchronized with `localStorage`.
  - Live subtotal, tax estimation, coupon discount code support (`SHOPSPHERE10` for 10% off, `VIP20` for 20% off).
  - Dynamic free shipping progress tracker (Free delivery on orders > $50).

### 🔐 Authentication & Security
- **Clerk Authentication**: Sign-in, Sign-up, user profiles, and session tokens.
- **Resilient Fallback Mode**: If Clerk keys are not yet configured, the app runs with an instant Demo mode so all flows can be reviewed without delay.
- **Protected Routes**: Guards checkout and order history pages.

### 💳 Checkout & Persistent Order Processing
- **Streamlined Checkout**: Collects shipping address, delivery details, and payment method selection.
- **Order Confirmation**: Celebratory confetti animation, unique order ID generator, delivery milestone timeline, and itemized receipt breakdown.
- **Customer Order History**: Authenticated `My Orders` page displaying all past orders, line items, and fulfillment statuses.

### 🛡️ Admin Dashboard & Analytics
- **Live Metrics**: Gross sales revenue, total order count, pending fulfillment actions, and average order value.
- **Fulfillment Management**: Change order statuses (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) directly updating database records.

---

## 🏗️ Architecture & Directory Structure

```text
CodeAlpha_Shopsphere/
├── frontend/                   # React + Vite Frontend Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # ProtectedRoute
│   │   │   ├── cart/           # CartDrawer, CartItem, OrderSummary
│   │   │   ├── layout/         # Navbar, Footer, MobileBottomNav
│   │   │   ├── product/        # ProductCard, ProductGrid, ProductFilters, QuantitySelector
│   │   │   └── ui/             # Skeleton loaders, Toasts
│   │   ├── context/            # AuthContext, CartContext, ToastContext
│   │   ├── pages/              # Home, Catalog, ProductDetail, Cart, Checkout, Confirmation, Orders, Profile, Admin
│   │   ├── services/           # api.js (Axios API Client)
│   │   ├── App.jsx             # Main Router & Provider Tree
│   │   ├── index.css           # Tailwind directives & Custom animations
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── config/             # Supabase PostgreSQL initialization
│   │   ├── controllers/        # productController, orderController, userController
│   │   ├── middleware/         # authMiddleware (Clerk token & dev header verification)
│   │   ├── routes/             # productRoutes, orderRoutes, userRoutes
│   │   ├── services/           # productService (External API proxy), storeService (Supabase + fallback)
│   │   └── index.js            # Express Server entry point
│   ├── package.json
│   └── .env.example
│
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL DDL & RLS script
│
├── package.json                # Root package for concurrent execution
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Install All Dependencies
Run from the root project folder:
```bash
npm run install:all
```
*Or install individually:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

#### Backend (`backend/.env`)
Copy the template or create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: Clerk Authentication (https://dashboard.clerk.com)
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional: Supabase PostgreSQL (https://supabase.com/dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# External Product API
EXTERNAL_PRODUCT_API_URL=https://dummyjson.com/products
```

#### Frontend (`frontend/.env`)
Copy the template or create `frontend/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note:** The application includes **Zero-Config Resilient Storage & Demo Auth**. If you run the project without filling API keys, it will work immediately using the fallback in-memory store and demo authentication.

### 4. Run Frontend & Backend Simultaneously
From the root directory:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Open the **SQL Editor** tab in Supabase.
3. Paste and run the script from [`supabase/schema.sql`](supabase/schema.sql):
   - Creates `user_profiles` table
   - Creates `orders` table
   - Creates `order_items` table
   - Enables Row Level Security (RLS) and indexes
4. Copy your **Project URL** and **Service Role Secret** into `backend/.env`.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Server & DB health status | No |
| `GET` | `/api/products` | Fetch paginated/filtered products | No |
| `GET` | `/api/products/categories` | List all available categories | No |
| `GET` | `/api/products/:id` | Fetch single product by ID | No |
| `POST` | `/api/orders` | Create a new customer order | Optional / Auth |
| `GET` | `/api/orders/my-orders` | Fetch orders for authenticated customer | Optional / Auth |
| `GET` | `/api/orders/:id` | Fetch receipt details for single order | Optional / Auth |
| `GET` | `/api/orders/admin/all` | Admin: Fetch all store orders | Admin |
| `PATCH`| `/api/orders/:id/status` | Admin: Update fulfillment status | Admin |
| `POST` | `/api/user/sync` | Sync Clerk profile to DB | Optional / Auth |
| `GET` | `/api/user/profile` | Retrieve customer profile | Optional / Auth |

---

## 🚢 Deployment Guide

### Frontend on Vercel
1. Push the repository to GitHub.
2. Import repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variables:
   - `VITE_API_BASE_URL`: Your deployed backend URL (e.g. `https://your-backend.onrender.com/api`)
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
5. Click **Deploy**.

### Backend on Render / Railway
1. Create a **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add environment variables from `backend/.env`.

---

## 🏆 CodeAlpha Task 1 Requirements Compliance

| PRD Requirement | Implementation | Status |
|---|---|---|
| Product Listings | React + Vite Catalog, Search, Filtering, Sorting | ✅ Complete |
| Shopping Cart | Cart Context, LocalStorage sync, Drawer & Cart Page | ✅ Complete |
| Product Details | Dedicated Details Page with Gallery, Reviews, Stock | ✅ Complete |
| Order Processing | Express REST API + Supabase orders table | ✅ Complete |
| User Registration/Login | Clerk Authentication with fallback support | ✅ Complete |
| Persistent App Data | Supabase PostgreSQL tables & relations | ✅ Complete |
| Responsive UI | Modern Tailwind CSS matching LuxeCommerce Stitch specs | ✅ Complete |
