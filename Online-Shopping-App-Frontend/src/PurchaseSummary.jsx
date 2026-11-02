const PurchaseSummary = ({ summary }) => {
  if (!summary) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-400 hover:shadow-lg">

        <h3 className="mb-4 text-xl font-bold text-gray-900">
          🛒 Purchase Summary
        </h3>

        <div className="rounded-xl bg-gray-50 px-4 py-8 text-center">
          <div className="mb-3 text-4xl">🛍️</div>

          <p className="font-semibold text-gray-700">
            No summary available
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Add products to your cart to see your purchase summary.
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-400 hover:shadow-lg">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            🛒 Purchase Summary
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Your order breakdown
          </p>
        </div>

        <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-800">
          ORDER
        </span>
      </div>

      {/* Summary Details */}
      <div className="space-y-4">

        {/* Items */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100">
          <span className="font-medium text-gray-700">
            📦 Items
          </span>

          <span className="rounded-lg bg-gray-200 px-3 py-1 font-bold text-gray-900">
            {summary.items?.length || 0}
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100">
          <span className="font-medium text-gray-700">
            💰 Subtotal
          </span>

          <span className="font-bold text-gray-900">
            ₹{summary.subtotal}
          </span>
        </div>

        {/* Discount */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100">
          <span className="font-medium text-gray-700">
            🎁 Discount
          </span>

          <span className="font-bold text-gray-900">
            ₹{summary.discountAmount}
          </span>
        </div>

        {/* Grand Total */}
        <div className="border-t border-gray-200 pt-5">

          <div className="rounded-xl bg-gradient-to-r from-black via-gray-900 to-zinc-800 p-5 text-white shadow-lg">

            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Total Amount
            </p>

            <div className="flex items-center justify-between gap-2">
              <span className="text-lg font-bold">
                Grand Total
              </span>

              <span className="text-2xl font-extrabold tracking-tight">
                ₹{summary.grandTotal}
              </span>
            </div>

            <div className="mt-4 border-t border-white/20 pt-3">
              <p className="text-xs text-gray-400">
                Thank you for shopping with us!
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PurchaseSummary;