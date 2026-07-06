import { useLocation } from "react-router-dom";
import {
  Wallet,
  Activity,
  Users,
  ShoppingCart,
  BadgeDollarSign,
  UserCircle,
  ShieldCheck,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";

function AdminTeamPage() {
  const location = useLocation();
  const admin = location.state?.admin;
  console.log(admin);
  const [search, setSearch] = useState("");

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

  const filteredTeamMembers = admin?.teamMembers.filter((member) => {
    return (
      member.username?.toLowerCase().includes(search.toLowerCase()) ||
      member.phoneNumber?.includes(search) ||
      member._id?.includes(search)
    );
  });

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
      icon: <Wallet className="w-8 h-8 text-purple-400 mb-2" />,
    },
    {
      name: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart className="w-8 h-8 text-orange-400 mb-2" />,
    },
    {
      name: "Total Commission",
      value: `$${totalCommission.toFixed(2)}`,
      icon: <BadgeDollarSign className="w-8 h-8 text-pink-400 mb-2" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-4 text-slate-300">
      <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 shadow-xl mb-6">
        {/* Header */}
        <div>
          <h1 className="text-lg font-bold text-white">
            {admin?.username}'s Team
          </h1>
          <p className="text-slate-400 text-sm">Administrator Information</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          {/* Profile Code */}
          <div className="bg-slate-800/70 border border-slate-700 p-4 hover:border-green-500 transition">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-xs text-slate-400">Profile Code</p>
                <p className="text-green-400 font-semibold">
                  {admin?.profileCode}
                </p>
              </div>
            </div>
          </div>

          {/* Invitation Code */}
          <div className="bg-slate-800/70 border border-slate-700 p-4 hover:border-blue-500 transition">
            <div className="flex items-center gap-3">
              <KeyRound className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Invitation Code</p>
                <p className="text-white font-semibold">
                  {admin?.referralCode}
                </p>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-slate-800/70 border border-slate-700 p-4 hover:border-yellow-500 transition">
            <div className="flex items-center gap-3">
              <LockKeyhole className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-xs text-slate-400">Admin Password</p>
                <p className="text-white font-semibold">{admin?.password}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-slate-800/70 border border-slate-700 p-4 hover:border-purple-500 transition">
            <div className="flex items-center gap-3">
              <Activity
                className={`w-8 h-8 ${
                  admin?.isOnline ? "text-green-400" : "text-red-400"
                }`}
              />
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p
                  className={`font-semibold ${
                    admin?.isOnline ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {admin?.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-slate-800/70 border border-slate-700 p-4 hover:border-cyan-500 transition">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">Team Members</p>
                <p className="text-white font-semibold">
                  {admin?.teamMembers?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="text-center mb-5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, username, phone"
          className="max-w-5xl w-full bg-slate-800 border border-slate-700 p-3 text-slate-300 outline-none focus:border-slate-500"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {dashboardData.map((data) => (
          <div
            key={data.name}
            className="bg-slate-800 border border-slate-700 p-5 hover:border-slate-600 transition"
          >
            {data.icon}

            <h2 className="text-lg font-bold text-white">{data.name}</h2>

            <p className="text-xl font-semibold text-slate-300 mt-2">
              {data.value}
            </p>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {admin?.teamMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-800 border border-dashed border-slate-700">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-700 mb-4">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeamMembers?.map((u) => (
            <div
              key={u._id}
              className="relative group bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition duration-300"
            >
              {/* CARD HEADER */}
              <div className="p-4 bg-slate-700 border-b border-slate-600">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg text-white">
                    👤username: {u.username}
                  </h2>

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      u.isOnline
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isOnline ? "online" : "offline"}
                  </span>
                </div>

                <div className="mt-2 text-sm text-slate-400">
                  🎟 Referred By:
                  <span className="font-bold text-blue-400 ml-1">
                    {u.referredBy || "N/A"} - {admin.username} (admin)
                  </span>
                </div>

                <div className="mt-2 text-sm">
                  💰 Balance:
                  <span className="text-green-400 font-semibold ml-1">
                    ${u?.balance?.toFixed(2) || 0}
                  </span>
                </div>
              </div>

              {/* BODY */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                <div>📱 Phone: {u.phoneNumber}</div>

                <div>
                  🆔 ID:
                  <span className="text-xs break-all ml-1">{u._id}</span>
                </div>

                <div>🎫 Code: {u.myInvitationCode}</div>

                <div>👑 Role: {u.role}</div>

                <div>🏆 Level: {u.vipLevel || "VIP0"}</div>

                <div className="md:col-span-2">
                  🏦 Wallet: {u.bankCard || "N/A"}
                </div>

                <div>🏙️ City: {u.city || "N/A"}</div>

                <div>🌍 Country: {u.country || "N/A"}</div>

                <div>🌐 IP: {u.ip || "N/A"}</div>

                <div>
                  ⏰ Last Login:
                  {u.lastLogin
                    ? new Date(u.lastLogin).toLocaleString()
                    : " N/A"}
                </div>

                <div className="md:col-span-2 text-xs text-slate-500">
                  📅 Joined: {new Date(u.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition pointer-events-none" />
            </div>
          ))}
        </div>
      )}
      {filteredTeamMembers.length === 0 && (
        <div className="min-h-[50vh] flex items-center justify-center text-slate-300">
          <p>No users available</p>
        </div>
      )}
    </div>
  );
}

export default AdminTeamPage;
