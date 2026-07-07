import { useMemo, useState } from "react";
import SearchBar from "../../components/admin/SearchBar";
import Pagination from "../../components/admin/Pagination";
import PageHeader from "../../components/admin/PageHeader";
import { AlertCircle } from "lucide-react";
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
    <div className="bg-slate-900 text-slate-300 border border-slate-700 overflow-hidden p-2">
      {/* HEADER */}
      <PageHeader
        heading="Withdrawals History"
        subheading="View all withdrawal requests"
      />
      {/* SEARCH */}
      <div className="flex items-center justify-center">
        <span className="text-sm">
          total records: {filteredRecords?.length}
        </span>
        <SearchBar
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-450 cursor-pointer">
          <thead className="border border-slate-700">
            <tr className="align-top hover:bg-slate-800 duration-300">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Wallet</th>
              <th className="px-4 py-3 text-left">Transaction</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRecords?.map((w) => {
              return (
                <tr
                  key={w._id}
                  className="border-t border-slate-700 align-top hover:bg-gray-800 duration-300"
                >
                  {/* USER */}
                  <td className="p-4">
                    <div className="font-semibold">
                      {w?.userId?.username || "N/A"}
                    </div>
                    <div className="text-xs text-gray-400">{w?.user?._id}</div>
                  </td>

                  {/* AMOUNT */}
                  <td className="p-4 font-bold text-green-600">
                    ${Number(w?.amount || 0).toLocaleString()}
                  </td>

                  {/* WALLET */}
                  <td className="p-4 text-xs break-all text-gray-600">
                    {w?.walletAddress}
                  </td>

                  {/* TRANSACTION */}
                  <td className="p-4 text-xs text-gray-600">
                    {w?.transactionId}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
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
                  <td className="p-4 text-xs text-gray-500">
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
      {/* PAGINATION */}
      {filteredRecords?.length > 0 && (
        <div className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default Withdrawals;
