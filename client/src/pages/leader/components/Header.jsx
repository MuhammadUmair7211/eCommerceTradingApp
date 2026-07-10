import axios from "axios";
import {
  ArrowUpCircle,
  Headset,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../config/config";
import { toast } from "react-toastify";
import { useApp } from "../../../context/AppContext";

const Header = ({ addAdminModal, setAddAdminModal }) => {
  const { allUsers, allPayments, allWithdrawals, allSupports, getLeaderData } =
    useApp();

  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  // handle leader logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/leader/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("leaderToken")}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("leaderToken");
        navigate("/leader-auth", { replace: true });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const pendingRecharges = allPayments?.filter((p) => p.status === "pending");
  const pendingWithdrawals = allWithdrawals?.filter(
    (w) => w.status === "pending",
  );

  // NAV BUTTONS (ONE SOURCE ONLY)
  const navButtons = (
    <>
      {/* Refresh */}
      <button
        onClick={getLeaderData}
        className="flex items-center gap-2 p-2 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm group"
      >
        <RefreshCw
          size={18}
          className="group-hover:rotate-360 transition-transform duration-500"
        />
        <span className="hidden lg:block font-medium">Refresh</span>
      </button>

      {/* Support */}
      <button
        onClick={() => navigate("/leader-dashboard/support")}
        className="relative flex items-center gap-2 p-2 border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm group"
      >
        <Headset
          size={18}
          className="group-hover:rotate-360 transition-transform duration-500"
        />
        <span className="hidden lg:block font-medium">Support</span>

        <span className="absolute -top-2 -right-2 min-w-5.5 h-5.5 px-1 rounded-full bg-purple-600 text-white text-xs font-semibold flex items-center justify-center">
          {allSupports?.length}
        </span>
      </button>

      {/* Recharges */}
      <button
        onClick={() => navigate("/leader-dashboard/recharges")}
        className="relative flex items-center gap-2 p-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer group shadow-sm"
      >
        <Wallet
          size={18}
          className="group-hover:rotate-360 transition-transform duration-500"
        />
        <span className="hidden lg:block font-medium">Recharges</span>

        <span className="absolute -top-2 -right-2 min-w-5.5 h-5.5 px-1 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
          {pendingRecharges?.length}
        </span>
      </button>

      {/* Withdrawals */}
      <button
        onClick={() => navigate("/leader-dashboard/withdraws")}
        className="relative flex items-center gap-2 p-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm group"
      >
        <ArrowUpCircle
          size={18}
          className="group-hover:rotate-360 transition-transform duration-500"
        />
        <span className="hidden lg:block font-medium">Withdrawals</span>

        <span className="absolute -top-2 -right-2 min-w-5.5 h-5.5 px-1 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center">
          {pendingWithdrawals?.length}
        </span>
      </button>

      {/* Users */}
      <button
        onClick={() => navigate("/leader-dashboard/all-users")}
        className="relative flex items-center gap-2 p-2 border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer shadow-sm group"
      >
        <Users
          size={18}
          className="group-hover:rotate-360 transition-transform duration-500"
        />
        <span className="hidden lg:block font-medium">Users</span>

        <span className="absolute -top-2 -right-2 min-w-5.5 h-5.5 px-1 rounded-full bg-orange-600 text-white text-xs font-semibold flex items-center justify-center">
          {allUsers?.length}
        </span>
      </button>
    </>
  );

  return (
    <div className="bg-slate-800 border border-slate-700 p-2">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        {/* TITLE */}
        <div className="p-2">
          <h1 className="text-xl md:text-xl font-bold">Leader Dashboard</h1>
          <p className="text-yellow-500 text-sm md:text-lg">
            Manage admins and their teams
          </p>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center justify-end gap-3">
          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3">{navButtons}</div>
          {/* Divider */}

          <div className="h-8 w-px bg-slate-700" />
          {/* Add Admin */}
          <button
            onClick={() => setAddAdminModal(!addAdminModal)}
            className="group flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 p-2 font-medium text-blue-400 shadow-sm transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-blue-500/20 cursor-pointer"
          >
            <Plus
              size={18}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            <span>Add Admin</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 border border-red-500/30 bg-red-500/10 p-2 font-medium text-red-400 shadow-sm transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-red-500/20 cursor-pointer"
          >
            <LogOut
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
            <span>Logout</span>
          </button>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="lg:hidden p-2 cursor-pointer hover:scale-110"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menu && (
        <div className="lg:hidden mt-4 flex flex-col gap-3 border border-slate-700 p-4">
          {navButtons}

          <button
            onClick={() => {
              setAddAdminModal(true);
              setMenu(false);
            }}
            className="border border-blue-200 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 duration-300 cursor-pointer"
          >
            Add Admin
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
