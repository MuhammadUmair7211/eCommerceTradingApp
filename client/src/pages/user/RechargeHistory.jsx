import { useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { baseUrl, imageUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";
import BackButton from "../../components/user/BackButton";

function RechargeHistory() {
  const { recharges } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);

  const statusUI = {
    pending: (
      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
        <Clock size={14} /> Pending
      </span>
    ),
    approved: (
      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
        <CheckCircle size={14} /> Approved
      </span>
    ),
    rejected: (
      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
        <XCircle size={14} /> Rejected
      </span>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-450 mx-auto">
        <BackButton />
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Recharge/TopUp History
        </h1>

        {/* Empty state */}
        {recharges.length === 0 ? (
          <div className="text-center py-20 bg-white shadow-lg">
            <p className="text-gray-500">No recharges found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recharges.map((p) => {
              return (
                <div
                  key={p._id}
                  className="bg-white shadow-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition"
                >
                  {/* LEFT */}
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800">
                      {p.transactionId}
                    </p>

                    <p className="text-sm text-gray-600">
                      Amount:{" "}
                      <span className="font-semibold text-black">
                        ${p.amount} USDT
                      </span>
                    </p>

                    {/* WALLET ADDRESS */}
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="font-medium text-gray-700">Wallet:</span>

                      <span className="break-all">
                        {p.walletAddress || "N/A"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* IMAGE */}
                  {p.screenshot && (
                    <img
                      src={`${imageUrl}/${p.screenshot}`}
                      onClick={() =>
                        setSelectedImage(`${imageUrl}/${p.screenshot}`)
                      }
                      className="w-30 h-20 object-cover border border-gray-300 hover:scale-105 duration-300 cursor-pointer"
                    />
                  )}

                  {/* RIGHT */}
                  <div className="flex flex-col items-end gap-2">
                    {statusUI[p.status] || statusUI.pending}

                    {p.status === "pending" && (
                      <p className="text-xs text-yellow-600">
                        Waiting for transaction approval
                      </p>
                    )}

                    {p.status === "approved" && (
                      <p className="text-xs text-green-600">
                        Recharge has been approved
                      </p>
                    )}

                    {p.status === "rejected" && (
                      <p className="text-xs text-red-600">
                        Withdrawal request was rejected
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white p-3 rounded-lg max-w-3xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-gray-600 hover:scale-110 duration-300 cursor-pointer"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              className="w-full max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RechargeHistory;
