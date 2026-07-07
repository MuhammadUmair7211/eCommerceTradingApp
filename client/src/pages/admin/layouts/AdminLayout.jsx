import { Outlet } from "react-router-dom";
import TopNavbar from "../../../components/admin/TopNavbar";
import SubNavbar from "../../../components/admin/SubNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <TopNavbar />
      <SubNavbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
