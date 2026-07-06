import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Clock, XCircle, CheckCircle } from "lucide-react";
import Pagination from "../../components/admin/Pagination";
import SearchBar from "../../components/admin/SearchBar";
import PageHeader from "../../components/admin/PageHeader";
import axios from "axios";
import { baseUrl, imageUrl } from "../../../config/config";

function RechargeHistoryPage() {
  const [loading, setLoading] = useState(false);
  const [recharges, setRecharges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const itemsPerPage = 5;

  // Fetch Recharges
  const fetchAllAdminRecharges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("Admin token missing");
        return;
      }

      const { data } = await axios.get(`${baseUrl}/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.success) {
        setRecharges(data.payments || []);
      }
    } catch (error) {
      console.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchAllAdminRecharges, 0);
    return () => clearTimeout(timer);
  }, []);

  // Search Filter
  const filteredRecords = useMemo(() => {
    return recharges.filter((record) => {
      const search = searchTerm.toLowerCase();

      return (
        record?.user?.username?.toLowerCase()?.includes(search) ||
        record?.transactionId?.toLowerCase()?.includes(search) ||
        record?.walletAddress?.toLowerCase()?.includes(search) ||
        record?.status?.toLowerCase()?.includes(search) ||
        String(record?.amount || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [recharges, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;

  const paginatedRecords = filteredRecords?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
            <CheckCircle size={14} />
            Approved
          </span>
        );

      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
            <XCircle size={14} />
            Rejected
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
            <Clock size={14} />
            Pending
          </span>
        );
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-10 text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-500">Loading recharge history...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border border-slate-700 overflow-hidden p-2">
        {/* Header */}
        <PageHeader
          heading="Recharge History"
          subheading="View all recharge transactions"
        />

        {/* Search */}
        <div className="flex items-center justify-center">
          <span className="text-sm">
            total records: {filteredRecords.length}
          </span>
          <SearchBar
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-450">
            <thead className="border border-gray-700">
              <tr className="hover:bg-slate-800 duration-300">
                <th className="w-[55%] px-6 py-4 text-left font-semibold">
                  Details
                </th>

                <th className="w-[20%] px-6 py-4 text-center font-semibold">
                  Screenshot
                </th>

                <th className="w-[25%] px-6 py-4 text-right font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedRecords?.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-slate-700 hover:bg-gray-800 duration-300 align-middle"
                >
                  {/* Details */}
                  <td className="p-4">
                    <div className="space-y-4">
                      {/* User */}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-base">
                          Username: {p.user?.username || "N/A"}
                        </h3>

                        <p className="text-xs">User ID: {p.user?._id}</p>
                      </div>

                      {/* Admin & Amount */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 text-xs font-medium rounded">
                          Admin: {p.adminId?.username || "No admin available"}
                        </span>

                        <span className="px-3 py-1 text-xs font-semibold rounded">
                          Amount: ${Number(p.amount || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Transaction */}
                      <div className="space-y-2">
                        <p className="text-sm break-all">
                          <span className="font-medium">Transaction:</span>{" "}
                          {p.transactionId}
                        </p>

                        <p className="text-sm break-all">
                          <span className="font-medium">Wallet:</span>{" "}
                          {p.walletAddress}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs">
                        <span>🕒</span>
                        <span>{new Date(p.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </td>

                  {/* Screenshot */}
                  <td className="p-4">
                    <div className="flex justify-center">
                      {p.screenshot ? (
                        <img
                          src={`${imageUrl}/${p.screenshot}`}
                          alt="Payment Screenshot"
                          onClick={() =>
                            setSelectedVoucher(`${imageUrl}/${p.screenshot}`)
                          }
                          className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5 text-right align-middle">
                    {getStatusBadge(p.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedRecords.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              <AlertCircle className="mx-auto mb-2" />
              No recharge records found
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredRecords.length > 0 && (
          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Voucher Modal */}
        {selectedVoucher && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-4 max-w-4xl w-full mx-4">
              <div className="relative flex items-center justify-center mb-4">
                <h2 className="text-lg font-bold">Screenshot Preview</h2>

                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="absolute right-0 px-4 py-1 rounded text-red-500 font-semibold hover:bg-red-600 hover:text-white transition"
                >
                  Close
                </button>
              </div>

              <img
                src={selectedVoucher}
                alt="Payment Screenshot"
                className="w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RechargeHistoryPage;
