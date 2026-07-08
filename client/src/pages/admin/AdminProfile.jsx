import {
  BadgeCheck,
  Calendar,
  KeyRound,
  KeySquare,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import InfoCard from "../../components/admin/InfoCard";
import { useState } from "react";

function AdminProfile() {
  const { admin } = useApp();
  const [showEditButton, setShowEditButton] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const profileItems = [
    {
      label: "Phone Number",
      icon: <Phone className="text-blue-400" />,
      value: admin?.phoneNumber,
    },
    {
      label: "Referral Code",
      icon: <KeyRound className="text-green-400" />,
      value: admin?.referralCode,
    },
    {
      label: "Profile Code",
      icon: <BadgeCheck className="text-yellow-400" />,
      value: admin?.profileCode,
    },
    {
      label: "Role",
      icon: <ShieldCheck className="text-purple-400" />,
      value: admin?.role,
    },
    {
      label: "Password",
      icon: <KeySquare className="text-pink-400" />,
      value: admin?.password,
    },
    {
      label: "Status",
      icon: (
        <div
          className={`h-3 w-3 rounded-full ${
            admin?.isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
      ),
      value: admin?.isOnline ? "Online" : "Offline",
    },
  ];
  const handleChangePassword = () => {
    setShowEditButton((prev) => !prev);
    setShowInput((prev) => !prev);
    setInputValue(admin?.password);
  };
  return (
    <div className="min-h-[60vh] bg-gary-100 shadow-lg p-4">
      <div className="max-w-3xl mx-auto shadow-lg border border-slate-800 p-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-5 border-b border-slate-700 pb-5">
          {/* Avatar */}
          <div className="flex h-16 w-16 rounded-full items-center justify-center bg-linear-to-br from-cyan-500 to-blue-600 text-xl font-bold tracking-wide text-white shadow-lg">
            {admin?.username
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold capitalize tracking-wide text-white">
              {admin?.username}
            </h1>

            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className="bg-cyan-500/10 rounded-full px-2 py-1 font-medium text-cyan-400">
                Administrator
              </span>

              <span className="text-slate-400">
                {admin?.teamMembers?.length || 0}{" "}
                {admin?.teamMembers?.length === 1
                  ? "Team Member"
                  : "Team Members"}
              </span>
            </div>
          </div>
        </div>
        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {profileItems.map((item) => (
            <InfoCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              onClick={handleChangePassword}
              showEditButton={showEditButton}
              showInput={showInput}
              inputValue={inputValue}
              setInputValue={setInputValue}
              setShowInput={setShowInput}
              setShowEditButton={setShowEditButton}
            />
          ))}

          <InfoCard
            className="md:col-span-2"
            icon={<Calendar className="text-cyan-400" />}
            label="Created At"
            value={
              admin?.createdAt
                ? new Date(admin.createdAt).toLocaleString()
                : "-"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
