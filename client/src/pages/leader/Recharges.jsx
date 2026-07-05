import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { baseUrl, imageUrl } from "../../../config/config";

function Recharges() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    let isMounted = true;

    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/payments/all-payments`);

        if (isMounted) {
          setPayments(data?.payments || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchPayments();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(
        `${baseUrl}/payments/update-status/${id}`,
        { status },
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-900 text-slate-300 min-h-screen">
      <h1 className="text-xl font-bold text-white mb-4">Recharge History</h1>

      <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
        <table className="min-w-full text-sm">
          {/* HEADER */}
          <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
            <tr>
              <th className="p-3 text-left">Details</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Screenshot</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-500">
                  No payment records found
                </td>
              </tr>
            ) : (
              paginatedPayments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-slate-800 hover:bg-slate-800/60 transition"
                >
                  {/* DETAILS */}
                  <td className="p-3">
                    <div className="text-white font-medium">
                      username: {p.user?.username}
                    </div>

                    <div className="text-slate-400">
                      admin: {p.adminId?.username || "N/A"}
                    </div>

                    <div className="text-xs text-slate-500 break-all">
                      TX: {p.transactionId}
                    </div>

                    <div className="text-xs text-slate-500 break-all">
                      wallet: {p.walletAddress}
                    </div>

                    <div className="text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3 font-semibold text-green-400">
                    ${p.amount}
                  </td>

                  {/* SCREENSHOT */}
                  <td className="p-3">
                    {p.screenshot ? (
                      <img
                        src={`${imageUrl}/${p.screenshot}`}
                        onClick={() =>
                          setSelectedImage(`${imageUrl}/${p.screenshot}`)
                        }
                        className="w-12 h-12 object-cover rounded cursor-pointer border border-slate-700 hover:scale-110 transition"
                      />
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        p.status === "approved"
                          ? "bg-green-500/10 text-green-400"
                          : p.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-3 text-center">
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
      {payments.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-slate-300">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded border border-slate-700 ${
                  currentPage === i + 1
                    ? "bg-slate-700 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

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
