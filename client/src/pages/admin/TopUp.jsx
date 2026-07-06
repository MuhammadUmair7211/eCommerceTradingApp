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
    fetchAllAdminRecharges();
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

  const paginatedRecords = filteredRecords.slice(
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
      <div className="rounded-xl p-10 text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-500">Loading recharge history...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-slate-900 text-slate-300 border border-slate-700 overflow-hidden p-2">
        {/* Header */}
        <PageHeader
          heading="Recharge History"
          subheading="View all recharge transactions"
        />

        {/* Search */}
        <div className="flex items-center justify-center">
          <span className="text-sm text-gray-500">
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
          <table className="w-full min-w-450 cursor-pointer">
            <thead className="border border-slate-700">
              <tr className="align-top hover:bg-slate-800 duration-300">
                <th className="px-4 py-3 text-left">Details</th>
                <th className="px-4 py-3 text-left">Screenshot</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedRecords.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-slate-700 align-center hover:bg-gray-800 duration-300"
                >
                  <td className="p-4">
                    <div className="space-y-3">
                      {/* User */}
                      <div>
                        <h3 className="font-semibold text-base">
                          username : {p.user?.username || "N/A"}
                        </h3>

                        <p className="text-xs">user id : {p.user?._id}</p>
                      </div>

                      {/* Admin & Amount */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-slate-700 font-medium">
                          admin: {p.adminId?.username || "no admin available"}
                        </span>

                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 font-semibold">
                          amount: ${Number(p.amount || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Transaction Card */}
                      <div className="max-w-lg w-full border border-slate-700 rounded-lg p-3 space-y-2 shadow-sm">
                        {/* Transaction ID */}
                        <div>
                          <p className="text-[11px] uppercase tracking-wide">
                            Transaction ID
                          </p>
                          <p className="text-xs font-medium break-all">
                            {p.transactionId}
                          </p>
                        </div>

                        {/* Wallet Address */}
                        <div>
                          <p className="text-[11px] uppercase tracking-wide">
                            Wallet Address
                          </p>
                          <p className="text-xs break-all rounded-md">
                            {p.walletAddress}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-700">
                          <span className="text-[11px]">Created</span>
                          <span className="text-xs flex items-center gap-1">
                            🕒 {new Date(p.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Screenshot */}
                  <td className="p-3">
                    {p.screenshot ? (
                      <img
                        src={`${imageUrl}/${p.screenshot}`}
                        alt="Payment Screenshot"
                        onClick={() =>
                          setSelectedVoucher(`${imageUrl}/${p.screenshot}`)
                        }
                        className="w-14 h-14 object-cover rounded-lg border cursor-pointer hover:scale-110 transition"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3">{getStatusBadge(p.status)}</td>
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
