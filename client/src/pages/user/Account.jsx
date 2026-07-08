import { ChevronRight, Lock, User, CreditCard, Headset } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import BackButton from "../../components/user/BackButton";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const hasBankCard = user?.bankCard && user.bankCard.toLowerCase() !== "none";

  return (
    <div className="px-4 py-6 relative">
      <div className="max-w-md mx-auto space-y-5">
        {/* HEADER */}
        <div className="flex items-center justify-center gap-2">
          <BackButton />
          <User className="text-[#2B3374]" size={24} />
          <h2 className="text-2xl font-bold text-[#2B3374]">Personal Center</h2>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-[#2B3374] p-6 shadow-2xl text-white">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <User size={46} />
              </div>

              <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-[#2B3374] rounded-full"></span>
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {user?.username || "User"}
            </h2>

            <p className="text-blue-100 text-sm mt-1">
              UID: {user?._id?.slice(-8)}
            </p>

            <div className="mt-3 bg-white/10 px-4 py-2 rounded-full text-xs text-blue-100">
              Invitation Code: {user?.myInvitationCode || "----"}
            </div>
          </div>

          {/* Bank Card */}
          <button
            onClick={() => navigate("/bankCardAddress")}
            className="w-full mt-6 bg-white rounded-2xl p-4 flex items-center justify-between hover:scale-[1.02] transition duration-300"
          >
            <div className="flex items-center gap-3">
              <CreditCard
                size={22}
                className={hasBankCard ? "text-green-600" : "text-red-500"}
              />

              <div className="text-left">
                <p className="font-medium text-gray-800">Bank Card</p>

                <p className="text-xs text-gray-500">
                  {hasBankCard
                    ? "Manage your linked bank card"
                    : "Add a bank card for withdrawals"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasBankCard ? (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Bound
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                  Not Bound
                </span>
              )}

              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </button>
        </div>

        {/* SECURITY SETTINGS */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">
              Security Settings
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Manage passwords and account protection
            </p>
          </div>

          {/* Support Button */}
          <div className="p-4 border-b border-gray-100">
            <button
              onClick={() => navigate("/user-support")}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 transition duration-300 shadow-lg cursor-pointer"
            >
              <Headset size={18} />
              Contact Support
            </button>
          </div>

          {/* Login Password */}
          <button
            onClick={() => navigate("/change-password")}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Lock size={20} className="text-blue-600" />
              </div>

              <div className="text-left">
                <p className="font-semibold text-gray-800">Login Password</p>
                <p className="text-xs text-gray-500">
                  Change your login password
                </p>
              </div>
            </div>

            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
