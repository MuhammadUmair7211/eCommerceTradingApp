import axios from "axios";
import { Headset, Menu, Plus, RefreshCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../config/config";
import { toast } from "react-toastify";
import { useApp } from "../../../context/AppContext";

const Header = ({ addAdminModal, setAddAdminModal }) => {
  const { allUsers, allPayments, allWithdrawals, allSupports, getLeaderData } =
    useApp();

  useEffect(() => {
    getLeaderData();
  }, []);
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
      <button
        onClick={getLeaderData}
        className="group flex items-center justify-center w-10 h-10 rounded-full 
             bg-white/10 hover:bg-white/20 
             border border-white/10 hover:border-white/30
             shadow-sm hover:shadow-md
             transition-all duration-300 ease-out
             active:scale-95 cursor-pointer"
        title="Refresh data"
      >
        <RefreshCcw
          size={18}
          className="text-gray-300 group-hover:text-slate-300 group-hover:rotate-180 transition-all duration-500"
        />
      </button>
      <button
        onClick={() => navigate("/leader-dashboard/support")}
        className="relative flex items-center justify-center gap-2 px-4 py-2 border border-purple-500 text-purple-600 bg-purple-50 hover:bg-purple-500 hover:text-white transition duration-300 cursor-pointer"
      >
        <Headset size={18} />
        Support
        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ">
          {allSupports?.length}
        </span>
      </button>

      <button
        onClick={() => navigate("/leader-dashboard/recharges")}
        className="relative px-4 py-2 border border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-500 hover:text-white transition duration-300 cursor-pointer"
      >
        Recharges
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {pendingRecharges?.length}
        </span>
      </button>

      <button
        onClick={() => navigate("/leader-dashboard/withdraws")}
        className="relative px-4 py-2 border border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition duration-300 cursor-pointer"
      >
        Withdrawals
        <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {pendingWithdrawals?.length}
        </span>
      </button>

      <button
        onClick={() => navigate("/leader-dashboard/all-users")}
        className="relative px-4 py-2 border border-orange-500 text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer"
      >
        Users
        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {allUsers?.length}
        </span>
      </button>
    </>
  );

  return (
    <div className="mb-6">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        {/* TITLE */}
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Leader Dashboard
          </h1>
          <p className="text-slate-500 text-sm md:text-lg">
            Manage admins and their teams
          </p>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex flex-wrap gap-3">{navButtons}</div>

          <button
            onClick={() => setAddAdminModal(!addAdminModal)}
            className="flex items-center gap-2 border border-blue-200 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 duration-300 cursor-pointer"
          >
            <Plus size={18} />
            Add Admin
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white duration-300 cursor-pointer hover:bg-red-600"
          >
            Logout
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
