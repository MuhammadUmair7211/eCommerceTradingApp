import { CalendarDays, Fingerprint, ShieldCheck, User } from "lucide-react";
import { useApp } from "../../../context/AppContext";

const LeaderCard = () => {
  const { leader } = useApp();

  const leaderData = [
    {
      name: "Username",
      icon: <User size={18} />,
      value: leader?.username || "Loading...",
      color: "text-blue-400",
    },
    {
      name: "Role",
      icon: <ShieldCheck size={18} />,
      value: leader?.role || "Leader",
      color: "text-green-400",
    },
    {
      name: "Created",
      icon: <CalendarDays size={18} />,
      value: leader?.createdAt
        ? new Date(leader.createdAt).toLocaleDateString()
        : "Loading...",
      color: "text-orange-400",
    },
    {
      name: "Leader ID",
      icon: <Fingerprint size={18} />,
      value: leader?._id || "Loading...",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="border border-slate-700 bg-slate-800 mt-2 p-2 shadow-lg">
      {/* Header */}
      <div className="border border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-4">
        {/* Left */}
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-linear-to-r from-green-500 to-emerald-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {leader?.username?.charAt(0)?.toUpperCase() || "L"}
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-bold text-white uppercase">
              {leader?.username || "Leader"}
            </h2>

            <p className="text-slate-400">Team Leader Dashboard</p>

            <p className="text-sm text-slate-500">📞+92-123456789</p>
          </div>
        </div>

        {/* Status */}
        <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/30 px-5 py-2">
          <ShieldCheck size={18} className="text-green-400" />

          <span className="font-semibold text-green-400">Active</span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 border border-slate-700 mt-2 p-4">
        {leaderData.map((item) => (
          <div
            key={item.name}
            className="border border-slate-700 bg-slate-800/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-500 hover:bg-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  {item.name}
                </p>

                <p className={`mt-1 text-lg font-bold ${item.color} break-all`}>
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderCard;
