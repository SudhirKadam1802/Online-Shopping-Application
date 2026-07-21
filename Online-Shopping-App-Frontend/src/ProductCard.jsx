const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="rounded-2xl border-2 border-purple-300 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          {product.name}
        </h3>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          ₹{product.price}
        </span>
      </div>

      <p className="mb-4 text-sm text-slate-600">
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          Stock: {product.stockQuantity}
        </span>

        <button
          onClick={() => onAddToCart(product)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;