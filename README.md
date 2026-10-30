# 🛒 Online Shopping Web Application

A full-stack **Online Shopping Web Application** built using **ASP.NET Core Web API**, **React.js (Vite)**, **Entity Framework Core**, and **SQL Server**. The application allows users to register, log in securely, browse products, manage their shopping cart, automatically apply discounts, and view a detailed purchase summary.

-----

# 📌 Project Overview

This project was developed as part of a **Technical Evaluation Assignment** to demonstrate full-stack development skills using modern web technologies.

The application provides a seamless shopping experience with secure user authentication, product management, shopping cart functionality, automatic discount calculation, and a responsive user interface.

-----

# 🎯 Objectives

- Build a secure full-stack web application.
- Implement Authentication and Authorization.
- Perform CRUD operations using REST APIs.
- Manage products and shopping cart.
- Apply business logic for discounts.
- Display purchase summary.
- Follow clean code and component-based architecture.

-----

# 🚀 Features

## 🔐 Authentication

- User Registration
- User Login
- User Logout
- Secure Authentication
- Session Management using Local Storage
- Protected Routes
- User Welcome Message after Login

## Product Management

- View all available products
- Add new products
- Display product name, description, price, and stock
- Responsive product cards

## Shopping Cart

- Create shopping cart
- Add products to cart
- Update product quantity
- Remove products from cart
- Clear shopping cart

## Purchase Summary

- Total Items
- Subtotal
- Automatic Discount Calculation
- Grand Total


------

# 💻  Technology Stack

## Backend

- ASP.NET Core Web API (.NET 10)
- C#
- Entity Framework Core
- SQL Server
- Swagger

## Frontend

- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React Hooks

## Database

- SQL Server

## Development Tools

- Visual Studio 2022
- Visual Studio Code
- SQL Server Management Studio (SSMS)
- Git
- GitHub
- Postman

---

# 🏗 Project Architecture

```
React Frontend
        │
        ▼
Axios HTTP Requests
        │
        ▼
ASP.NET Core Web API
        │
        ▼
Controllers
        │
        ▼
Services
        │
        ▼
Entity Framework Core
        │
        ▼
SQL Server Database
```

---

# 📂 Project Structure

```
OnlineShoppingApplication

Backend
│
├── Controllers
│   ├── AuthController.cs
│   ├── ProductsController.cs
│   └── CartController.cs
│
├── Models
│   ├── User.cs
│   ├── Product.cs
│   ├── Cart.cs
│   └── CartItem.cs
│
├── DTOs
├── Services
├── Data
├── Migrations
├── Properties
├── Program.cs
└── appsettings.json


Frontend
│
├── src
│   ├── components
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── Cart.jsx
│   │   ├── CartItem.jsx
│   │   ├── PurchaseSummary.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

# 🔑 Authentication Flow

```
User Registration
        │
        ▼
User Login
        │
        ▼
Credentials Validated
        │
        ▼
User Session Created
        │
        ▼
Protected Home Page
        │
        ▼
User Logout
```

---

# 📡 REST APIs

## Authentication APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/Auth/register | Register User |
| POST | /api/Auth/login | User Login |

---

## Product APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/Products | Get All Products |
| GET | /api/Products/{id} | Get Product by Id |
| POST | /api/Products | Add Product |
| DELETE | /api/Products/{id} | Delete Product |

---

## Cart APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/Cart/create | Create Cart |
| GET | /api/Cart/{id} | Get Cart |
| POST | /api/Cart/{id}/add-item | Add Product |
| PUT | /api/Cart/{id}/update-item | Update Quantity |
| DELETE | /api/Cart/{id}/remove-item | Remove Product |
| DELETE | /api/Cart/{id}/clear | Clear Cart |
| GET | /api/Cart/{id}/summary | Purchase Summary |

---

# 💵 Discount Logic

Business Rule:

- If the cart subtotal is at least ₹5000, apply the highest discount percentage among its products.
- Otherwise, no cart-level discount is applied.

The discount is calculated automatically whenever products are added to the shopping cart.

---

# 🔄 Application Workflow

```text
User Registers
        │
        ▼
