import {
  BadgeDollarSign,
  Shield,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import { useApp } from "../../../context/AppContext";

function StatsCard() {
  const { allAdmins, allUsers } = useApp();

  const totalBalance =
    allAdmins?.reduce((total, admin) => {
      return (
        total +
        (admin.teamMembers || []).reduce(
          (sum, member) => sum + Number(member.balance || 0),
          0,
        )
      );
    }, 0) || 0;

  const totalCommission =
    allAdmins?.reduce((total, admin) => {
      return (
        total +
        (admin.teamMembers || []).reduce(
          (sum, member) => sum + Number(member.commission || 0),
          0,
        )
      );
    }, 0) || 0;

  const totalOrders =
    allAdmins?.reduce((total, admin) => {
      return (
        total +
        (admin.teamMembers || []).reduce(
          (sum, member) => sum + Number(member.totalOrders || 0),
          0,
        )
      );
    }, 0) || 0;

  const dashboardData = [
    {
      name: "Total Users",
      value: allUsers.length,
      icon: <Users size={24} />,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      name: "Admins",
      value: allAdmins.length,
      icon: <Shield size={24} />,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      name: "Total Balance",
      value: `$${totalBalance.toFixed(2)}`,
      icon: <Wallet size={24} />,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
    {
      name: "Orders",
      value: totalOrders,
      icon: <ShoppingCart size={24} />,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
    {
      name: "Commission",
      value: `$${totalCommission.toFixed(2)}`,
      icon: <BadgeDollarSign size={24} />,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {dashboardData.map((item) => (
        <div className="group border border-slate-700 cursor-pointer bg-slate-800 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {item.name}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                {item.value}
              </h2>
            </div>

            <div
              className={`flex h-14 w-14 rounded-full items-center justify-center ${
                item.iconBg
              } ${item.iconColor} transition duration-300 group-hover:scale-110`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCard;
