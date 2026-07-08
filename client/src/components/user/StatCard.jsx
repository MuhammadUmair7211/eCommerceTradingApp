const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="group relative overflow-hidden border border-slate-700 bg-slate-800 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-slate-500 hover:shadow-xl">
      <div
        className={`absolute left-0 top-0 h-1 w-full ${color.split(" ")[1]}`}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white">{value}</h2>
        </div>
        <div
          className={`flex h-14 w-14 rounded-full items-center justify-center border transition-all duration-300 group-hover:scale-110 ${color}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-5 h-px bg-slate-700" />
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Updated</span>
        <span className="text-slate-400">Live</span>
      </div>
    </div>
  );
};

export default StatCard;
