import { useState } from "react";
import { Shield, Lock, User, EyeOff, Eye } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";
function LeaderAuth() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double clicks
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`${baseUrl}/leader/login`, formData);
      if (data.success) {
        toast.success("Login successful 🎉");
        localStorage.setItem("leaderToken", data.token);
        setFormData({
          username: "",
          password: "",
        });
        setTimeout(() => {
          navigate("/leader-dashboard");
        }, 500);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.log("ERROR FULL:", err);
      const msg =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 p-4 relative overflow-hidden">
      {/* Background Blur */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-lg border border-slate-700/50 bg-slate-800/80 backdrop-blur-xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Shield className="text-white" size={36} />
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white">
            Leader Portal
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Secure login for leadership dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Leader Name
            </label>

            <div className="flex items-center border border-slate-700 bg-slate-900/60 px-4 transition-all duration-300 ">
              <User size={20} className="text-slate-400" />

              <input
                type="text"
                name="leader name"
                autoComplete="leader name"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
                placeholder="Enter Name"
                className="w-full bg-transparent p-3 text-white placeholder:text-slate-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <div className="flex items-center border border-slate-700 bg-slate-900/60 px-4 transition-all duration-300 ">
              <Lock size={20} className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                placeholder="Enter password"
                className="w-full bg-transparent p-3 text-white placeholder:text-slate-500 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-center text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center bg-linear-to-r from-blue-500 to-indigo-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Authenticating...
              </>
            ) : (
              "Login as Leader"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-700 pt-4 text-center">
          <p className="text-xs text-slate-400">Protected Leadership Access</p>
        </div>
      </div>
    </div>
  );
}

export default LeaderAuth;
