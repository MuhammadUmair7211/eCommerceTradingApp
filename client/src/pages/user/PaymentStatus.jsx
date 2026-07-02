import { useState } from "react";
import { CheckCircle, Clock, Copy, Upload, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";
import { toast } from "react-toastify";
function PaymentStatus() {
  const { fetchUserProfile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount;
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);

  const walletAddress = "TWNMafbkUJ2oG8bi3N7CJoMZABdeCyY9er";

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(URL.createObjectURL(file));
      setScreenshotFile(file);
    }
  };

  const submitPayment = async () => {
    const formData = new FormData();

    formData.append("amount", amount);
    formData.append("walletAddress", walletAddress);
    formData.append("screenshot", screenshotFile); // IMPORTANT: actual file, not blob

    try {
      const { data } = await axios.post(`${baseUrl}/payments`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (data.success) {
        await fetchUserProfile();
        navigate("/recharge-history");
      }
    } catch (error) {
      if (error.response) {
        console.log("Backend Error:", error.response.data);
        console.log("Status:", error.response.status);
      } else {
        console.log("Network Error:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg p-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Payment Status</h1>
        <p className="text-center text-gray-500 mb-6">
          Upload payment proof to continue
        </p>

        {/* Status */}
        <div className="flex justify-center mb-6">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
      ${screenshot ? "bg-green-100 text-green-700" : "bg-yellow-50 text-yellow-700"}
    `}
          >
            <Clock size={18} />

            {screenshot ? "Proof uploaded" : "Waiting for Payment Proof"}
          </div>
        </div>

        {/* Amount */}
        <div className="border border-slate-300 p-4 bg-gray-50 mb-5">
          <p className="text-sm text-gray-500">Amount to Send</p>
          <p className="text-lg font-bold">${amount} USDT</p>
        </div>

        {/* Wallet */}
        <div className="border border-slate-300 p-4 bg-gray-50 mb-5">
          <p className="text-sm text-gray-500 mb-2">Wallet Address</p>

          <div className="flex justify-between items-center gap-2">
            <p className="text-xs break-all text-gray-700 flex-1">
              {walletAddress}
            </p>

            <button
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                toast.success("Wallet address copied!");
              }}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition cursor-pointer duration-300"
            >
              <Copy size={16} />
              Copy
            </button>
          </div>
        </div>

        {/* Upload */}
        <div className="border border-slate-300 p-4 bg-gray-50 mb-5">
          <p className="text-sm text-gray-500 mb-2">
            Upload Payment Screenshot
          </p>

          <label className="flex items-center justify-center gap-2 border border-dashed p-3 rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload size={18} />
            Upload Image
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleUpload}
              className="hidden"
            />
          </label>

          <div className="flex flex-col items-center mt-3 relative">
            {screenshot && (
              <div className="relative">
                <img
                  src={screenshot}
                  alt="proof"
                  className="max-h-40 rounded-lg border shadow-sm"
                />

                {/* Remove button */}
                <button
                  onClick={() => setScreenshot(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 duration-300 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 mb-5 space-y-1">
          <p>• Send only USDT (TRC20)</p>
          <p>• Upload clear screenshot</p>
          <p>• Verification will be done manually</p>
        </div>

        {/* Submit */}
        <button
          onClick={submitPayment}
          disabled={!screenshot}
          className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-3 duration-300 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <CheckCircle size={18} />
          Submit Payment Proof
        </button>

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-3 border border-slate-300 p-4 bg-gray-50  py-3 rounded-lg hover:bg-gray-50 duration-300 cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PaymentStatus;
