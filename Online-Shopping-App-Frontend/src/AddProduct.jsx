import { useState } from 'react';
import { createProduct } from './api';

const AddProduct = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '0',
    stockQuantity: '',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        discount: Number(form.discount),
        stockQuantity: Number(form.stockQuantity),
      };
      await createProduct(payload);
      setMessage('Product added successfully.');
      setForm({ name: '', description: '', category: '', price: '', discount: '0', stockQuantity: '' });
      onProductAdded();
    } catch (err) {
      setMessage('Unable to add product.');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] p-6 text-white shadow-xl shadow-black/20 ring-1 ring-sky-200/10 before:absolute before:-right-12 before:-top-16 before:size-40 before:rounded-full before:bg-sky-500/15 before:blur-2xl">
      <h2 className="relative mb-5 text-xl font-bold tracking-tight">Add a product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded-lg border border-gray-600/70 bg-gray-800/80 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          className="w-full rounded-lg border border-gray-600/70 bg-gray-800/80 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          className="w-full rounded-lg border border-gray-600/70 bg-gray-800/80 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-lg border border-gray-600/70 bg-gray-800/80 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            placeholder="Price"
            type="number"
            min="1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border border-gray-600/70 bg-gray-800/80 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border border-gray-600/70 bg-gray-800/80 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            placeholder="Discount (%)"
            type="number"
            min="0"
            max="100"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
          />
        </div>
        <button className="rounded-lg border border-sky-400/20 bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-900/15 transition hover:-translate-y-0.5 hover:from-sky-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-[#242424]">
          Save product
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-sky-200">{message}</p>}
    </div>
  );
};

export default AddProduct;
