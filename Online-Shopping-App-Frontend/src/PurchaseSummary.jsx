const PurchaseSummary = ({ summary }) => {
  if (!summary) {
    return (
      <div className="rounded-2xl border-2 border-purple-300 bg-white p-6 shadow-md transition-all duration-300 hover:border-purple-500 hover:shadow-xl">
        <h3 className="mb-4 text-xl font-bold text-slate-800">
          Purchase Summary
        </h3>

        <p className="py-8 text-center text-slate-500">
          No summary available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-purple-300 bg-white p-6 shadow-md transition-all duration-300 hover:border-purple-500 hover:shadow-xl">
      <h3 className="mb-6 text-xl font-bold text-slate-800">
        🛒 Purchase Summary
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
          <span className="font-medium text-slate-700">
            📦 Items
          </span>

          <span className="font-bold">
            {summary.items?.length || 0}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
          <span className="font-medium text-slate-700">
            💰 Subtotal
          </span>

          <span className="font-bold text-green-600">
            ₹{summary.subtotal}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
          <span className="font-medium text-slate-700">
            🎁 Discount
          </span>

          <span className="font-bold text-orange-600">
            ₹{summary.discountAmount}
          </span>
        </div>

        <div className="border-t border-purple-200 pt-4">
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-4 text-white shadow-md">
            <span className="text-lg font-bold">
              Grand Total
            </span>

            <span className="text-2xl font-extrabold">
              ₹{summary.grandTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;