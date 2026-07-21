import { useState } from 'react';
import { createProduct } from './api';

const AddProduct = ({ onProductAdded }) => {
  const [form, setForm] = useState({ name: '', description: '', price: '', stockQuantity: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      };
      await createProduct(payload);
      setMessage('Product added successfully.');
      setForm({ name: '', description: '', price: '', stockQuantity: '' });
      onProductAdded();
    } catch (err) {
      setMessage('Unable to add product.');
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">Add a product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm outline-none"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm outline-none"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm outline-none"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm outline-none"
            placeholder="Stock"
            type="number"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
            required
          />
        </div>
        <button className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-white hover:bg-cyan-600">
          Save product
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-cyan-300">{message}</p>}
    </div>
  );
};

export default AddProduct;
