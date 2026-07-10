import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, Clock, Wallet, XCircle } from "lucide-react";
import { baseUrl } from "../../../config/config";
import Pagination from "./components/Pagination";
import { useApp } from "../../context/AppContext";
import BackButton from "./components/BackButton";

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
    <div className="p-4 bg-slate-800 min-h-screen text-slate-300">
      <BackButton />
      <h1 className="text-xl font-bold text-white mb-4">Withdrawal History</h1>

      <div className="border border-slate-700 overflow-x-auto">
        <table className="min-w-full text-sm cursor-pointer">
          {/* HEADER */}
          <thead className="border border-slate-700">
            <tr className="align-middle hover:bg-slate-900 duration-300">
              <th className="p-4 text-left border border-slate-700">Details</th>
              <th className="p-4 text-center border border-slate-700">
                Amount
              </th>
              <th className="p-4 text-center border border-slate-700">
                Status
              </th>
              <th className="p-4 text-center border border-slate-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500"></div>
                    <p className="text-sm text-slate-400 font-medium">
                      Loading data...
                    </p>
                  </div>
                </td>
              </tr>
            ) : allWithdrawals.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-14">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-800">
                      <Wallet size={30} className="text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-slate-300">
                      No Withdrawal Records
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      There are no withdrawal requests to display.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedWithdrawals.map((w) => (
                <tr
                  key={w._id}
                  className="border border-slate-700 align-middle hover:bg-slate-900 duration-300"
                >
                  {/* DETAILS */}
                  <td className="p-2 border border-slate-700">
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
                  <td className="p-2 text-red-500 text-center border border-slate-700">
                    ${w.amount}
                  </td>

                  {/* STATUS */}
                  <td className="p-2 text-center border border-slate-700">
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
                  <td className="p-2 border border-slate-700">
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
