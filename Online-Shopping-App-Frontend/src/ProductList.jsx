import { useEffect, useState } from 'react';
import { addToWishlist, getProducts, getWishlist, removeFromWishlist } from './api';
import ProductCard from './ProductCard';

const ProductList = ({ onAddToCart, refreshToken = 0 }) => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const [response, wishlistResponse] = await Promise.all([
          getProducts(),
          getWishlist(),
        ]);
        setProducts(response.data);
        setWishlistIds(wishlistResponse.data.map((product) => product.id));
      } catch (err) {
        setError('Unable to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [refreshToken]);

  const toggleWishlist = async (product) => {
    const isWishlisted = wishlistIds.includes(product.id);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setWishlistIds((ids) => ids.filter((id) => id !== product.id));
      } else {
        await addToWishlist(product.id);
        setWishlistIds((ids) => [...ids, product.id]);
      }
    } catch (err) {
      setError('Unable to update your wishlist.');
    }
  };

  if (loading) return <p className="text-slate-600">Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];
  const filteredProducts = products.filter((product) => {
    const searchText = `${product.name} ${product.description}`.toLowerCase();
    return searchText.includes(search.toLowerCase())
      && (!category || product.category === category)
      && (minPrice === '' || product.price >= Number(minPrice))
      && (maxPrice === '' || product.price <= Number(maxPrice));
  });

  return (
    <section className="space-y-5">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          aria-label="Search products"
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Search products"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          aria-label="Filter by category"
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input
          aria-label="Minimum price"
          type="number"
          min="0"
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Min price"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
        />
        <input
          aria-label="Maximum price"
          type="number"
          min="0"
          className="rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Max price"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />
      </div>
      {filteredProducts.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-6 text-center text-slate-500">No products match those filters.</p>
      )}
    </section>
  );
};

export default ProductList;
