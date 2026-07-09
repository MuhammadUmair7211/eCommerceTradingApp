import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useEffect } from "react";
import BackButton from "../../components/user/BackButton";

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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <BackButton />
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Withdrawal History
        </h1>

        {/* Empty state */}
        {withdrawals.length === 0 ? (
          <div className="bg-white border border-slate-300 p-12 text-center">
            <Clock size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-slate-700">
              No Withdrawal History
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Your withdrawal requests will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {withdrawals.map((w) => (
              <div
                key={w._id}
                className="bg-white cursor-pointer border border-slate-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-100 uppercase tracking-wider">
                      Withdrawal
                    </p>

                    <h3 className="text-2xl font-bold text-white">
                      ${w.amount}
                      <span className="text-sm font-medium ml-1">USDT</span>
                    </h3>
                  </div>

                  {statusUI[w.status] || statusUI.pending}
                </div>

                <div className="p-4 space-y-4">
                  {/* Transaction */}
                  <div className="bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
                      Transaction ID
                    </p>

                    <p className="text-sm text-slate-700 break-all">
                      {w.transactionId || "WITHDRAWAL TX"}
                    </p>
                  </div>
                  {/* Wallet */}
                  <div className="bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs font-semibold text-green-600 uppercase mb-1">
                      Wallet Address
                    </p>

                    <p className="text-sm text-slate-700 break-all font-mono">
                      {w.walletAddress || "N/A"}
                    </p>
                  </div>{" "}
                  <span className="text-xs text-slate-400">#{w._id}</span>
                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-300 pt-3">
                    <span className="text-xs text-slate-500">
                      {new Date(w.createdAt).toLocaleString()}
                    </span>
                  </div>
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
