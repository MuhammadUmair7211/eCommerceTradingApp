import {
  BadgeDollarSign,
  CalendarDays,
  Clock3,
  CreditCard,
  Fingerprint,
  Globe,
  MapPin,
  Phone,
  Ticket,
  Trophy,
  Wallet,
} from "lucide-react";

const InfoRow = ({ icon, label, value, valueClass = "" }) => (
  <div className="border border-slate-700 bg-slate-900/40 p-2 transition hover:border-slate-600">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </div>

    <p
      className={`mt-2 break-all text-sm font-semibold text-white ${valueClass}`}
    >
      {value}
    </p>
  </div>
);

const UserCard = ({ user, adminUsername }) => {
  return (
    <div className="group flex flex-col justify-between overflow-hidden border border-slate-700 bg-slate-800 shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-700 bg-linear-to-r from-slate-700 to-slate-800 p-2">
        {/* Top Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user?.username}</h2>
              <div className="flex items-center gap-2 text-sm">
                <p className="text-slate-500">referred By:</p>
                <p className="font-medium text-blue-400">
                  {user?.referredBy || "N/A"}{" "}
                  <span className="text-slate-500"> • {adminUsername}</span>
                </p>
              </div>
            </div>
          </div>

          <span
            className={`self-start sm:self-auto rounded-full border px-3 py-1 text-xs font-semibold ${
              user.isOnline
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            ● {user.isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* Balance Section */}
        <div className="mt-4 border border-slate-700 bg-slate-900 p-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Total Balance */}
            <div>
              <div className="flex flex-col items-start gap-2 text-xs uppercase tracking-widest text-slate-400">
                <Wallet size={28} />
                <span>Total Balance</span>
              </div>

              <h3 className="text-lg md:text-2xl font-bold text-green-400">
                ${((user.balance || 0) + (user.commission || 0)).toFixed(2)}
              </h3>
            </div>

            {/* Total Commission */}
            <div>
              <div className="flex flex-col items-start gap-2 text-xs uppercase tracking-widest text-slate-400">
                <BadgeDollarSign size={28} />
                <span>Commission</span>
              </div>

              <h3 className="text-lg md:text-2xl font-bold text-emerald-400">
                ${Number(user.commission || 0).toFixed(2)}
              </h3>
            </div>

            {/* Invitation Code */}
            <div>
              <div className="flex flex-col items-start gap-2 text-xs uppercase tracking-widest text-slate-400">
                <Ticket size={28} />
                <span>My Invitation Code</span>
              </div>

              <h3 className="text-lg md:text-2xl font-bold text-blue-400 break-all">
                {user.myInvitationCode || "N/A"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2">
        <InfoRow
          icon={<Phone size={16} />}
          label="Phone"
          value={user.phoneNumber || "N/A"}
        />

        <InfoRow
          icon={<Ticket size={16} />}
          label="Invitation"
          value={user.myInvitationCode || "N/A"}
        />

        <InfoRow
          icon={<BadgeDollarSign size={16} />}
          label="Commission"
          value={`$${Number(user.commission || 0).toFixed(2)}`}
          valueClass="text-emerald-400"
        />

        <InfoRow
          icon={<Trophy size={16} />}
          label="VIP Level"
          value={user.vipLevel || "VIP0"}
        />
        <InfoRow
          icon={<Fingerprint size={16} />}
          label="User ID"
          value={user._id}
          valueClass="text-xs text-blue-400"
        />

        <InfoRow
          icon={<MapPin size={16} />}
          label="City"
          value={user.city || "N/A"}
        />

        <InfoRow
          icon={<Globe size={16} />}
          label="Country"
          value={user.country || "N/A"}
        />

        <InfoRow
          icon={<Clock3 size={16} />}
          label="Last Login"
          value={
            user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"
          }
        />

        <div className="sm:col-span-2">
          <InfoRow
            icon={<CreditCard size={16} />}
            label="Wallet"
            value={user.bankCard || "N/A"}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-700 bg-slate-900/60 px-5 py-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} />
          Joined
        </div>

        <span>{new Date(user.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default UserCard;
