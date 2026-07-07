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

  const totalBalance = allAdmins?.reduce((total, admin) => {
    return (
      total +
      (admin.teamMembers || []).reduce(
        (teamTotal, member) => teamTotal + Number(member.balance || 0),
        0,
      )
    );
  }, 0);

  const totalCommission = allAdmins?.reduce((total, admin) => {
    return (
      total +
      (admin.teamMembers || []).reduce(
        (teamTotal, member) => teamTotal + Number(member.commission || 0),
        0,
      )
    );
  }, 0);

  const totalOrders = allAdmins?.reduce((total, admin) => {
    return (
      total +
      (admin.teamMembers || []).reduce(
        (teamTotal, member) => teamTotal + Number(member.totalOrders || 0),
        0,
      )
    );
  }, 0);

  const dashboardData = [
    {
      name: "Total Users",
      value: allUsers?.length || 0,
      icon: <Users size={28} />,

      iconColor: "text-blue-400",
      valueColor: "text-blue-400",
    },
    {
      name: "Admins",
      value: allAdmins?.length || 0,
      icon: <Shield size={28} />,

      iconColor: "text-green-400",
      valueColor: "text-green-400",
    },
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-2 border border-slate-700 mt-2">
      {dashboardData.map((item) => (
        <div
          key={item.name}
          className="group relative overflow-hidden border border-slate-700 bg-linear-to-br from-slate-800 to-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 hover:shadow-2xl cursor-pointer p-4"
        >
          {/* Icon */}
          <div className={`${item.iconColor}`}>{item.icon}</div>

          {/* Title */}
          <p className="mt-3 text-sm uppercase tracking-wider text-slate-400 font-medium">
            {item.name}
          </p>

          <div>
            {/* Value */}
            <h2
              className={`mt-2 text-3xl font-extrabold ${item.valueColor} tracking-tight`}
            >
              {item.value}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCard;
