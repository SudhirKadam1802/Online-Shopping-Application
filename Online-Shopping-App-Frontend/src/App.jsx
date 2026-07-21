import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { createCart } from "./api";

import Navbar from "./Navbar";
import Home from "./Home";
import Cart from "./Cart";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [cartId, setCartId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = () => {
    setCartCount((prev) => prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const initializeCart = async () => {
      if (cartId) return;

      try {
        const response = await createCart();
        setCartId(response.data.id || response.data.cartId);
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
                    setCartId={setCartId}
                    cartCount={cartCount}
                    setCartCount={setCartCount}
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