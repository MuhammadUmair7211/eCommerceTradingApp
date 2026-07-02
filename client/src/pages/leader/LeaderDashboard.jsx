import { useState } from "react";
import LeaderCard from "./components/LeaderCard";
import StatsCard from "./components/StatsCard";
import AdminTable from "./components/AdminTable";
import Header from "./components/Header";
import AddAdminModal from "./components/AddAdminModal";
function LeaderDashboard() {
  const [adminModal, setAdminModal] = useState(false);

  return (
    <div className="p-2 bg-slate-900  text-slate-300 min-h-screen">
      {/* Header */}
      <Header adminModal={adminModal} setAddAdminModal={setAdminModal} />

      {/* Leader Card */}
      <LeaderCard />

      {/* Stats */}
      <StatsCard />

      {/* Admin Table */}
      <AdminTable />

      {adminModal && <AddAdminModal setAdminModal={setAdminModal} />}
    </div>
  );
}
export default LeaderDashboard;
