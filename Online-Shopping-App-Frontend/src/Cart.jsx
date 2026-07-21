import { useEffect, useState } from 'react';
import {
  clearCart,
  getCart,
  getCartSummary,
  removeCartItem,
  updateCartItem,
} from './api';
import CartItem from './CartItem';

const Cart = ({ cartId, onCartChanged }) => {
  const [cart, setCart] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!cartId) return;

    try {
      const [cartRes, summaryRes] = await Promise.all([
        getCart(cartId),
        getCartSummary(cartId),
      ]);

      setCart(cartRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [cartId]);

  const handleQtyUpdate = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await updateCartItem(cartId, productId, quantity);
      await loadCart();
      onCartChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(cartId, productId);
      await loadCart();
      onCartChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart(cartId);
      await loadCart();
      onCartChanged();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-slate-600">Loading cart...</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Your Cart</h2>
            <p className="text-sm text-slate-300">
              Cart ID: {cartId}
            </p>
          </div>

          <button
            onClick={handleClear}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Cart Items */}
        <div className="space-y-4">
          {cart?.cartItems?.length > 0 ? (
            cart.cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQty={handleQtyUpdate}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              Your cart is empty.
            </div>
          )}
        </div>

        {/* Purchase Summary */}
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Purchase Summary
            </h3>

            {summary ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{summary.items?.length || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{summary.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>₹{summary.discountAmount}</span>
                </div>

                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Grand Total</span>
                  <span>₹{summary.grandTotal}</span>
                </div>
              </div>
            ) : (
              <p>No purchase summary available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;