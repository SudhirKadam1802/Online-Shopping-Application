import { useEffect, useState } from 'react';
import { removeFromWishlist, getWishlist } from '../api';
import ProductCard from '../ProductCard';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const loadWishlist = async () => {
    try {
      const response = await getWishlist();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Unable to load your wishlist. Please try again.');
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeProduct = async (product) => {
    try {
      await removeFromWishlist(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (err) {
      setError('Unable to update your wishlist. Please try again.');
    }
  };

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-bold text-slate-800">Your wishlist</h1>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      {products.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted
              onToggleWishlist={removeProduct}
            />
          ))}
        </div>
      ) : !error ? (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500">Your wishlist is empty.</p>
      ) : null}
    </section>
  );
};

export default Wishlist;
