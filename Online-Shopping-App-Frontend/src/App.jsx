import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { createCart, getCart } from "./api";

import Navbar from "./Navbar";
import Home from "./Home";
import Cart from "./Cart";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [cartId, setCartId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("auth-changed", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth-changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const refreshCartCount = (id = cartId) => {
    if (!id) {
      setCartCount(0);
      return;
    }

    getCart(id)
      .then((response) => {
        const count = response.data.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartCount(count);
      })
      .catch((error) => console.error("Error refreshing cart:", error));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const initializeCart = async () => {
      if (cartId) return;

      try {
        const response = await createCart();
        const id = response.data.id || response.data.cartId;
        setCartId(id);
        const cartResponse = await getCart(id);
        setCartCount(cartResponse.data.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0);
      } catch (error) {
        console.error("Error creating cart:", error);
      }
    };

    initializeCart();
  }, [cartId]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800">

        <Navbar cartCount={cartCount} />

        <main className="mx-auto max-w-7xl px-6 py-8">

          <Routes>

            {/* Home */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home
                    cartId={cartId}
                    cartCount={cartCount}
                    onCartChanged={refreshCartCount}
                  />
                </ProtectedRoute>
              }
            />

            {/* Cart */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart
                    cartId={cartId}
                    onCartChanged={refreshCartCount}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders isAdmin={user?.isAdmin === true} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  {user?.isAdmin
                    ? <Admin />
                    : <div role="alert" className="rounded-xl bg-red-50 p-6 text-red-700">Administrator access is required.</div>}
                </ProtectedRoute>
              }
            />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

          </Routes>

        </main>

        {/* Toast Notification */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />

      </div>
    </Router>
  );
}

export default App;