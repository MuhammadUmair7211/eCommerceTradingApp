import axios from "axios";
import { SaveIcon, SquarePen } from "lucide-react";
import { baseUrl } from "../../../config/config";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";
const InfoCard = ({
  icon,
  label,
  showEditButton,
  onClick,
  value,
  showInput,
  inputValue,
  setInputValue,
  setShowInput,
  setShowEditButton,
}) => {
  const { fetchAdminData } = useApp();

  // handle admin change password
  const handlePasswordSubmitChange = async () => {
    if (inputValue.trim() === "") {
      toast.error("Please enter a password");
      return;
    }
    const token = localStorage.getItem("adminToken");
    try {
      const { data } = await axios.patch(
        `${baseUrl}/admins/change-password`,
        { password: inputValue.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        toast.success(data.message);
        setInputValue("");
        fetchAdminData();
        setShowInput(false);
        setShowEditButton(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };
  return (
    <div className="flex items-center gap-4 border border-slate-700 bg-slate-800 p-3 shadow-lg hover:border-cyan-500 transition-all duration-300 cursor-pointer ">
      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-1 font-medium text-white break-all">{value ?? "-"}</p>
      </div>

      {label === "Password" && showInput && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter new password"
          className="w-full border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />
      )}

      {label === "Password" &&
        (showEditButton ? (
          <button
            title="Change Password"
            onClick={onClick}
            className="rounded-full p-2 text-slate-400 transition-all duration-300 hover:bg-slate-700 hover:text-cyan-400 active:scale-95 cursor-pointer"
          >
            <SquarePen size={18} />
          </button>
        ) : (
          <button
            onClick={handlePasswordSubmitChange}
            title="Save Password"
            className="rounded-full p-2 text-slate-400 transition-all duration-300 hover:bg-slate-700 hover:text-emerald-400 active:scale-95 cursor-pointer"
          >
            <SaveIcon size={18} />
          </button>
        ))}
    </div>
  );
};

export default InfoCard;
