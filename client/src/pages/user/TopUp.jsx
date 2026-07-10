import { Wallet, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/user/BackButton";

function TopUp() {
  const [amount, setAmount] = useState(null);
  const navigate = useNavigate();

  const quickAmounts = [
    100, 200, 500, 1000, 2000, 5000, 10000, 30000, 50000, 100000, 200000,
    500000,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg p-6">
        <BackButton />
        {/* Title */}
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Wallet />
          Account Top-Up
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Select an amount and send payment via USDT-ERC20
        </p>

        {/* Payment Method */}
        <div className="bg-gray-50 p-4 border border-slate-300 mb-5">
          <p className="text-sm text-gray-500 mb-1">Payment Method</p>
          <p className="font-semibold text-blue-600">
            💰 USDT (ERC20) — Ethereum Network
          </p>
        </div>
        {/* Quick Amounts */}
        <div className="mb-5">
          <p className="text-sm text-gray-500 mb-3">Quick Amounts</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`p-3 border border-slate-300 text-sm font-semibold transition
                  ${
                    amount === amt
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <input
          type="number"
          placeholder="Or enter custom amount"
          className="w-full p-3 border border-slate-300 mb-5 focus:outline-none focus:border-blue-500"
          value={amount || ""}
          required
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1 mb-5">
          <p>• Send exact amount in USDT (ERC20) — Ethereum Network</p>
          <p>• Wrong network may result in loss of funds</p>
          <p>• Top-up will reflect after blockchain confirmation</p>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/paymentStatus", { state: { amount } })}
          disabled={!amount}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          <Zap size={18} />
          Confirm Top-Up
        </button>
      </div>
    </div>
  );
}

export default TopUp;
