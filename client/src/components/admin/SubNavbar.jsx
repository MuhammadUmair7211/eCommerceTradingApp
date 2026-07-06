import { NavLink } from "react-router-dom";
import { Users, CreditCard, Wallet, Home, Copy } from "lucide-react";

export default function SubNavbar({ admin }) {
  const referralLink = `https://mercadolibreonline.shop/register?invite_code=${admin?.referralCode}`;
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
      path: "/admin/recharge",
      icon: <CreditCard size={18} />,
    },
    {
      name: "Withdrawal Records",
      path: "/admin/withdrawals",
      icon: <Wallet size={18} />,
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Link copied successfully!");
  };

  return (
    <div className="bg-slate-800 text-slate-300 sticky top-0 z-40">
      {/* Navigation */}
      <div className="flex flex-wrap items-center gap-8 px-6 py-4 border-b border-slate-700">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 font-medium transition-all duration-300 ${
                isActive
                  ? "text-cyan-600 border-b-2 border-cyan-600 pb-2"
                  : "text-gray-600 hover:text-cyan-600"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Promotion Section */}
      <div className="p-4">
        <div className="border border-slate-700 p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Promotion Address
          </h3>

          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-750 break-all hover:underline"
            >
              {referralLink}
            </a>

            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 duration-300 cursor-pointer"
            >
              <Copy size={16} />
              Copy Link
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Share this referral link to invite new members and grow your team.
          </p>
        </div>
      </div>
    </div>
  );
}
