import { useMemo, useState } from "react";
import SearchBar from "../../components/admin/SearchBar";
import Pagination from "../../components/admin/Pagination";
import PageHeader from "../../components/admin/PageHeader";
import { AlertCircle, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";

function Withdrawals() {
  const { adminWithdrawals, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // SEARCH FILTER
  const filteredRecords = useMemo(() => {
    return adminWithdrawals.filter((w) => {
      const search = searchTerm.toLowerCase();

      return (
        w?.user?.username?.toLowerCase()?.includes(search) ||
        w?.transactionId?.toLowerCase()?.includes(search) ||
        w?.walletAddress?.toLowerCase()?.includes(search) ||
        String(w?.amount || "").includes(search)
      );
    });
  }, [adminWithdrawals, searchTerm]);

  // PAGINATION
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return <h1>loading....</h1>;
  }

  return (
    <>
      <div className="bg-slate-800 text-slate-300 border border-slate-700 overflow-hidden p-2">
        {/* HEADER */}
        <PageHeader
          heading="Withdrawals History"
          subheading="View all withdrawal requests"
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

        {/* TABLE */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full min-w-450 cursor-pointer">
            <thead className="border border-slate-700">
              <tr className="align-center hover:bg-slate-900 duration-300">
                <th className="px-4 py-3 text-left border border-slate-700">
                  User
                </th>
                <th className="px-4 py-3 text-left border border-slate-700">
                  Amount
                </th>
                <th className="px-4 py-3 text-left border border-slate-700">
                  Wallet
                </th>
                <th className="px-4 py-3 text-left border border-slate-700">
                  Transaction
                </th>
                <th className="px-4 py-3 text-left border border-slate-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left border border-slate-700">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedRecords?.map((w) => {
                return (
                  <tr
                    key={w._id}
                    className="border border-slate-700 align-top hover:bg-gray-900 duration-300"
                  >
                    {/* USER */}
                    <td className="p-2 text-xs font-semibold leading-7 border border-slate-700">
                      <div className="font-semibold">
                        {w?.userId?.username || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {w?.user?._id}
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-2 text-xs font-semibold leading-7 border border-slate-700">
                      ${Number(w?.amount || 0).toLocaleString()}
                    </td>

                    {/* WALLET */}
                    <td className="p-2 text-xs font-semibold leading-7 border border-slate-700">
                      {w?.walletAddress}
                    </td>

                    {/* TRANSACTION */}
                    <td className="p-2 text-xs font-semibold leading-7 border border-slate-700">
                      {w?.transactionId}
                    </td>

                    {/* STATUS */}
                    <td className="p-2 text-xs font-semibold leading-7 border border-slate-700">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          w.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : w.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="p-2 text-xs font-semibold leading-7 border border-slate-700">
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {paginatedRecords?.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              <AlertCircle className="mx-auto mb-2" />
              No withdrawal records found
            </div>
          )}
        </div>
      </div>
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredRecords.length}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default Withdrawals;
