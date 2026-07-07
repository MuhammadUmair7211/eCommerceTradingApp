import { useState, useRef, useEffect } from "react";
import {
  Users,
  Wallet,
  ArrowDownCircle,
  User,
  LogOut,
  RefreshCw,
  Clock3,
  Sidebar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../config/config";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";

function TopNavbar() {
  const { admin, adminPayments, adminWithdrawals, fetchAdminData } = useApp();
  const pendingRecharges = adminPayments?.filter((r) => r.status === "pending");
  const pendingWithdrawals = adminWithdrawals?.filter(
    (w) => w.status === "pending",
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // admins logout
  const handleAdminLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.put(
        `${baseUrl}/admins/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      if (data.success) {
        localStorage.removeItem("adminToken");
        toast.success(data.message);
        navigate("/admin-auth", { replace: true });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  const isOnlineMembers = admin?.teamMembers.filter(
    (members) => members.isOnline === true,
  );

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center justify-between h-20 px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl"></div>
            <div className="relative w-12 h-12 lg:h-14 lg:w-14 rounded-full flex items-center justify-center border border-cyan-500/30 bg-linear-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-lg">
              <span className="lg:text-xl font-black tracking-wider text-white">
                {admin?.username
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col justify-center">
            <h1 className="text-lg lg:text-xl font-bold tracking-wide text-white">
              {admin?.username}'s Team
            </h1>
            <div className="flex items-center gah-12 px-3">
              <div className="hidden lg:block h-px w-8 bg-cyan-500"></div>

              <p className="text-xs tracking-[0.25em] text-slate-400">
                Administrator Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3 md:gap-5">
          {/* online users */}
          <div className="relative group flex items-center gap-3 h-12 px-3 lg:border lg:border-slate-700 lg:bg-slate-800 lg:hover:bg-slate-700 lg:hover:border-emerald-500 transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-700">
              <Users size={18} className="text-emerald-400" />
            </div>

            <div className="hidden lg:block leading-tight">
              <p className="text-sm tracking-wider text-slate-500">Online</p>
            </div>
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold">
              {isOnlineMembers?.length || 0}
            </span>
          </div>
          <div className="hidden xl:block h-8 w-px bg-slate-700"></div>
          {/* topUp */}
          <button
            onClick={() => navigate("/admin/topups")}
            className="relative group flex items-center gap-3 h-12 px-3 lg:border lg:border-slate-700 lg:bg-slate-800 lg:hover:bg-slate-700 lg:hover:border-amber-500 cursor-pointer transition-all duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-700">
              <Wallet size={18} className="text-amber-400" />
            </div>

            <div className="hidden lg:block leading-tight text-left">
              <p className="text-sm tracking-wider text-slate-500">Top Ups</p>

              <p className="text-sm font-semibold text-white">Pending</p>
            </div>

            <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full px-1 flex items-center justify-center bg-amber-500 text-black text-[10px] font-bold">
              {pendingRecharges?.length || 0}
            </span>
          </button>
          <div className="hidden xl:block h-8 w-px bg-slate-700"></div>
          {/* withdrawals */}
          <button
            onClick={() => navigate("/admin/withdrawals")}
            className="relative group flex items-center gap-3 h-12 px-3 lg:border lg:border-slate-700 lg:bg-slate-800 lg:hover:bg-slate-700 lg:hover:border-rose-500 cursor-pointer transition-all duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-700">
              <ArrowDownCircle size={18} className="text-rose-400" />
            </div>

            <div className="hidden lg:block leading-tight text-left">
              <p className="text-sm tracking-wider text-slate-500">
                Withdrawals
              </p>

              <p className="text-sm font-semibold text-white">Pending</p>
            </div>

            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold">
              {pendingWithdrawals?.length || 0}
            </span>
          </button>
          <div className="hidden xl:block h-8 w-px bg-slate-700"></div>

          {/* Date & Time */}
          <div className="flex items-center gap-3 h-12 px-3 lg:border lg:border-slate-700 lg:bg-slate-800 lg:hover:border-cyan-500 transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center border border-slate-700 bg-slate-900">
              <Clock3 size={17} className="text-cyan-400" />
            </div>

            <div className="leading-tight">
              <p className="hidden lg:block text-[11px] uppercase tracking-wider text-slate-500">
                Current Time
              </p>

              <p className="text-sm font-semibold text-white">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="hidden xl:block h-8 w-px bg-slate-700"></div>

          {/* Refresh */}
          <button
            onClick={() => {
              console.log("fetching admin data");
              fetchAdminData();
            }}
            className="group flex items-center gap-3 h-12 px-3 lg:border lg:border-slate-700 lg:bg-slate-800 lg:hover:bg-slate-700 lg:hover:border-cyan-500 cursor-pointer transition-all duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-slate-700 bg-slate-900 group-hover:rotate-180 transition-transform duration-500">
              <RefreshCw size={17} className="text-cyan-400" />
            </div>

            <div className="hidden lg:block text-left leading-tight">
              <p className="text-sm font-semibold text-white">Refresh</p>
            </div>
          </button>
          <div className="hidden xl:block h-8 w-px bg-slate-700"></div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="group h-14 flex items-center gap-3 hover:border-cyan-500 transition-all duration-300 cursor-pointer"
            >
              {/* Initials */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm">
                {admin?.username
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 border border-slate-700 bg-slate-900 shadow-2xl z-50">
                {/* Header */}
                <div className="flex items-center gap-4 p-5 border-b border-slate-700">
                  <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg">
                    {admin?.username
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {admin?.username}
                    </h3>

                    <p className="text-xs text-slate-400">
                      {admin?.profileCode}
                    </p>

                    <p className="text-xs text-cyan-400 mt-1">{admin?.role}</p>
                  </div>
                </div>

                {/* Invitation */}
                <div className="px-5 py-3 border-b border-slate-700">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Invitation Code
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white break-all">
                    {admin?.referralCode}
                  </p>
                </div>

                {/* Profile */}
                <button
                  onClick={() => {
                    navigate("/admin/admin-profile");
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-slate-300 hover:bg-slate-800 transition-all duration-300"
                >
                  <User size={18} />
                  <span>My Profile</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleAdminLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 border-t border-slate-700 text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Sidebar className="block md:hidden" />
    </header>
  );
}

export default TopNavbar;
