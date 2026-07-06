import { useState } from "react";
import { Copy, Gift, Share2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
function Invite() {
  const { user } = useApp();
  const [copied, setCopied] = useState(false);

  const inviteLink = `https://mercadolibreonline.shop/register?${user?.myInvitationCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy link", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white shadow-lg p-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2 mb-2">
          <Gift />
          Invite & Earn
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Share your invitation link with friends
        </p>

        {/* Link Box */}
        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          <p className="text-sm text-gray-500 mb-2">Your Invitation Link</p>

          <div className="flex justify-between items-center gap-2">
            <p className="text-xs break-all text-gray-700">{inviteLink}</p>

            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Copied message */}
        {copied && (
          <p className="text-green-600 text-sm text-center mb-4">
            Link copied successfully!
          </p>
        )}

        {/* Info */}
        <div className="border rounded-lg p-4 text-sm text-gray-600 mb-6 space-y-2">
          <p>✔ Share your link with friends</p>
          <p>✔ Earn rewards when they register</p>
          <p>✔ Unlimited referral income potential</p>
        </div>

        {/* Button */}
        <button
          onClick={handleCopy}
          className="w-full bg-[#2B3374] hover:bg-[#0f1a69] text-white py-3 rounded-lg font-semibold flex items-center justify-center cursor-pointer gap-2 duration-300"
        >
          <Share2 size={18} />
          Copy Invitation Link
        </button>
      </div>
    </div>
  );
}

export default Invite;
