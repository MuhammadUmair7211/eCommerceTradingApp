import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../../config/config";
import { useApp } from "../../../context/AppContext";
import Pagination from "./Pagination";

const AdminTable = () => {
  const { allAdmins, loading, getLeaderData } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredAdmins = allAdmins.filter((admin) => {
    const q = search.toLowerCase();

    return (
      admin.username?.toLowerCase().includes(q) ||
      admin.phoneNumber?.includes(q) ||
      admin.invitationCode?.toLowerCase().includes(q) ||
      admin.profileCode?.toLowerCase().includes(q)
    );
  });

  const indexOfLastAdmin = currentPage * itemsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - itemsPerPage;

  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin,
  );

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handleAdminNavigate = (admin) => {
    navigate(`/leader-dashboard/${admin._id}`, {
      state: { admin },
    });
  };

  const handleAdminDelete = async (e, adminId) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${baseUrl}/admins/delete`, {
        data: { adminId },
      });

      if (data.success) {
        toast.success(data.message);
        getLeaderData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete admin");
    }
  };

  return (
    <div className="bg-slate-800 text-slate-300 shadow-lg overflow-hidden border border-slate-700 mt-2 p-2">
      {/* SEARCH */}
      <div className="text-center my-4 px-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by admin id, name, phone"
          className="max-w-5xl w-full bg-slate-900 text-slate-500 border border-slate-700 p-2 outline-none"
        />
      </div>

      {/* HEADER */}
      <div className="p-4 border border-slate-700">
        <h2 className="font-bold text-lg text-white">Admin Members</h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-slate-700">
          {/* HEAD */}
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              {[
                "Username",
                "Phone Number",
                "Referral Code",
                "Team Size",
                "Status",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left font-semibold text-slate-300"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          {/* BODY */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : currentAdmins?.length > 0 ? (
              currentAdmins.map((admin) => {
                return (
                  <tr
                    key={admin?._id}
                    onClick={() => handleAdminNavigate(admin)}
                    className="border-b border-slate-700 hover:bg-slate-700 cursor-pointer transition"
                  >
                    {/* USER */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        {admin?.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        Profile: {admin?.profileCode}
                      </p>
                    </td>

                    {/* PHONE */}
                    <td className="px-6 py-4 text-slate-300">
                      {admin?.phoneNumber}
                    </td>

                    {/* REF CODE */}
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {admin?.referralCode}
                    </td>

                    {/* TEAM */}
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {admin?.teamMembers?.length || 0}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            admin.isOnline ? "bg-green-400" : "bg-red-400"
                          }`}
                        />

                        <span
                          className={`font-medium ${
                            admin?.isOnline ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {admin.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => handleAdminDelete(e, admin._id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition cursor-pointer hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-500">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAdmins.length}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AdminTable;
