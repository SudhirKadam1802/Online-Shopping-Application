import { useEffect, useState } from 'react';
import { getAdminOrders, getOrders } from '../api';

const formatPrice = (amount) => `₹${Number(amount).toFixed(2)}`;

const Orders = ({ isAdmin = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (isAdmin ? getAdminOrders() : getOrders())
      .then((response) => setOrders(response.data))
      .catch(() => setError(`Unable to load ${isAdmin ? 'store' : 'your'} orders. Please try again.`))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (loading) return <p className="text-slate-600">Loading orders...</p>;

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-bold text-slate-800">{isAdmin ? 'All store orders' : 'Order history'}</h1>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      {!error && orders.length === 0 && (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500">
          {isAdmin ? 'No orders have been placed yet.' : 'You have not placed any orders.'}
        </p>
      )}
      {orders.map((order) => (
        <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div>
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              {isAdmin && (
                <p className="text-sm text-slate-500">
                  Customer: {order.customerName || `User ${order.userId}`}
                </p>
              )}
              <p className="text-sm text-slate-500">Status: {order.status || 'Placed'}</p>
            </div>
            <time className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</time>
          </div>
          <ul className="space-y-2">
            {order.items?.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 text-sm">
                <span>{item.productName} × {item.quantity}</span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Discount</dt><dd>−{formatPrice(order.discountAmount)}</dd></div>
            <div className="flex justify-between font-bold"><dt>Total</dt><dd>{formatPrice(order.grandTotal)}</dd></div>
          </dl>
        </article>
      ))}
    </section>
  );
};

export default Orders;
