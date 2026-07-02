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

  const totalBalance = allAdmins.reduce((total, admin) => {
    return (
      total +
      (admin.teamMembers || []).reduce(
        (teamTotal, member) => teamTotal + Number(member.balance || 0),
        0,
      )
    );
  }, 0);

  const totalCommission = allAdmins.reduce((total, admin) => {
    return (
      total +
      admin.teamMembers?.reduce(
        (teamTotal, member) => teamTotal + Number(member.commission),
        0,
      )
    );
  }, 0);

  const totalOrders = allAdmins.reduce((total, admin) => {
    return (
      total +
      admin.teamMembers?.reduce(
        (teamTotal, member) => teamTotal + Number(member.totalOrders),
        0,
      )
    );
  }, 0);

  const dashboardData = [
    {
      name: "Total Users",
      value: allUsers?.length,
      icon: <Users className="text-blue-400" />,
    },
    {
      name: "Admins",
      value: allAdmins?.length,
      icon: <Shield className="text-green-400" />,
    },
    {
      name: "Total Balance",
      value: "$" + totalBalance?.toFixed(2),
      icon: <Wallet className="text-purple-400" />,
    },
    {
      name: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart className="text-orange-400" />,
    },
    {
      name: "Total Commission",
      value: "$" + totalCommission?.toFixed(2),
      icon: <BadgeDollarSign className="text-pink-400" />,
    },
  ];

  return (
    <div className="bg-slate-900 text-slate-300 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 md:p-6">
      {dashboardData.map((data) => (
        <div
          key={data.name}
          className="bg-slate-800 border border-slate-700 rounded-lg p-5 shadow-md hover:bg-slate-700 transition-all duration-300"
        >
          {/* Icon */}
          <div className="mb-3 text-xl">{data.icon}</div>

          {/* Title */}
          <h2 className="text-sm md:text-base font-semibold text-white">
            {data.name}
          </h2>

          {/* Value */}
          <p className="text-lg md:text-xl font-bold text-slate-200 mt-2">
            {data.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatsCard;
