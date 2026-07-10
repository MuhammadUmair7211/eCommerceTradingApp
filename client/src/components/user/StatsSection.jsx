import { useApp } from "../../context/AppContext";

export default function StatsSection() {
  const { user } = useApp();
  const stats = [
    {
      value: user?.commission?.toFixed(2),
      label: "Get commission",
    },
    {
      value: "$" + user?.frozenAmount?.toFixed(2),
      label: "Amount frozen",
    },
    {
      value: user?.totalOrders,
      label: "Order number",
    },
    {
      value: "$" + user?.depositAmount?.toFixed(2),
      label: "Total Deposit",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-slate-700">
      {stats.map((item) => (
        <div key={item.label} className="text-center">
          <h3 className="text-xl md:text-3xl font-bold ">{item.value}</h3>

          <p className="text-gray-500 mt-3">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
