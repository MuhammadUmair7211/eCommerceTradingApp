const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  setCurrentPage,
}) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="flex justify-between items-center mt-4 text-slate-300">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="px-4 py-2 bg-slate-800 border border-slate-700 disabled:opacity-50 hover:bg-slate-700 transition duration-300 cursor-pointer"
      >
        ← Previous
      </button>

      <p className="text-sm text-slate-400">
        Showing {totalItems === 0 ? 0 : indexOfFirstItem + 1} -{" "}
        {Math.min(indexOfLastItem, totalItems)} of {totalItems}
      </p>

      <button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="px-4 py-2 bg-slate-800 border border-slate-700 disabled:opacity-50 hover:bg-slate-700 transition duration-300 cursor-pointer"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
