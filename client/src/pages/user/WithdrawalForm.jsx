import { useState } from "react";
import { Wallet, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";
import BackButton from "../../components/user/BackButton";
function WithdrawalForm() {
  const { user } = useApp();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const walletAddress = user?.bankCard;
  const quickAmounts = [
    100, 200, 500, 1000, 2000, 5000, 10000, 30000, 50000, 100000, 200000,
    500000,
  ];

  const handleFormWithdraw = async () => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/withdrawals/request`,
        {
          amount: Number(amount),
          walletAddress,
          withdrawalPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (data?.success) {
        toast.success(data.message || "Withdrawal request submitted");
        navigate("/withdrawal-history");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Server error. Please try again.";
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      toast.error(message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg p-4">
        <BackButton />
        {/* Title */}
        <h1 className="md:text-2xl font-bold text-center flex items-center justify-center gap-2 mb-4">
          <Wallet />
          Withdraw Funds
        </h1>

        <div className="mb-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Available Balance</p>
                <h2 className="text-3xl font-bold text-green-600 mt-1">
                  $
                  {(
                    (user?.depositAmount ?? 0) + (user?.commission ?? 0)
                  ).toFixed(2)}
                </h2>
              </div>

              <div className="p-3 rounded-full bg-green-100">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <p className="mt-4 mb-2 text-sm font-semibold text-slate-600">
            Quick Amounts
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={`p-3 border border-slate-300 text-sm font-semibold transition duration-300 cursor-pointer 
                ${
                  amount == amt
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-200"
                }`}
            >
              ${amt}
            </button>
          ))}
        </div>
        {/* Wallet */}
        <div className="border border-slate-300 p-4 bg-gray-50 mb-4">
          <p className="text-sm text-gray-500 mb-2">Wallet Address</p>
          <p className="text-xs break-all border border-slate-300 text-gray-700 p-3">
            {walletAddress}
          </p>
        </div>
        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter withdrawal amount"
          value={amount}
          min={1}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border border-slate-300 mb-4 focus:outline-none"
        />

        {/* Password */}
        <div className="relative mb-5">
          <input
            type="password"
            placeholder="Withdrawal password"
            value={withdrawalPassword}
            onChange={(e) => setWithdrawalPassword(e.target.value)}
            className="w-full border p-3 border-slate-300 focus:outline-none"
          />
        </div>

        {/* Rules */}
        <div className="bg-gray-50 border border-slate-300 p-4 text-sm text-gray-600 mb-6 space-y-2">
          <p>1. Complete account verification before withdrawal.</p>
          <p>2. Processing time: 1–30 minutes (up to 24 hours max).</p>
          <p>3. Ensure correct payment details before submitting.</p>
        </div>

        {/* Button */}
        <button
          onClick={handleFormWithdraw}
          className="w-full bg-blue-500 hover:bg-blue-600 duration-300 cursor-pointer text-white py-3 font-semibold flex items-center justify-center gap-2"
        >
          <Zap size={18} />
          Submit Withdrawal
        </button>
      </div>
    </div>
  );
}

export default WithdrawalForm;
