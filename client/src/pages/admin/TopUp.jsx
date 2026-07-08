import { useMemo, useState } from "react";
import { AlertCircle, Clock, XCircle, CheckCircle, Users } from "lucide-react";
import Pagination from "../../components/admin/Pagination";
import SearchBar from "../../components/admin/SearchBar";
import PageHeader from "../../components/admin/PageHeader";
import { imageUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";

function RechargeHistoryPage() {
  const { adminPayments, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const itemsPerPage = 5;
  // Search Filter
  const filteredRecords = useMemo(() => {
    return adminPayments.filter((record) => {
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
  }, [adminPayments, searchTerm]);

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
      <div className="bg-slate-800 text-slate-300 border border-slate-700 overflow-hidden p-2">
        {/* Header */}
        <PageHeader
          heading="Recharge History"
          subheading="View all recharge transactions"
        />

        {/* search + filter records length */}
        <div className="mt-4 flex flex-col gap-4 border border-slate-700 bg-slate-800 p-4 lg:flex-row lg:items-center">
          {/* Total records */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-cyan-500/10 text-cyan-400">
              <Users size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Total Records
              </p>
              <p className="text-lg font-semibold text-white">
                {filteredRecords.length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full min-w-450 cursor-pointer">
            <thead className="border border-slate-700">
              <tr className="align-center hover:bg-slate-900 duration-300">
                <th className="p-4 text-left border border-slate-700">
                  Details
                </th>
                <th className="p-4 text-center border border-slate-700">
                  Screenshot
                </th>
                <th className="p-4 text-center border border-slate-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedRecords.map((p) => (
                <tr
                  key={p._id}
                  className="border border-slate-700 align-top hover:bg-gray-900 duration-300"
                >
                  <td className="p-2 text-xs font-semibold leading-7 border border-slate-700">
                    <div className="space-y-4">
                      {/* User & Admin */}
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {p.user?.username || "N/A"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500 break-all">
                            User ID: {p.user?._id}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                            Admin: {p.adminId?.username || "Not Assigned"}
                          </span>

                          <span className="border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                            ${Number(p.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Transaction Details */}
                      <div className="border border-slate-700 bg-slate-900">
                        <div className="grid gap-4 p-4 md:grid-cols-2">
                          <div>
                            <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                              Transaction ID
                            </p>

                            <p className="break-all text-sm text-slate-300">
                              {p.transactionId}
                            </p>
                          </div>

                          <div>
                            <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                              Wallet Address
                            </p>

                            <p className="break-all text-sm text-slate-300">
                              {p.walletAddress}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-700 bg-slate-800 px-4 py-3">
                          <span className="text-xs uppercase tracking-widest text-slate-500">
                            Created
                          </span>

                          <span className="text-sm text-slate-300">
                            {new Date(p.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Screenshot */}
                  <td className="p-2 text-xs text-center align-middle font-semibold leading-7 border border-slate-700">
                    {p.screenshot ? (
                      <img
                        src={`${imageUrl}/${p.screenshot}`}
                        alt="Payment Screenshot"
                        onClick={() =>
                          setSelectedVoucher(`${imageUrl}/${p.screenshot}`)
                        }
                        className="w-40 h-40 object-cover border cursor-pointer hover:scale-110 transition mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-2 text-xs text-center align-middle font-semibold leading-7 border border-slate-700">
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredRecords.length}
          setCurrentPage={setCurrentPage}
        />

        {/* Voucher Modal */}
        {selectedVoucher && (
          <div className="fixed inset-0 text-slate-500 bg-black/70 flex items-center justify-center z-50">
            <div className="max-w-4xl w-full mx-4">
              <div className="relative flex items-center justify-center mb-4">
                <h2 className="text-lg font-bold">Screenshot Preview</h2>

                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="absolute right-0 px-4 py-1 rounded text-red-500 font-semibold hover:bg-red-600 hover:text-white transition duration-300 cursor-pointer"
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
