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

- If Cart Total is greater than ₹5000
  - Apply 10% Discount
- Otherwise
  - No Discount

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

**Nivas Bidave**

### Technologies

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM

---

# 📄 License

This project was developed for a **Technical Evaluation Assignment**. It is intended for educational and demonstration purposes only.
