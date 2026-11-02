const ProductCard = ({ product, onAddToCart, isCartReady = true, isWishlisted, onToggleWishlist }) => {
  return (
    <div className="rounded-2xl border-2 border-purple-300 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              ₹{product.price}
            </span>
            {Number(product.discount) > 0 && (
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                {product.discount}% OFF
              </span>
            )}
          </div>
          {onToggleWishlist && (
            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isWishlisted}
              className="rounded-full px-2 py-1 text-xl text-rose-600 hover:bg-rose-50"
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-600">
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          Stock: {product.stockQuantity}
        </span>

        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stockQuantity <= 0 || !isCartReady}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.stockQuantity <= 0 ? "Out of stock" : isCartReady ? "Add to Cart" : "Preparing cart..."}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;