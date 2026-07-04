import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Headset,
  House,
  Menu,
  RefreshCcw,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";

const Navbar = () => {
  const { fetchUserProfile } = useApp();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${baseUrl}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        navigate("/", { replace: true });
        localStorage.removeItem("token");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Order", path: "/order" },
    { name: "Grab Order", path: "/grabOrder" },
    { name: "Invite", path: "/invite" },
    { name: "Account", path: "/account" },
    { name: "Withdrawal History", path: "/withdrawal-history" },
    { name: "Recharge/TopUp History", path: "/recharge-history" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#FFE600] shadow-md">
        <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="w-12 md:w-16" />
            <h1 className="font-bold text-lg lg:text-xl text-blue-600">
              MercadoLibre
            </h1>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* CENTER NAV (DESKTOP ONLY) */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((nav) => (
              <NavLink
                key={nav.path}
                to={nav.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                    : "text-gray-600 hover:text-blue-600 transition"
                }
              >
                {nav.name}
              </NavLink>
            ))}
          </div>

          {/* RIGHT SIDE (DESKTOP ONLY) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {currentTime.toLocaleDateString()}
              </p>
              <p className="text-sm font-medium text-gray-700">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => {
                console.log("Refreshing user profile...");
                fetchUserProfile();
              }}
              className="group flex items-center justify-center w-10 h-10 rounded-full 
             bg-slate-800 hover:bg-slate-600
             border border-white/10 hover:border-white/30
             shadow-sm hover:shadow-md
             transition-all duration-300 ease-out
             active:scale-95 cursor-pointer"
              title="Refresh data"
            >
              <RefreshCcw
                size={18}
                className="text-blue-300 group-hover:text-slate-300 group-hover:rotate-180 transition-all duration-500"
              />
            </button>
            <button
              onClick={handleSignOut}
              className="bg-[#2B3374] hover:bg-[#4c5281] text-white px-4 py-2 text-sm transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t shadow-lg px-4 py-3 space-y-2">
            {/* LINKS */}
            {navLinks.map((nav) => (
              <NavLink
                key={nav.path}
                to={nav.path}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-[#2B3374] hover:text-[#2B3374]"
              >
                {nav.name}
              </NavLink>
            ))}

            {/* TIME */}
            <div className="pt-2 border-t text-sm text-gray-500">
              {currentTime.toLocaleString()}
            </div>

            {/* SIGN OUT */}
            <button
              onClick={() => {
                handleSignOut();
                setMobileOpen(false);
              }}
              className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-2 text-sm"
            >
              Sign Out
            </button>
          </div>
        )}
      </nav>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-300 shadow-lg lg:hidden">
        <div className="grid grid-cols-5 h-14">
          {[
            {
              title: "Home",
              icon: <House size={22} />,
              path: "/dashboard",
            },
            {
              title: "Orders",
              icon: <ClipboardList size={22} />,
              path: "/order",
            },
            {
              title: "Grab",
              icon: <ShoppingBag size={24} />,
              path: "/grabOrder",
            },
            {
              title: "Service",
              icon: <Headset size={22} />,
              path: "/user-support",
            },
            {
              title: "Account",
              icon: <User size={22} />,
              path: "/account",
            },
          ].map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center h-full transition-all duration-300 ${
                  isActive ? "-mt-1" : "text-gray-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute -top-2 w-16 h-16 rounded-full bg-blue-800 shadow-lg"></div>
                  )}

                  <div
                    className={`relative z-10 flex flex-col items-center ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px]">{item.title}</span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
