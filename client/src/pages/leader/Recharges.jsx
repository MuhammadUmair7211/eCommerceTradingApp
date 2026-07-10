import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, Clock, CreditCard, XCircle } from "lucide-react";
import { baseUrl, imageUrl } from "../../../config/config";
import Pagination from "./components/Pagination";
import { useApp } from "../../context/AppContext";
import BackButton from "./components/BackButton";

function Recharges() {
  const { allPayments, loading, getLeaderData } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(allPayments.length / itemsPerPage);

  const paginatedPayments = allPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(
        `${baseUrl}/payments/update-status/${id}`,
        { status },
      );

      if (data.success) {
        toast.success(data.message);
        getLeaderData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 bg-slate-800 text-slate-300 min-h-screen">
      <BackButton />
      <h1 className="text-xl font-bold text-white mb-2">Recharge History</h1>

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
                Screenshot
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
            ) : allPayments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                      <CreditCard size={28} className="text-slate-400" />
                    </div>

                    <h3 className="text-base font-semibold text-slate-300">
                      No Payment Records
                    </h3>

                    <p className="text-sm text-slate-500">
                      There are no payment records available.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedPayments.map((p) => (
                <tr
                  key={p._id}
                  className="border border-slate-700 align-middle hover:bg-slate-900 duration-300"
                >
                  {/* DETAILS */}
                  <td className="p-2 border border-slate-700 align-top">
                    <div className="space-y-2 text-sm">
                      {/* Username & Admin */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-xs">Username</p>
                          <p className="font-semibold text-white">
                            {p.user?.username || "N/A"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-slate-400 text-xs">Admin</p>
                          <p className="font-medium text-cyan-400">
                            {p.adminId?.username || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Transaction ID */}
                      <div>
                        <p className="text-slate-400 text-xs">Transaction ID</p>
                        <p className="font-mono text-xs text-slate-300 break-all">
                          {p.transactionId}
                        </p>
                      </div>

                      {/* Wallet */}
                      <div>
                        <p className="text-slate-400 text-xs">Wallet Address</p>
                        <p className="font-mono text-xs text-slate-300 break-all">
                          {p.walletAddress}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <span className="text-xs text-slate-500">
                          {new Date(p.createdAt).toLocaleString()}
                        </span>

                        {p.status === "approved" && (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                            <CheckCircle size={14} />
                            Approved
                          </span>
                        )}

                        {p.status === "rejected" && (
                          <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
                            <XCircle size={14} />
                            Rejected
                          </span>
                        )}

                        {p.status === "pending" && (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400">
                            <Clock size={14} />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="text-xs text-center text-green-500 font-semibold leading-7 border border-slate-700">
                    ${p.amount}
                  </td>

                  {/* SCREENSHOT */}
                  <td className="border border-slate-700">
                    <div className="flex items-center justify-center">
                      {p.screenshot ? (
                        <img
                          src={`${imageUrl}/${p.screenshot}`}
                          alt="Payment Screenshot"
                          onClick={() =>
                            setSelectedImage(`${imageUrl}/${p.screenshot}`)
                          }
                          className="h-30 w-60 object-cover border border-slate-600 shadow-md cursor-pointer transition-all duration-300 hover:scale-110 hover:border-cyan-500"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center border border-dashed border-slate-700 bg-slate-800 text-slate-500 text-xs">
                          N/A
                        </div>
                      )}
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="p-2 text-xs font-semibold leading-7 border border-slate-700">
                    <div className="flex items-center justify-center gap-2">
                      {p.status === "approved" && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}

                      {p.status === "rejected" && (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}

                      {p.status === "pending" && (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}

                      <select
                        value={p.status}
                        disabled={p.status !== "pending"}
                        onChange={(e) => updateStatus(p._id, e.target.value)}
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
        totalItems={allPayments.length}
        setCurrentPage={setCurrentPage}
      />

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-slate-900 border border-slate-700 p-2 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full"
            >
              ✕
            </button>

            <img
              src={selectedImage}
              className="max-w-[60vw] max-h-[70vh] rounded"
              alt="preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Recharges;
