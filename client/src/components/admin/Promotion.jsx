import { Copy, Link2 } from "lucide-react";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";

const Promotion = () => {
  const { admin } = useApp();

  const referralLink = `https://mercadolibreonline.shop/register?invite_code=${admin?.referralCode}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied successfully!");
  };

  return (
    <div className="bg-slate-800">
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Left */}
        <div className="flex flex-1 items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center bg-cyan-500/10 text-cyan-400">
            <Link2 size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Promotion Link
            </p>

            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm text-slate-300 hover:text-cyan-400"
            >
              {referralLink}
            </a>
          </div>
        </div>

        {/* Right */}
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition active:scale-95 cursor-pointer duration-300 border border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/10"
        >
          <Copy size={16} />
          Copy
        </button>
      </div>
    </div>
  );
};

export default Promotion;
