import { ChevronRight, Wallet, Lock } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";
function BankAddress() {
  const { user, fetchUserProfile } = useApp();
  const navigate = useNavigate();
  const [bankCardAddress, setBankCardAddress] = useState(
    () => user?.bankCard || "",
  );
  const [withdrawalPassword, setWithdrawalPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${baseUrl}/users/bind-bank-card`, {
        userId: user._id,
        bankCard: bankCardAddress,
        withdrawalPassword,
      });

      if (data?.success === true) {
        toast.success(data.message || "Success");
        setBankCardAddress("");
        setWithdrawalPassword("");
        navigate("/account");
        await fetchUserProfile();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log("ERROR:", error);
      console.log("FULL ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Server error. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-4">
          Bind Wallet
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          {/* Card */}
          <div className="bg-white shadow-lg overflow-hidden hover:shadow-2xl duration-300">
            {/* Network */}
            <div className="border-b border-gray-200">
              <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-blue-50 duration-300 cursor-pointer">
                <div>
                  <p className="text-sm text-gray-500">Network</p>
                  <p className="font-semibold text-gray-800">
                    USDT (ERC20) — Ethereum Network
                  </p>
                </div>

                <ChevronRight className="text-gray-400" size={20} />
              </button>
            </div>

            {/* Wallet Address */}
            <div className="px-6 py-5 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USDT Wallet Address
              </label>

              <div className="flex items-center gap-3">
                <Wallet className="text-green-500" size={22} />

                <input
                  type="text"
                  value={bankCardAddress}
                  required
                  onChange={(e) => setBankCardAddress(e.target.value)}
                  placeholder="Enter your USDT (ERC20) wallet address"
                  className="w-full outline-none border border-gray-200 px-4 py-3  duration-300"
                />
              </div>
            </div>

            {/* Withdrawal Password */}
            <div className="px-6 py-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Password
              </label>

              <div className="flex items-center gap-3">
                <Lock className="text-blue-500" size={22} />

                <input
                  type="password"
                  value={withdrawalPassword}
                  required
                  onChange={(e) => setWithdrawalPassword(e.target.value)}
                  placeholder="Enter withdrawal password"
                  className="w-full outline-none border border-gray-200 px-4 py-3  duration-300"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-5 bg-yellow-50 cursor-pointer border border-yellow-200 shadow-lg p-5 hover:shadow-xl duration-300">
            <h3 className="font-semibold text-yellow-700 mb-3 ">
              Important Notice
            </h3>

            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Please enter the correct USDT wallet address.</li>
              <li>• Ensure the selected network matches your wallet.</li>
              <li>• Incorrect information may result in withdrawal failure.</li>
              <li>• Use your withdrawal password to confirm wallet binding.</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-[#2B3374] hover:bg-[#091466] hover:scale-[1.02] text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl duration-300 cursor-pointer"
          >
            Bind Wallet
          </button>
        </form>
      </div>
    </div>
  );
}
export default BankAddress;
