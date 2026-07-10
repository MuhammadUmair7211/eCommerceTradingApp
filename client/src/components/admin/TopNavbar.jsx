import { useState, useRef, useEffect } from "react";
import {
  Users,
  Wallet,
  ArrowDownCircle,
  User,
  LogOut,
  RefreshCw,
  Sidebar,
  X,
  House,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../config/config";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";

function TopNavbar() {
  const { admin, adminPayments, adminWithdrawals, fetchAdminData } = useApp();
  const [showSidebar, setShowSideBar] = useState(false);
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
    <header className="mx-2 sticky top-0 z-50 bg-slate-900">
      <div className="border border-slate-700 flex items-center justify-between p-4">
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-slate-700 group-hover:rotate-360 transition-transform duration-500">
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-slate-700 group-hover:rotate-360 transition-transform duration-500">
              <Wallet size={18} className="text-amber-400" />
            </div>

            <div className="hidden lg:block leading-tight text-left">
              <p className="text-sm tracking-wider text-slate-500">Top Ups</p>
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-slate-700 group-hover:rotate-360 transition-transform duration-500">
              <ArrowDownCircle size={18} className="text-rose-400" />
            </div>

            <div className="hidden lg:block leading-tight text-left">
              <p className="text-sm tracking-wider text-slate-500">
                Withdrawals
              </p>
            </div>

            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold">
              {pendingWithdrawals?.length || 0}
            </span>
          </button>
          <div className="hidden xl:block h-8 w-px bg-slate-700"></div>

          {/* Refresh */}
          <button
            onClick={() => {
              console.log("fetching admin data");
              fetchAdminData();
            }}
            className="group flex items-center gap-3 h-12 px-3 lg:border lg:border-slate-700 lg:bg-slate-800 lg:hover:bg-slate-700 lg:hover:border-cyan-500 cursor-pointer transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-700 bg-slate-900 group-hover:rotate-360 transition-transform duration-500">
              <RefreshCw size={17} className="text-cyan-400" />
            </div>

            <div className="hidden lg:block text-left leading-tight">
              <p className="text-sm font-semibold text-white">Refresh</p>
            </div>
          </button>
          <div className="hidden xl:block h-8 w-px bg-slate-700"></div>

          {/* Date & Time */}
          <div className="flex items-center gap-3 h-12 px-3 lg:border lg:border-slate-700 lg:bg-slate-800 lg:hover:border-cyan-500 transition-all duration-300 cursor-pointer">
            <p className="text-sm font-semibold text-white">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
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
                <div className="flex items-center gap-2 p-4 border-b border-slate-700">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-linear-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg">
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
                      profile code: {admin?.profileCode}
                    </p>
                    <p className="text-xs text-slate-400">
                      Invitation code: {admin?.referralCode}
                    </p>
                    <p className="text-xs text-cyan-400">{admin?.role}</p>
                  </div>
                </div>

                {/* Profile */}
                <button
                  onClick={() => {
                    navigate("/admin/admin-profile");
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-slate-300 hover:bg-slate-800 transition-all duration-300 cursor-pointer"
                >
                  <User size={18} />
                  <span>
                    {admin?.username[0].toUpperCase() +
                      admin?.username.slice(1)}{" "}
                    Profile
                  </span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleAdminLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 border-t border-slate-700 text-red-400 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <Sidebar
          className="block cursor-pointer md:hidden hover:scale-110 duration-300"
          onClick={() => {
            setShowSideBar((prev) => !prev);
          }}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen max-w-lg w-full bg-slate-900 border-r border-slate-700 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>

          <button
            onClick={() => setShowSideBar(false)}
            className=" rounded-full cursor-pointer hover:rotate-360 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition duration-300"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Navigation
          </p>

          {/* Home */}
          <button
            onClick={() => {
              navigate("/admin/statistics");
              setShowSideBar(false);
            }}
            className="group flex w-full items-center gap-3 border border-slate-700 bg-slate-800 px-4 py-3 transition hover:bg-slate-700 hover:border-cyan-500 cursor-pointer"
          >
            <House
              size={18}
              className="text-cyan-400 group-hover:rotate-360 transition-transform duration-500"
            />
            <span className="text-slate-200">Dashboard</span>
          </button>

          {/* Refresh */}
          <button
            onClick={() => {
              fetchAdminData();
              setShowSideBar(false);
            }}
            className="group flex w-full items-center gap-3 border border-slate-700 bg-slate-800 px-4 py-3 transition hover:bg-slate-700 hover:border-cyan-500 cursor-pointer"
          >
            <RefreshCw
              size={18}
              className="text-cyan-400 group-hover:rotate-360 transition-transform duration-500"
            />
            <span className="text-slate-200">Refresh Data</span>
          </button>

          {/* TopUp */}
          <button
            onClick={() => {
              navigate("/admin/topups");
              setShowSideBar(false);
            }}
            className="relative group flex w-full items-center gap-3 border border-slate-700 bg-slate-800 px-4 py-3 transition hover:bg-slate-700 cursor-pointer hover:border-amber-500"
          >
            <Wallet
              className="text-amber-400 group-hover:rotate-360 transition-transform duration-500"
              size={18}
            />

            <span className="text-slate-200">Pending Top Ups</span>

            <span className="absolute top-2 right-3 min-w-6 h-6 px-2 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center ring-2 ring-slate-900">
              {pendingRecharges?.length || 0}
            </span>
          </button>

          {/* Withdrawals */}
          <button
            onClick={() => {
              navigate("/admin/withdrawals");
              setShowSideBar(false);
            }}
            className="relative group flex w-full items-center gap-3 cursor-pointer border border-slate-700 bg-slate-800 px-4 py-3 transition hover:bg-slate-700 hover:border-rose-500"
          >
            <ArrowDownCircle
              className="text-rose-400 group-hover:rotate-360 transition-transform duration-500"
              size={18}
            />

            <span className="text-slate-200">Pending Withdrawals</span>

            <span className="absolute top-2 right-3 min-w-6 h-6 px-2 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-slate-900">
              {pendingWithdrawals?.length || 0}
            </span>
          </button>
        </div>

        {/* Bottom Profile */}
        <div className="border-t border-slate-800 p-4">
          {/* Profile Button */}
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="group w-full flex items-center gap-3 p-3 hover:bg-slate-800 transition-all duration-300"
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-300 group-hover:scale-105">
              {admin?.username
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1 text-left">
              <p className="font-medium text-white capitalize">
                {admin?.username}
              </p>
              <p className="text-xs text-cyan-400">Administrator</p>
            </div>

            {/* Arrow */}
            <ChevronUp
              size={18}
              className={`text-slate-400 transition-transform duration-300 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              profileOpen ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border border-slate-700 bg-slate-800 shadow-xl">
              <button
                onClick={() => {
                  navigate("/admin/admin-profile");
                  setProfileOpen(false);
                  setShowSideBar(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
              >
                <User size={18} />
                Profile
              </button>

              <button
                onClick={handleAdminLogout}
                className="flex w-full items-center gap-3 border-t border-slate-700 px-4 py-3 text-red-400 hover:bg-red-500/10 transition cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
