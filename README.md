# Cart Avenue

A full-stack online shopping application built with React, ASP.NET Core Web API, Entity Framework Core, and PostgreSQL. Customers can browse products, manage a cart and wishlist, and place demo orders. Administrators can manage products, orders, and user roles.

## Features

- User registration and JWT-based login
- Protected customer and administrator pages
- Product search, category and price filters, stock display, and product-level discounts
- Shopping cart with quantity updates and purchase summary
- Product-level discounts: each discounted product's percentage is applied to its own cart line; products without a discount remain full price
- Wishlist and order history
- Demo checkout that checks and deducts stock (no payment is collected)
- Admin dashboard for product, order, and user-role management
- Swagger API documentation in the backend development environment

## Technology

- **Frontend:** React 18, Vite, Tailwind CSS, Axios, React Router
- **Backend:** ASP.NET Core Web API on .NET 10, Entity Framework Core 10, JWT authentication
- **Database:** PostgreSQL (Npgsql)
- **Tests:** xUnit and EF Core InMemory

## Repository layout

```text
Online-Shopping-Application-main/
├── Online-Shopping-App-Frontend/       # React/Vite application
└── OnlineShoppingApplication-Backend/
    ├── OnlineShoppingApplication/      # ASP.NET Core API
    ├── OnlineShoppingApplication.Tests/
    └── OnlineShoppingApplication.slnx
```

## Prerequisites

- .NET 10 SDK
- Node.js compatible with Vite 8 (Node.js 20.19+ or 22.12+)
- PostgreSQL (local or Neon)
- Entity Framework Core CLI (`dotnet-ef`) for applying migrations

Install the EF CLI if needed:

```bash
dotnet tool install --global dotnet-ef
```

## Configuration

The API reads its PostgreSQL connection string from `ConnectionStrings:DefaultConnection` and JWT settings from `Jwt:Issuer`, `Jwt:Audience`, and `Jwt:Key`. Configure these values with .NET User Secrets for local development rather than committing credentials:

```bash
cd OnlineShoppingApplication-Backend/OnlineShoppingApplication
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your PostgreSQL connection string>"
dotnet user-secrets set "Jwt:Issuer" "<your issuer>"
dotnet user-secrets set "Jwt:Audience" "<your audience>"
dotnet user-secrets set "Jwt:Key" "<a private signing key of at least 32 characters>"
```

For deployment, configure `Cors__AllowedOrigins__0` on the API host with the frontend's exact HTTPS origin (for example, `https://your-frontend.onrender.com`). The local Vite origins remain enabled for development.

The frontend defaults to the API's HTTPS development URL, `https://localhost:7252`. To use another API address, set `VITE_API_BASE_URL` in the frontend environment before starting Vite.

## Run locally

### 1. Configure the database and start the API

From the repository root, configure the secrets above, then apply the EF Core migrations and run the API:

```bash
cd OnlineShoppingApplication-Backend/OnlineShoppingApplication
dotnet ef database update
dotnet run --launch-profile https
```

The API uses PostgreSQL and the HTTPS launch profile listens at `https://localhost:7252`; Swagger is available at `https://localhost:7252/swagger` in Development. The HTTP profile is available at `http://localhost:5031`.

### 2. Start the frontend

In another terminal, from the repository root:

```bash
cd Online-Shopping-App-Frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (by default, `http://localhost:5173`). The API's development CORS policy allows this origin.

### Build the frontend

```bash
cd Online-Shopping-App-Frontend
npm run build
```

## Admin access

New accounts are regular users. To promote an already registered user, run this from the repository root after configuring the backend and applying database migrations:

```bash
dotnet run --project OnlineShoppingApplication-Backend/OnlineShoppingApplication/OnlineShoppingApplication.csproj -- --promote-admin admin@example.com
```

Replace the example with the registered account's email. The user must sign in again to receive a token with the updated role. Keep administrator access restricted to trusted users.

## API overview

Most endpoints require JWT authentication. Registration, login, and public product GET endpoints do not require authentication. Endpoints marked Admin require the Admin role.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/Auth/register` | Register a user |
| POST | `/Auth/login` | Sign in and receive a JWT |
| GET | `/Products` | List products |
| GET | `/Products/{id}` | Get a product |
| POST | `/Products` | Create a product (Admin) |
| PUT | `/Products/{id}` | Update a product (Admin) |
| DELETE | `/Products/{id}` | Delete a product (Admin) |
| POST | `/Cart/create` | Get or create the current user's cart |
| GET | `/Cart/{id}` | Get cart contents |
| POST | `/Cart/{id}/add-item?productId={productId}&quantity={quantity}` | Add a product |
| PUT | `/Cart/{id}/update-item?productId={productId}&quantity={quantity}` | Update a quantity |
| DELETE | `/Cart/{id}/remove-item?productId={productId}` | Remove an item |
| DELETE | `/Cart/{id}/clear` | Empty the cart |
| GET | `/Cart/{id}/summary` | Get subtotal, product discounts, and total |
| POST | `/Orders/checkout/{cartId}` | Place an order and deduct stock |
| GET | `/Orders` | Get the current user's order history |
| GET | `/Wishlist` | Get the current user's wishlist |
| POST | `/Wishlist/{productId}` | Add a product to the wishlist |
| DELETE | `/Wishlist/{productId}` | Remove a product from the wishlist |
| GET | `/Admin/dashboard` | Get store totals (Admin) |
| GET | `/Admin/orders` | List orders (Admin) |
| DELETE | `/Admin/orders/{orderId}` | Delete an order (Admin) |
| PUT | `/Admin/orders/{orderId}/status` | Update order status (Admin) |
| GET | `/Admin/users` | List users (Admin) |
| PUT | `/Admin/users/{userId}/role` | Change a user's admin role (Admin) |

Use the Swagger UI during development for request and response schemas.

## Discount calculation

Discounts are configured per product by an administrator. The cart summary and checkout calculate each cart line's discount using that product's discount percentage and quantity, then sum the line discounts. There is no minimum cart subtotal threshold. The order stores the resulting discount amount and the product discount percentages.

## Tests

Run the backend tests from the repository root:

```bash
dotnet test OnlineShoppingApplication-Backend/OnlineShoppingApplication.Tests/OnlineShoppingApplication.Tests.csproj
```
