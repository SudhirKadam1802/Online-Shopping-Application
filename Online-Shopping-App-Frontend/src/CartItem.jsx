const CartItem = ({ item, onUpdateQty, onRemove }) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-purple-300 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-xl sm:flex-row sm:items-center">
      
      {/* Product Details */}
      <div>
        <h3 className="text-lg font-bold text-gray-800">
          {item.product.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {item.product.description}
        </p>

        <div className="mt-3 flex items-center gap-6">
          <p className="text-lg font-semibold text-purple-600">
            ₹{item.price}
          </p>

          <p className="text-sm text-gray-600">
            Qty: <span className="font-semibold">{item.quantity}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-300 bg-purple-100 text-xl font-bold text-purple-700 transition hover:bg-purple-600 hover:text-white"
        >
          −
        </button>

        <span className="w-8 text-center text-lg font-bold text-gray-800">
          {item.quantity}
        </span>

        <button
          onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-300 bg-purple-100 text-xl font-bold text-purple-700 transition hover:bg-purple-600 hover:text-white"
        >
          +
        </button>

        <button
          onClick={() => onRemove(item.productId)}
          className="ml-3 rounded-lg border border-red-600 bg-red-500 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg"
        >
          🗑 Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;