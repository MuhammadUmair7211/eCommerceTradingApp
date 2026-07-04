import { KeyRound, Lock, Phone, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../../config/config";

function AddAdminModal({ setAdminModal }) {
  const [formData, setFormData] = useState({
    username: "",
    profileCode: "",
    phoneNumber: "",
    referralCode: "",
    password: "",
  });

  const generateInvitationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);

    setFormData((prev) => ({
      ...prev,
      referralCode: code,
    }));
  };

  const generateProfileCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    return (
      letters[Math.floor(Math.random() * letters.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      letters[Math.floor(Math.random() * letters.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      letters[Math.floor(Math.random() * letters.length)] +
      numbers[Math.floor(Math.random() * numbers.length)]
    );
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      profileCode: generateProfileCode(),
    }));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${baseUrl}/admins/add-admin`,
        formData,
      );

      if (data.success) {
        setAdminModal(false);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Add New Admin</h2>

          <button
            onClick={() => setAdminModal(false)}
            className="p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X size={18} className="text-slate-300" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm text-slate-400">Username</label>

            <div className="flex items-center gap-2 border border-slate-700 bg-slate-800 px-3 py-2 mt-1 focus-within:border-slate-500">
              <User className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter username"
                className="w-full bg-transparent outline-none text-sm text-white"
              />
            </div>
          </div>

          {/* Profile Code */}
          <div>
            <label className="text-sm text-slate-400">Profile Code</label>

            <div className="flex items-center gap-2 border border-slate-700 bg-slate-800 px-3 py-2 mt-1">
              <User className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={formData.profileCode}
                readOnly
                className="w-full bg-transparent outline-none text-sm text-slate-300"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-slate-400">Phone Number</label>

            <div className="flex items-center gap-2 border border-slate-700 bg-slate-800 px-3 py-2 mt-1 focus-within:border-slate-500">
              <Phone className="w-4 h-4 text-blue-400" />
              <input
                type="text"
                required
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder="+92xxxxxxxxxx"
                className="w-full bg-transparent outline-none text-sm text-white"
              />
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="text-sm text-slate-400">Referral Code</label>

            <div className="flex items-center gap-2 border border-slate-700 bg-slate-800 px-3 py-2 mt-1">
              <KeyRound className="w-4 h-4 text-purple-400" />

              <input
                type="text"
                required
                value={formData.referralCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    referralCode: e.target.value,
                  })
                }
                placeholder="Generate or enter code"
                className="w-full bg-transparent outline-none text-sm text-white"
              />

              <button
                type="button"
                onClick={generateInvitationCode}
                className="text-xs bg-purple-500 hover:bg-purple-600 transition text-white px-2 py-1"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-slate-400">Password</label>

            <div className="flex items-center gap-2 border border-slate-700 bg-slate-800 px-3 py-2 mt-1 focus-within:border-slate-500">
              <Lock className="w-4 h-4 text-red-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password"
                className="w-full bg-transparent outline-none text-sm text-white"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAdminModal(false)}
              className="w-full py-2 border border-slate-700 hover:bg-slate-800 transition text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAdminModal;
