import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-2 text-white font-semibold shadow-lg transition-all hover:from-blue-700 hover:to-cyan-600 hover:scale-105 active:scale-95 cursor-pointer my-4 duration-300"
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
