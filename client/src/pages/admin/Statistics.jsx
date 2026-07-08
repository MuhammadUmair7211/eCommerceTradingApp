import {
  ArrowDownCircle,
  BadgeDollarSign,
  Banknote,
  CircleCheckBig,
  HandCoins,
  Landmark,
  ShoppingCart,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import PageHeader from "../../components/admin/PageHeader";
import StatCard from "../../components/user/StatCard";
import { useApp } from "../../context/AppContext";

function Statistics() {
  const { admin, adminPayments, adminWithdrawals } = useApp();

  // total orders count
  const totalOrders = admin?.teamMembers.reduce(
    (curr, acc) => curr + acc.totalOrders,
    0,
  );
  // total orders count
  const completedOrders = admin?.teamMembers.reduce(
    (curr, acc) => curr + acc.completedOrders,
    0,
  );

  // total recharges
  const totalRecharges = adminPayments.reduce(
    (curr, acc) => curr + acc.amount,
    0,
  );

  // approved recharge count
  const approvedRechargeCount = adminPayments?.filter(
    (r) => r.status === "approved",
  ).length;

  // total withdrawals
  const totalWithdrawals = adminWithdrawals.reduce(
    (curr, acc) => curr + acc.amount,
    0,
  );
  // approved withdrawal count
  const approvedWithdrawalCount = adminWithdrawals?.filter(
    (w) => w.status === "approved",
  ).length;
  // total commission
  const totalCommission = admin?.teamMembers.reduce(
    (curr, acc) => curr + acc.commission,
    0,
  );
  // total user balance
  const totalUserBalance = admin?.teamMembers.reduce(
    (curr, acc) => curr + acc.balance,
    0,
  );

  // cards
  const cards = [
    {
      title: "First-time Top-up Users",
      value: 0,
      icon: <UserRound size={24} />,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
    {
      title: "Total Users",
      value: admin?.teamMembers?.length,
      icon: <Users size={24} />,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart size={24} />,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      icon: <CircleCheckBig size={24} />,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      title: "User Recharge",
      value: `$${totalRecharges?.toFixed(2)}`,
      icon: <Wallet size={24} />,
      color: "text-green-400 bg-green-500/10 border-green-500/30",
    },
    {
      title: "Users Recharged",
      value: approvedRechargeCount,
      icon: <Banknote size={24} />,
      color: "text-lime-400 bg-lime-500/10 border-lime-500/30",
    },
    {
      title: "User Withdrawals",
      value: `$${totalWithdrawals?.toFixed(2)}`,
      icon: <ArrowDownCircle size={24} />,
      color: "text-red-400 bg-red-500/10 border-red-500/30",
    },
    {
      title: "Withdrawal Requests",
      value: approvedWithdrawalCount,
      icon: <Landmark size={24} />,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "Order Commission",
      value: `$${totalCommission?.toFixed(2)}`,
      icon: <BadgeDollarSign size={24} />,
      color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    },
    {
      title: "Interest Treasure Transfer",
      value: "0 USDT",
      icon: <HandCoins size={24} />,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Subordinate Commission",
      value: "0 USDT",
      icon: <BadgeDollarSign size={24} />,
      color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30",
    },
    {
      title: "Total User Balance",
      value: `$${totalUserBalance?.toFixed(2)}`,
      icon: <Wallet size={24} />,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
  ];

  return (
    <div className="bg-slate-900 text-slate-300 space-y-4">
      {/* Header */}
      <div className="relative overflow-hidden border border-slate-700 bg-slate-800 p-6 shadow-xl">
        {/* Content */}
        <PageHeader
          heading="Mall Statistics"
          subheading="Overview of platform activity and financial performance."
        />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>
    </div>
  );
}

export default Statistics;
