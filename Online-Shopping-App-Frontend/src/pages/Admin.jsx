import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  LoaderCircle,
  PackagePlus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  UsersRound,
} from 'lucide-react';
import {
  createProduct,
  deleteProduct,
  getAdminDashboard,
  getAdminOrders,
  getAdminUsers,
  getProducts,
  updateAdminOrderStatus,
  updateAdminUserRole,
  updateProduct,
} from '../api';

const emptyProduct = {
  name: '',
  description: '',
  category: '',
  price: '',
  discount: '0',
  stockQuantity: '',
};

const orderStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const nextOrderStatuses = {
  Placed: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

const formatPrice = (value) => `₹${Number(value).toFixed(2)}`;

const metricCards = [
  { key: 'totalProducts', label: 'Products', icon: Boxes, color: 'bg-sky-100 text-sky-700' },
  { key: 'totalUsers', label: 'Registered users', icon: UsersRound, color: 'bg-sky-100 text-sky-700' },
  { key: 'activeOrders', label: 'Active orders', icon: ClipboardList, color: 'bg-amber-100 text-amber-700' },
  { key: 'totalSales', label: 'Total sales', icon: CircleDollarSign, color: 'bg-emerald-100 text-emerald-700', currency: true },
];

const statusStyles = {
  Placed: 'border-sky-200 bg-sky-50 text-sky-700',
  Processing: 'border-amber-200 bg-amber-50 text-amber-700',
  Shipped: 'border-blue-200 bg-blue-50 text-blue-700',
  Delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Cancelled: 'border-red-200 bg-red-50 text-red-700',
};

const Admin = () => {
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardResponse, productsResponse, ordersResponse, usersResponse] =
        await Promise.all([
          getAdminDashboard(),
          getProducts(),
          getAdminOrders(),
          getAdminUsers(),
        ]);
      setDashboard(dashboardResponse.data);
      setProducts(productsResponse.data);
      setOrders(ordersResponse.data);
      setUsers(usersResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  useEffect(() => {
  if (!notice) return;

  const timer = setTimeout(() => {
    setNotice('');
  }, 3000);

  return () => clearTimeout(timer);
}, [notice]);

  const saveProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      discount: Number(productForm.discount),
      stockQuantity: Number(productForm.stockQuantity),
    };

    try {
      if (editingProductId === null) {
        await createProduct(payload);
        setNotice('Product created.');
      } else {
        await updateProduct(editingProductId, payload);
        setNotice('Product updated.');
      }
      setProductForm(emptyProduct);
      setEditingProductId(null);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save product.');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      discount: String(product.discount),
      stockQuantity: String(product.stockQuantity),
    });
    document.getElementById('admin-product-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    setError('');
    setNotice('');
    try {
      await deleteProduct(product.id);
      setNotice('Product deleted.');
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete product.');
    }
  };

  const changeOrderStatus = async (orderId, status) => {
    setError('');
    setUpdatingOrderId(orderId);
    try {
      await updateAdminOrderStatus(orderId, status);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const changeUserRole = async (user, isAdmin) => {
    setError('');
    setNotice('');
    setUpdatingUserId(user.id);
    try {
      await updateAdminUserRole(user.id, isAdmin);
      setNotice(`${user.name}'s role was updated. They must sign in again for the change to take effect.`);
      await loadAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update user role.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const lowStockProducts = products.filter((product) => product.stockQuantity <= 10);
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(productSearch.toLowerCase()),
  );
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.customerName || ''} ${order.userId}`
      .toLowerCase()
      .includes(orderSearch.toLowerCase());
    return matchesSearch && (!orderStatusFilter || (order.status || 'Placed') === orderStatusFilter);
  });
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(userSearch.toLowerCase()),
  );

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin text-sky-500" />
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 pb-12">
      <header className="relative overflow-hidden rounded-3xl border border-sky-400/20 bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] px-6 py-8 text-white shadow-xl shadow-black/20 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Store management
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Admin dashboard</h1>
            <p className="mt-2 max-w-xl text-sm text-gray-300 sm:text-base">
              Manage your catalog, keep orders moving, and see how your store is performing.
            </p>
          </div>
          <button
            type="button"
            onClick={loadAdminData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh data
          </button>
        </div>
        <nav aria-label="Admin dashboard sections" className="relative mt-7 flex flex-wrap gap-2 border-t border-sky-500/20 pt-5">
          {[
            ['#admin-products', 'Products'],
            ['#admin-orders', 'Orders'],
            ['#admin-users', 'Users'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-200 transition hover:bg-sky-500/15 hover:text-sky-300">
              {label}
            </a>
          ))}
        </nav>
      </header>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">{notice}</p>}

      {dashboard && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Store overview">
          {metricCards.map(({ key, label, icon: Icon, color, currency }) => (
            <article key={key} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {currency ? formatPrice(dashboard[key]) : dashboard[key]}
                  </p>
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                {key === 'totalSales' ? (
                  <><ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" /> Excludes cancelled orders</>
                ) : key === 'activeOrders' ? (
                  <><ShoppingBag className="h-3.5 w-3.5 text-amber-600" /> In progress or awaiting action</>
                ) : key === 'totalProducts' && lowStockProducts.length > 0 ? (
                  <><ArrowDownRight className="h-3.5 w-3.5 text-rose-600" /> {lowStockProducts.length} need restocking</>
                ) : (
                  <><ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" /> Store overview</>
                )}
              </p>
            </article>
          ))}
        </section>
      )}

      {lowStockProducts.length > 0 && (
        <aside className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-700"><PackagePlus className="h-4 w-4" /></span>
            <div>
              <h2 className="font-semibold text-amber-950">Low stock needs attention</h2>
              <p className="mt-1 text-sm text-amber-800">
                {lowStockProducts.slice(0, 3).map((product) => `${product.name} (${product.stockQuantity})`).join(' · ')}
                {lowStockProducts.length > 3 ? ` · +${lowStockProducts.length - 3} more` : ''}
              </p>
            </div>
          </div>
          <a href="#admin-products" className="shrink-0 text-sm font-semibold text-amber-900 underline decoration-amber-400 underline-offset-4">Review inventory</a>
        </aside>
      )}

      <section id="admin-products" className="grid scroll-mt-24 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.75fr)]">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Product catalog</h2>
              <p className="mt-1 text-sm text-slate-500">{products.length} products · {lowStockProducts.length} low in stock</p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input aria-label="Search products in admin catalog" value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search products or categories" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Product</th>
                  <th className="px-4 py-3.5 font-semibold">Category</th>
                  <th className="px-4 py-3.5 font-semibold">Price</th>
                  <th className="px-4 py-3.5 font-semibold">Stock</th>
                  <th className="px-4 py-3.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50/80">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      {product.discount > 0 && <p className="mt-0.5 text-xs text-emerald-700">{product.discount}% discount</p>}
                    </td>
                    <td className="px-4 py-3.5"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{product.category}</span></td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 font-semibold ${product.stockQuantity <= 10 ? 'text-rose-700' : 'text-slate-700'}`}>
                        <span className={`h-2 w-2 rounded-full ${product.stockQuantity <= 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        {product.stockQuantity}
                        {product.stockQuantity <= 10 && <span className="text-xs font-medium">Low</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => startEditing(product)} className="rounded-lg px-2.5 py-1.5 font-semibold text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300">Edit</button>
                        <button type="button" onClick={() => removeProduct(product)} className="rounded-lg px-2.5 py-1.5 font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-500">{productSearch ? 'No matching products.' : 'No products found.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <form id="admin-product-form" onSubmit={saveProduct} className="space-y-4 self-start rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm xl:sticky xl:top-24">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">{editingProductId === null ? 'Catalog' : `Editing #${editingProductId}`}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">{editingProductId === null ? 'Add a product' : 'Edit product'}</h2>
            </div>
            {editingProductId !== null && (
              <button
                type="button"
                onClick={() => { setEditingProductId(null); setProductForm(emptyProduct); }}
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Cancel edit
              </button>
            )}
          </div>
          <input required maxLength="200" aria-label="Product name" placeholder="Product name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <textarea maxLength="1000" aria-label="Product description" placeholder="Description" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" rows="3" />
          <input required aria-label="Category" placeholder="Category" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm text-slate-600">Price
              <input required type="number" min="0.01" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
            </label>
            <label className="space-y-1 text-sm text-slate-600">Stock
              <input required type="number" min="0" step="1" value={productForm.stockQuantity} onChange={(event) => setProductForm({ ...productForm, stockQuantity: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
            </label>
            <label className="col-span-2 space-y-1 text-sm text-slate-600">Discount (%)
              <input required type="number" min="0" max="100" step="1" value={productForm.discount} onChange={(event) => setProductForm({ ...productForm, discount: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
            </label>
          </div>
          <button disabled={saving} className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 font-semibold text-white shadow-sm shadow-sky-900/15 transition hover:from-sky-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Saving...' : editingProductId === null ? 'Create product' : 'Save changes'}
          </button>
        </form>
      </section>

      <section id="admin-orders" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Orders</h2>
            <p className="mt-1 text-sm text-slate-500">{orders.length} total orders</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input aria-label="Search orders" value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Search order or customer" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:w-56" />
            </label>
            <select aria-label="Filter orders by status" value={orderStatusFilter} onChange={(event) => setOrderStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
              <option value="">All statuses</option>
              {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const status = order.status || 'Placed';
                const availableStatuses = [status, ...(nextOrderStatuses[status] || [])];
                const canUpdate = availableStatuses.length > 1;
                return (
                <tr key={order.id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-3.5 font-semibold text-sky-700">#{order.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-800">{order.customerName || `User ${order.userId}`}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{order.items?.length || 0} line items</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{formatPrice(order.grandTotal)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status] || 'border-slate-200 bg-slate-50 text-slate-600'}`}>{status}</span>
                      <select
                        aria-label={`Update order ${order.id} status`}
                        value={status}
                        disabled={!canUpdate || updatingOrderId !== null}
                        onChange={(event) => changeOrderStatus(order.id, event.target.value)}
                        className="max-w-36 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                      >
                        {availableStatuses.map((availableStatus) => (
                          <option key={availableStatus} value={availableStatus}>{availableStatus}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-500">{orders.length ? 'No orders match these filters.' : 'No orders yet.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section id="admin-users" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Users and admin access</h2>
            <p className="mt-1 text-sm text-slate-500">{users.length} registered users</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input aria-label="Search users" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search name or email" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{user.name}</td>
                  <td className="px-4 py-3.5 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${user.isAdmin ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'}`}>
                      {user.isAdmin && <ShieldCheck className="h-3.5 w-3.5" />}
                      {user.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => changeUserRole(user, !user.isAdmin)}
                      disabled={updatingUserId !== null}
                      className="font-semibold text-sky-700 hover:underline disabled:cursor-wait disabled:opacity-50"
                    >
                      {updatingUserId === user.id ? 'Updating...' : user.isAdmin ? 'Revoke admin' : 'Grant admin'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan="4" className="px-4 py-10 text-center text-slate-500">No matching users.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Admin;
