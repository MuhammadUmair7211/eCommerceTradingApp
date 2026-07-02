import { CalendarDays, Fingerprint, ShieldCheck, User } from "lucide-react";
import { useApp } from "../../../context/AppContext";

const LeaderCard = () => {
  const { leader } = useApp();
  const leaderData = [
    {
      name: "Username",
      icon: <User size={18} />,
      value: leader?.username || "Loading...",
    },
    {
      name: "Role",
      icon: <ShieldCheck size={18} />,
      value: leader?.role || "Leader",
    },
    {
      name: "Created At",
      icon: <CalendarDays size={18} />,
      value: leader?.createdAt
        ? new Date(leader.createdAt).toLocaleString()
        : "Loading...",
    },
    {
      name: "Leader ID",
      icon: <Fingerprint size={18} />,
      value: leader?._id || "Loading...",
    },
  ];

  return (
    <div className="bg-slate-900 text-slate-300 border border-slate-700 shadow-lg p-2 md:p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Leader</h2>

          <p className="text-sm text-slate-400">Leader account information</p>

          <p className="text-sm text-slate-500">phone: +92-123456789</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-full flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-400" />
          <span className="font-medium">Active</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaderData.map((data, i) => (
          <div
            key={i}
            className="bg-slate-800 border border-slate-700 p-4 rounded-lg hover:bg-slate-700 transition"
          >
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <span className="text-slate-400">{data.icon}</span>
              <span className="text-sm">{data.name}</span>
            </div>

            <p className="font-bold text-lg text-white break-all">
              {data.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderCard;
