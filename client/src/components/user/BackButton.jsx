import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="text-slate-700 backdrop-blur-md transition-all duration-300 cursor-pointer hover:scale-110"
    >
      <ArrowLeft size={18} />
    </button>
  );
};

export default BackButton;
