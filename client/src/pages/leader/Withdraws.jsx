import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { baseUrl } from "../../../config/config";
import Pagination from "./components/Pagination";
import { useApp } from "../../context/AppContext";

function Withdraws() {
  const { allWithdrawals, loading, getLeaderData } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allWithdrawals.length / itemsPerPage);

  const paginatedWithdrawals = allWithdrawals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const updateWithdrawStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(
        `${baseUrl}/withdrawals/update-status/${id}`,
        { status },
      );

      if (data.success) {
        toast.success(data.message);
        getLeaderData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-900 min-h-screen text-slate-300">
      <h1 className="text-xl font-bold text-white mb-4">Withdrawal History</h1>

      <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
        <table className="min-w-full text-sm">
          {/* HEADER */}
          <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
            <tr>
              <th className="p-3 text-left">Details</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : allWithdrawals.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  No withdrawal records found
                </td>
              </tr>
            ) : (
              paginatedWithdrawals.map((w) => (
                <tr
                  key={w._id}
                  className="border-b border-slate-800 hover:bg-slate-800/60 transition"
                >
                  {/* DETAILS */}
                  <td className="p-3">
                    <div className="text-white font-medium">
                      User: {w.userId?.username || "N/A"}
                    </div>

                    <div className="text-slate-400">
                      Admin: {w.adminId?.username || "N/A"}
                    </div>

                    <div className="text-xs text-slate-500 break-all">
                      Wallet: {w.walletAddress}
                    </div>

                    <div className="text-xs text-slate-500">
                      {new Date(w.createdAt).toLocaleString()}
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3 font-semibold text-red-400">
                    ${w.amount}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        w.status === "approved"
                          ? "bg-green-500/10 text-green-400"
                          : w.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {w.status === "approved" && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}

                      {w.status === "rejected" && (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}

                      {w.status === "pending" && (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}

                      <select
                        value={w.status}
                        disabled={w.status !== "pending"}
                        onChange={(e) =>
                          updateWithdrawStatus(w._id, e.target.value)
                        }
                        className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded text-xs cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={allWithdrawals.length}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default Withdraws;
