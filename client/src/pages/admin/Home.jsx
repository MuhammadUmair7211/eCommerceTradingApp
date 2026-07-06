import { useState } from "react";
function Home() {
  const [dateRange, setDateRange] = useState("2026-05-31 - 2026-05-31");

  const stats = [
    { label: "First-time top-up numbers", value: "0 people" },
    { label: "Total number of users", value: "0" },
    { label: "Total orders", value: "0" },
    { label: "Total orders (Duplicate)", value: "0" },
    { label: "User recharge", value: "0" },
    { label: "Number of people who recharged", value: "0" },
    { label: "User withdrawal", value: "0" },
    { label: "Number of withdrawals", value: "0" },
  ];

  return (
    <div className="rounded-sm bg-white p-6 shadow-sm">
      {/* Sub Menu */}
      <div className="flex h-8 items-center border-b space-x-8 text-xs text-gray-500 -mt-6 mb-6">
        <span className="text-[#00b4c8] border-b border-[#00b4c8] pb-1 font-medium">
          Statistics
        </span>
        <span className="cursor-pointer hover:text-gray-800">List</span>
        <span className="cursor-pointer hover:text-gray-800">history</span>
        <span className="cursor-pointer hover:text-gray-800">records</span>
      </div>

      <div className="mb-6 flex flex-col justify-between border-b pb-4 md:flex-row md:items-center">
        <h2 className="text-gray-400 font-medium">Mall Statistics</h2>
        <span className="text-xs text-gray-400">
          Beijing Time: 2026-05-31 15:55:50
        </span>
      </div>

      <div className="mb-6 text-xs">
        <span className="mr-2 text-gray-500">Promotion address:</span>
        <a href="#" className="text-blue-500 hover:underline">
          https://mercadolibreonline.shop/register?invite_code=469188
        </a>
      </div>

      <div className="mb-8 flex items-center space-x-3 text-xs">
        <span className="text-gray-500">Statistical time</span>
        <input
          type="text"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border px-2 py-1 text-center w-48 outline-none"
        />
        <button className="bg-[#008c9e] text-white px-4 py-1 font-medium rounded-sm">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between border border-gray-200 p-4 h-24 rounded-sm bg-white"
          >
            <span className="text-xs font-semibold text-gray-700">
              {stat.label}
            </span>
            <span className="text-sm font-bold text-red-500">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
