import { NavLink } from "react-router-dom";
import { Users, CreditCard, Wallet, Home } from "lucide-react";
import Promotion from "./Promotion";

function SubNavbar() {
  const menu = [
    {
      name: "Homepage",
      path: "/admin/statistics",
      icon: <Home size={18} />,
    },
    {
      name: "Member List",
      path: "/admin/members",
      icon: <Users size={18} />,
    },
    {
      name: "Recharge History",
      path: "/admin/topups",
      icon: <CreditCard size={18} />,
    },
    {
      name: "Withdrawal Records",
      path: "/admin/withdrawals",
      icon: <Wallet size={18} />,
    },
  ];

  return (
    <div className="mx-4 mt-4 border border-slate-700 bg-slate-800">
      {/* Navigation */}
      <div className="flex flex-wrap gap-3 border-b border-slate-700 p-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/10"
                  : "border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Promotion */}
      <div>
        <Promotion />
      </div>
    </div>
  );
}
export default SubNavbar;
