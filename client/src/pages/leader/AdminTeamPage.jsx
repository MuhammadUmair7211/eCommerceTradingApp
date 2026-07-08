import { useLocation } from "react-router-dom";
import {
  Wallet,
  Activity,
  Users,
  ShoppingCart,
  BadgeDollarSign,
  ShieldCheck,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import UserCard from "./components/UserCard";
import Pagination from "./components/Pagination";
import BackButton from "./components/BackButton";

function AdminTeamPage() {
  const location = useLocation();
  const admin = location.state?.admin;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // IMPORTANT: Prevent crash on refresh
  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h2 className="text-red-400 font-semibold text-lg">
            Admin not found
          </h2>

          <p className="text-slate-400 mt-2">
            Please return to the dashboard and select an admin again.
          </p>
        </div>
      </div>
    );
  }

  const filteredTeamMembers = (admin?.teamMembers || []).filter((member) => {
    return (
      member.username?.toLowerCase().includes(search.toLowerCase()) ||
      member.phoneNumber?.includes(search) ||
      member._id?.includes(search)
    );
  });

  const totalPages = Math.ceil(filteredTeamMembers.length / itemsPerPage);

  const paginatedTeamMembers = filteredTeamMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalBalance = admin?.teamMembers.reduce(
    (curr, acc) => curr + (acc.balance || 0),
    0,
  );

  const totalOrders = admin?.teamMembers.reduce(
    (curr, acc) => curr + (acc.totalOrders || 0),
    0,
  );

  const totalCommission = admin?.teamMembers.reduce(
    (curr, acc) => curr + (acc.commission || 0),
    0,
  );

  const dashboardData = [
    {
      name: "Total Balance",
      value: `$${totalBalance.toFixed(2)}`,
      icon: <Wallet size={28} />,
      iconColor: "text-purple-400",
      valueColor: "text-purple-400",
    },
    {
      name: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart size={28} />,
      iconColor: "text-orange-400",
      valueColor: "text-orange-400",
    },
    {
      name: "Commission",
      value: `$${totalCommission.toFixed(2)}`,
      icon: <BadgeDollarSign size={28} />,
      iconColor: "text-pink-400",
      valueColor: "text-pink-400",
    },
  ];
  const infoCards = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
      title: "Profile Code",
      value: admin?.profileCode,
    },
    {
      icon: <KeyRound className="w-8 h-8 text-blue-400" />,
      title: "Invitation Code",
      value: admin?.referralCode,
    },
    {
      icon: <LockKeyhole className="w-8 h-8 text-yellow-400" />,
      title: "Admin Password",
      value: admin?.password,
    },
    {
      icon: (
        <Activity
          className={`w-8 h-8 ${
            admin?.isOnline ? "text-green-400" : "text-red-400"
          }`}
        />
      ),
      title: "Status",
      value: admin?.isOnline ? "Online" : "Offline",
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      title: "Team Members",
      value: admin?.teamMembers?.length || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-4 text-slate-300">
      <BackButton />
      <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 p-2 shadow-xl mb-2">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {admin?.username?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              {admin?.username}'s Team
            </h1>
            <p className="text-sm text-slate-400">Administrator Dashboard</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
          {infoCards.map((info, index) => (
            <div
              key={index}
              className="bg-slate-800/70 border border-slate-700 p-4 hover:border-slate-500 cursor-pointer duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                {info.icon}
                <div>
                  <p className="text-xs text-slate-400">{info.title}</p>
                  <p className="text-green-400 font-semibold">{info.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH */}
      <div className="text-center mb-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, username, phone"
          className="max-w-5xl w-full bg-slate-800 border border-slate-700 p-3 text-slate-300 outline-none focus:border-slate-500"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {dashboardData.map((item) => (
          <div
            key={item.name}
            className="group relative overflow-hidden border border-slate-700 bg-linear-to-br from-slate-800 to-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 hover:shadow-2xl cursor-pointer p-4"
          >
            {/* Icon */}
            <div className={`${item.iconColor}`}>{item.icon}</div>

            {/* Title */}
            <p className="mt-3 text-sm uppercase tracking-wider text-slate-400 md:font-medium">
              {item.name}
            </p>

            <div>
              {/* Value */}
              <h2
                className={`mt-2 text-lg md:text-3xl md:font-extrabold ${item.valueColor} tracking-tight`}
              >
                {item.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {admin?.teamMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-800 border border-dashed border-slate-700">
          <div className="w-16 h-16 flex items-center justify-center bg-slate-700 mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>

          <h2 className="text-lg font-semibold text-white">
            No Team Members Yet
          </h2>

          <p className="text-sm text-slate-400 mt-2 max-w-md">
            This admin hasn’t added any team members yet. Once users join under
            this admin they will appear here automatically.
          </p>

          <div className="mt-4 px-3 py-1 text-xs bg-slate-700 text-slate-300 rounded-full">
            Waiting for referrals
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedTeamMembers?.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              adminUsername={admin.username}
              showEditButton={false}
            />
          ))}
        </div>
      )}
      {paginatedTeamMembers.length === 0 && (
        <div className="min-h-[50vh] flex items-center justify-center text-slate-300">
          <p>No users available</p>
        </div>
      )}

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredTeamMembers.length}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default AdminTeamPage;
