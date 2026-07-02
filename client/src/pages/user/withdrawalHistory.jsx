import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useEffect } from "react";

function WithdrawalHistory() {
  const { withdrawals, fetchUserProfile } = useApp();

  useEffect(() => {
    fetchUserProfile();
  }, []);
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
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Withdrawal History
        </h1>

        {/* Empty state */}
        {withdrawals.length === 0 ? (
          <div className="text-center py-20 bg-white shadow-lg">
            <p className="text-gray-500">No withdrawals found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((w) => (
              <div
                key={w._id}
                className="bg-white shadow-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition"
              >
                {/* LEFT */}
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">
                    {w.transactionId || "WITHDRAWAL TX"}
                  </p>

                  <p className="text-sm text-gray-600">
                    Amount:{" "}
                    <span className="font-semibold text-black">
                      ${w.amount} USDT
                    </span>
                  </p>

                  {/* WALLET ADDRESS */}
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      Wallet Address:
                    </span>

                    <span className="break-all">
                      {w.walletAddress || "N/A"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">
                    created At: {new Date(w.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-2">
                  {statusUI[w.status] || statusUI.pending}

                  {w.status === "pending" && (
                    <p className="text-xs text-yellow-600">
                      Waiting for admin approval
                    </p>
                  )}

                  {w.status === "approved" && (
                    <p className="text-xs text-green-600">
                      Withdrawal has been approved
                    </p>
                  )}

                  {w.status === "rejected" && (
                    <p className="text-xs text-red-600">
                      Withdrawal request was rejected
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WithdrawalHistory;
