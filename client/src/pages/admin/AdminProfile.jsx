import {
  BadgeCheck,
  Calendar,
  KeyRound,
  KeySquare,
  Phone,
  ShieldCheck,
  SquarePen,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const InfoCard = ({ icon, label, value, className = "", onAction }) => (
  <div
    className={`flex items-center gap-4 border border-slate-700 bg-slate-800 p-3 shadow-lg hover:border-cyan-500 transition-all duration-300 cursor-pointer ${className}`}
  >
    {/* Icon */}
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
      {icon}
    </div>

    {/* Content */}
    <div className="flex-1">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-white break-all">{value ?? "-"}</p>
    </div>

    {onAction && (
      <button
        title="Change Password"
        onClick={onAction}
        className="rounded-full p-2 text-slate-400 transition-all duration-300 hover:bg-slate-700 hover:text-cyan-400 active:scale-95 cursor-pointer"
      >
        <SquarePen size={18} />
      </button>
    )}
  </div>
);

function AdminProfile() {
  const { admin } = useApp();

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
    console.log("password handle change");
  };
  return (
    <div className="min-h-[60vh] bg-gary-100 shadow-lg p-4">
      <div className="max-w-3xl mx-auto shadow-lg border border-slate-800 p-4">
        {/* Header */}
        <div className="flex items-center gap-5 border-b border-slate-700 pb-4 mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white">
            {admin?.username
              ?.split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white capitalize">
              {admin?.username}
            </h1>

            <p className="text-sm text-cyan-400">Administrator</p>
            <p>{admin?.teamMembers?.length || 0} members</p>
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
              onAction={
                item.label === "Password" ? handleChangePassword : undefined
              }
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
