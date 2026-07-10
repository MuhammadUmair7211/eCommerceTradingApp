import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function BalanceCard() {
  const { user } = useApp();
  const navigate = useNavigate();
  return (
    <div className="bg-white p-8 shadow-lg relative overflow-hidden">
      <div>
        <h3 className="text-xl md:text-4xl font-bold text-[#2B3374]">
          ${user?.balance?.toFixed(2)}
        </h3>

        <p className="text-gray-500 mt-3 text-lg">Total Balance</p>
      </div>

      <button
        onClick={() => navigate("/topup")}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#2B3374] text-white flex items-center justify-center cursor-pointer duration-300"
      >
        <Plus size={40} />
      </button>

      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#2B3374]" />
    </div>
  );
}