User Logs In
        │
        ▼
Browse Products
        │
        ▼
Add Products to Cart
        │
        ▼
Backend Validates Product
        │
        ▼
Cart Updated
        │
        ▼
Purchase Summary Generated
        │
        ▼
Discount Applied
        │
        ▼
Grand Total Displayed
```

---

# ✅ Validation

### Authentication

- Username is required
- Email validation
- Password is required
- Duplicate user validation

### Product

- Product Name is required
- Description is required
- Price must be greater than zero
- Stock cannot be negative

### Cart

- Product must exist
- Quantity must be greater than zero
- Stock availability checked

---


---

# 🎨 User Interface

The application includes:

- Responsive Navigation Bar
- Login Page
- Registration Page
- Product Listing
- Add Product Form
- Shopping Cart
- Purchase Summary
- User Welcome Message
- Mobile-Friendly Design

---

# 🧪 Testing

### Backend

- Tested all APIs using Swagger
- Verified CRUD operations
- Tested Authentication APIs
- Validated business logic
- Verified HTTP status codes

### Frontend

- Registration
- Login
- Logout
- Product Listing
- Add Product
- Delete Product
- Add to Cart
- Remove from Cart
- Purchase Summary
- Responsive UI

----- 

# ⚙️ Setup Instructions

## Backend

### Clone Repository

```bash
git clone https://github.com/your-username/OnlineShoppingApplication.git
```

### Navigate to Backend

```bash
cd Backend
```

### Restore Packages

```bash
dotnet restore
```

### Update Database

```bash
dotnet ef database update
```

### Run Backend

```bash
dotnet run
```

Swagger will open automatically.

---

## Frontend

### Navigate to Frontend

```bash
cd Frontend
```

### Install Packages

```bash
npm install
```

### Run Application

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

# 👨‍💻 Developed By

**Sudhir Kadam**

### Technologies

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM

## Recent feature additions

- Search products by name/description and filter by category and price.
- Add and remove products from a per-user wishlist.
- Place a demo order from the cart (no payment is collected); stock is checked and deducted, and orders are saved for the user's order history.
- Product creation and deletion are restricted to users with the admin role.
- The admin dashboard provides store totals, product editing, order status updates, and user role management.

### Database update and admin setup

Apply the new migration before starting the API:

```bash
dotnet ef database update --project OnlineShoppingApplication-Backend/OnlineShoppingApplication/OnlineShoppingApplication.csproj
```

Newly registered accounts are regular users. To grant admin access to an existing account, run this command from the repository root after applying the migration:

```powershell
dotnet run --project OnlineShoppingApplication-Backend\OnlineShoppingApplication\OnlineShoppingApplication.csproj -- --promote-admin admin@example.com
```

This only promotes an already-registered email; it cannot create accounts or change passwords. The user must log in again to receive an admin token. Keep the admin account email under your control.

### New API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Wishlist` | Get the signed-in user's wishlist |
| POST | `/api/Wishlist/{productId}` | Add a product to the wishlist |
| DELETE | `/api/Wishlist/{productId}` | Remove a product from the wishlist |
| POST | `/api/Orders/checkout/{cartId}` | Place an order and deduct stock |
| GET | `/api/Orders` | Get the signed-in user's order history |
| GET | `/api/Admin/dashboard` | Store totals and sales summary (admin only) |
| GET | `/api/Admin/orders` | List all orders (admin only) |
| PUT | `/api/Admin/orders/{orderId}/status` | Advance or cancel an order (admin only) |
| GET | `/api/Admin/users` | List users without password data (admin only) |
| PUT | `/api/Admin/users/{userId}/role` | Grant or revoke admin access (admin only) |

`POST /api/Products`, `PUT /api/Products/{id}`, and `DELETE /api/Products/{id}` require the Admin role.

---
<<<<<<< HEAD
=======


>>>>>>> e360b299b71b84890aa934d0bc8d20017619909a
