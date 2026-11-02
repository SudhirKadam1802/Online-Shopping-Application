import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addCartItem, getCartSummary } from "./api";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import PurchaseSummary from "./PurchaseSummary";

const Home = ({
  cartId,
  cartCount,
  cartLoading,
  cartError,
  onRetryCart,
  onCartChanged,
}) => {
  const [summary, setSummary] = useState(null);
  const [productRefreshToken, setProductRefreshToken] = useState(0);
  const isAdmin = JSON.parse(localStorage.getItem("user") || "{}").isAdmin;

  // Load Purchase Summary
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isAdmin) return;

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
  }, [cartId, cartCount, isAdmin]);

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
            onAddToCart={isAdmin ? undefined : handleAddToCart}
            isCartReady={Boolean(cartId)}
            isAdmin={isAdmin}
            refreshToken={productRefreshToken}
          />

        </div>

        {/* Right Section */}
        <div className="space-y-6">

          {!isAdmin && cartLoading && (
            <p role="status" className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
              Preparing your cart...
            </p>
          )}
          {!isAdmin && cartError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>{cartError}</p>
              <button type="button" onClick={onRetryCart} className="mt-2 font-semibold underline underline-offset-2">
                Try again
              </button>
            </div>
          )}

          {isAdmin && (
            <AddProduct onProductAdded={() => setProductRefreshToken((value) => value + 1)} />
          )}

          {!isAdmin && <PurchaseSummary summary={summary} />}

        </div>

      </div>
    </div>
  );
};

export default Home;