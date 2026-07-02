import { useState } from "react";
import axios from "axios";
import { Smartphone, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../config/config";
export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    referredBy: "",
    phoneNumber: "",
    password: "",
    withdrawalPassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      username: formData.username,
      referredBy: formData.referredBy,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      withdrawalPassword: formData.withdrawalPassword,
    };

    try {
      const { data } = await axios.post(`${baseUrl}/auth/register`, userData);
      if (data.success) {
        toast.success(data.message || "Account created successfully");
        setFormData({
          username: "",
          referredBy: "",
          phoneNumber: "",
          password: "",
          withdrawalPassword: "",
        });
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      console.error("REGISTER ERROR:", err.response?.data || err);
      toast.error(message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${baseUrl}/auth/login`, {
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);

        setFormData({
          phoneNumber: "",
          password: "",
        });
        toast.success("Login successful ✅");
        navigate("/dashboard");
      } else {
        console.log(data.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      console.error("LOGIN ERROR:", err.response?.data || err);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFE600] flex items-center justify-center px-6">
      <div className="max-w-6xl w-full flex items-center justify-between gap-20">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex justify-center">
          <img src="/login.jpg" alt="login" className="w-105" />
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white/60 shadow-2xl p-10 border border-gray-100 max-w-md w-full">
          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="space-y-5 text-xs transition-all duration-500"
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>

              <p className="text-gray-500 mt-2">
                {isLogin ? "Sign in to continue" : "Register to get started"}
              </p>
            </div>
            {!isLogin && (
              <>
                {/* Username */}
                <div className="relative text-lg">
                  <div className="flex items-center border-b border-gray-300 pb-3">
                    <User size={20} className="text-blue-500" />

                    <input
                      type="text"
                      placeholder="enter username"
                      required
                      value={formData.username}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                      }}
                      className="ml-4 outline-none "
                    />
                  </div>
                </div>

                {/* Invitation */}
                <div className="relative text-lg">
                  <div className="flex items-center border-b border-gray-300 pb-3">
                    <User size={20} className="text-blue-500" />

                    <input
                      type="text"
                      placeholder="enter invitation code"
                      required
                      value={formData.referredBy}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          referredBy: e.target.value,
                        });
                      }}
                      className="ml-4 outline-none"
                    />
                  </div>
                </div>
              </>
            )}
            {/* Phone */}
            <div className="relative text-lg">
              <div className="flex items-center border-b border-gray-300 pb-3">
                <Smartphone size={20} className="text-blue-500" />

                <input
                  type="text"
                  placeholder="enter phone number"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      phoneNumber: e.target.value,
                    });
                  }}
                  className="ml-4 outline-none"
                />
              </div>
            </div>
            {/* Password */}
            <div className="relative text-lg">
              <div className="flex items-center border-b border-gray-300 pb-3">
                <Lock size={20} className="text-blue-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="enter password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    });
                  }}
                  className="flex-1 ml-4 outline-none"
                />

                <button
                  className="duration-300 cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* WITHDRAWAL PASSWORD (SIGNUP ONLY) */}
            {!isLogin && (
              <div className="relative text-lg">
                <div className="flex items-center border-b border-gray-300 pb-3">
                  <Lock size={20} className="text-blue-500" />

                  <input
                    type="text"
                    required
                    value={formData.withdrawalPassword}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        withdrawalPassword: e.target.value,
                      });
                    }}
                    placeholder="enter withdrawal password"
                    className="flex-1 ml-4 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between gap-4 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#2B3374] hover:bg-[#2432a1] active:scale-95 text-white py-3 rounded-full transition-all duration-300 font-medium shadow-lg cursor-pointer"
              >
                {isLogin ? "Sign In" : "Register"}
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="flex-1 border border-[#2B3374] text-[#2B3374] py-3 cursor-pointer duration-300 rounded-full hover:bg-blue-50 transition"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
