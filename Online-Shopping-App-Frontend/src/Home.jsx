import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addCartItem, getCartSummary } from "./api";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import PurchaseSummary from "./PurchaseSummary";

const Home = ({
  cartId,
  cartCount,
  onCartChanged,
}) => {
  const [summary, setSummary] = useState(null);
  const [productRefreshToken, setProductRefreshToken] = useState(0);

  // Load Purchase Summary
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadSummary = async () => {
      if (!cartId) return;

      try {
        const response = await getCartSummary(cartId);
        setSummary(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadSummary();
  }, [cartId, cartCount]);

  // Add Product to Cart
  const handleAddToCart = async (product) => {
    if (!cartId) return;

    try {
      await addCartItem(cartId, product.id, 1);

      // Refresh Cart
      await onCartChanged(cartId);

      // Reload Purchase Summary
      const response = await getCartSummary(cartId);
      setSummary(response.data);

      // Success Toast
      toast.success(`🛒 ${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

    } catch (err) {
      console.error(err);

      toast.error("❌ Failed to add product!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">

        {/* Left Section */}
        <div className="space-y-6">

          <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white shadow-lg">
            <h1 className="text-3xl font-semibold">
              Welcome to your online store
            </h1>

            <p className="mt-2 text-cyan-50">
              Browse products, manage your cart, and review your purchase
              summary.
            </p>
          </div>

          <ProductList
            onAddToCart={handleAddToCart}
            refreshToken={productRefreshToken}
          />

        </div>

        {/* Right Section */}
        <div className="space-y-6">

          {JSON.parse(localStorage.getItem("user") || "{}").isAdmin && (
            <AddProduct onProductAdded={() => setProductRefreshToken((value) => value + 1)} />
          )}

          <PurchaseSummary summary={summary} />

        </div>

      </div>
    </div>
  );
};

export default Home;