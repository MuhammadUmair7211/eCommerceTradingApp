import axios from "axios";
import {
  BadgeCheck,
  Calendar,
  KeyRound,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../config/config";

function AdminProfile() {
  const [admin, setAdmin] = useState(null);


  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const { data } = await axios.get(`${baseUrl}/admin-auth/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(data.admin);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdmin();
  }, []);
  return (
    <div className="min-h-[65vh] bg-gary-100 shadow-lg p-6">
      <div className="max-w-3xl mx-auto shadow-lg border border-slate-800 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <User className="text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold">{admin?.username}</h1>
            <p className="text-slate-400 text-sm">Admin Profile</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div className="border border-slate-700 shadow-lg p-4 flex items-center gap-3">
            <Phone className="text-blue-400" />
            <div>
              <p className="text-xs text-slate-400">Phone Number</p>
              <p>{admin?.phoneNumber}</p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="border border-slate-700 shadow-lg p-4 flex items-center gap-3">
            <KeyRound className="text-green-400" />
            <div>
              <p className="text-xs text-slate-400">Referral Code</p>
              <p>{admin?.referralCode}</p>
            </div>
          </div>

          {/* Profile Code */}
          <div className="border border-slate-700 shadow-lg p-4 flex items-center gap-3">
            <BadgeCheck className="text-yellow-400" />
            <div>
              <p className="text-xs text-slate-400">Profile Code</p>
              <p>{admin?.profileCode}</p>
            </div>
          </div>

          {/* Role */}
          <div className="border border-slate-700 shadow-lg p-4 flex items-center gap-3">
            <ShieldCheck className="text-purple-400" />
            <div>
              <p className="text-xs text-slate-400">Role</p>
              <p className="capitalize">{admin?.role}</p>
            </div>
          </div>

          {/* Team Members */}
          <div className="border border-slate-700 shadow-lg p-4 flex items-center gap-3">
            <Users className="text-pink-400" />
            <div>
              <p className="text-xs text-slate-400">Team Members</p>
              <p>{admin?.teamMembers?.length || 0}</p>
            </div>
          </div>

          {/* Status */}
          <div className="border border-slate-700 shadow-lg p-4 flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                admin?.isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <p>{admin?.isOnline ? "online" : "offline"}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="border border-slate-700 shadow-lg p-4 flex items-center gap-3 md:col-span-2">
            <Calendar className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-400">Created At</p>
              <p>{new Date(admin?.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
