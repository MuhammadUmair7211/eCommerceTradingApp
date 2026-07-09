import { useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { imageUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";
import BackButton from "../../components/user/BackButton";

function RechargeHistory() {
  const { recharges } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);

  const statusUI = {
    pending: (
      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
        <Clock size={12} />
        Pending
      </span>
    ),
    approved: (
      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
        <CheckCircle size={12} />
        Approved
      </span>
    ),
    rejected: (
      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
        <XCircle size={12} />
        Rejected
      </span>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl  mx-auto">
        <BackButton />
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Recharge/TopUp History
        </h1>

        {/* Empty state */}
        {recharges.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 text-center">
            <Clock size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-slate-700">No Recharge History</p>
            <p className="text-sm text-gray-500 mt-1">
              Your submitted deposits will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {recharges.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition p-4"
              >
                {/* Screenshot */}
                {p.screenshot && (
                  <img
                    src={`${imageUrl}/${p.screenshot}`}
                    onClick={() =>
                      setSelectedImage(`${imageUrl}/${p.screenshot}`)
                    }
                    className="w-full h-40 object-cover cursor-pointer hover:scale-105 duration-300"
                    alt="Payment Proof"
                  />
                )}

                {/* Header */}
                <div className="flex justify-between items-center mt-3">
                  <h3 className="font-bold text-lg">${p.amount} USDT</h3>

                  {statusUI[p.status] || statusUI.pending}
                </div>

                {/* Details */}
                <div className="mt-3 space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">
                      Transaction
                    </span>
                    <p className="break-all text-gray-700">{p.transactionId}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-600">Wallet</span>
                    <p className="break-all text-gray-700">{p.walletAddress}</p>
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-red-400"
            >
              ✕
            </button>

            <img
              src={selectedImage}
              alt="Payment Proof"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RechargeHistory;
