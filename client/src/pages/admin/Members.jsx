import {
  FileText,
  Plus,
  RefreshCcw,
  ShieldCheck,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../components/admin/SearchBar";
import PageHeader from "../../components/admin/PageHeader";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../../components/admin/ProfileModal";
import Pagination from "../../components/admin/Pagination";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editNotesModal, setEditNotesModal] = useState(false);
  const [addOrderModal, setAddOrderModal] = useState(false);
  const [balanceModal, setBalanceModal] = useState(false);
  const itemsPerPage = 10;
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [note, setNote] = useState("");
  const [totalOrders, setTotalOrders] = useState("");
  const [balance, setBalance] = useState("");

  const navigate = useNavigate();

  // FETCH USERS
  const fetchAllUsersAdmin = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(`${baseUrl}/admins/admin-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembers(data.users || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsersAdmin();
  }, []);

  // SAFE SEARCH FILTER
  const filteredMembers = (members || []).filter((member) => {
    const search = searchTerm.toLowerCase();

    return (
      member.username?.toLowerCase().includes(search) ||
      member.phoneNumber?.toString().includes(search) ||
      member.userId?.toLowerCase().includes(search) ||
      member.myInvitationCode?.toLowerCase().includes(search) ||
      member.vipLevel?.toLowerCase().includes(search) ||
      member.balance?.toString().includes(search) ||
      member.isLogin?.toString().includes(search) ||
      member.completedOrders?.toString().includes(search)
    );
  });

  // PAGINATION SAFETY
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / itemsPerPage),
  );

  const handleEditNotes = (member) => {
    setSelectedUser(member);
    setNote(member?.note || "");
    setEditNotesModal(true);
  };
  // api for notes save
  const handleNoteSave = async (user, note) => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/users/edit-notes/${user._id}`,
        { note },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success(data.message || "Notes updated successfully");
      setEditNotesModal(false);
      fetchAllUsersAdmin();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update notes");
    }
  };

  // handle add order
  const handleAddOrder = (member) => {
    setSelectedUser(member);
    setAddOrderModal(true);
  };

  // place orders by admin
  const handlePlaceOrder = async () => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/orders/add-orders/${selectedUser._id}`,
        {
          currentOrders: Number(totalOrders),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success(data.message || "Order updated successfully");
      setAddOrderModal(false);
      fetchAllUsersAdmin();
      setTotalOrders("");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  // clear orders of users
  const clearOrdersHandle = async (member) => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/orders/clear-orders/${member._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(data);
      toast.success(data.message || "Orders cleared successfully");
      fetchAllUsersAdmin(); // refresh UI
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear orders");
    }
  };

  // balance management
  const balanceManagement = (member) => {
    setSelectedUser(member);
    setBalanceModal(true);
  };

  // handle balance
  const handleBalance = async () => {
    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }

    try {
      const { data } = await axios.put(
        `${baseUrl}/users/update-balance/${selectedUser._id}`,
        {
          balance: Number(balance),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );
      toast.success(data.message || "Balance updated successfully");
      setBalanceModal(false);
      fetchAllUsersAdmin();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update balance");
    }
  };

  return (
    <div>
      <div className="bg-slate-900 text-slate-300 border border-slate-700 overflow-hidden p-2">
        {/* HEADER */}
        <PageHeader
          heading="All Members List"
          subheading="Manage all registered members"
        />

        {/* SEARCH */}
        <div className="flex items-center justify-center">
          <span className="text-sm">total members : {members.length}</span>
          <SearchBar
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
            }}
          />
        </div>

        {/* MODAL */}
        <ProfileModal
          open={openProfileModal}
          onClose={() => setOpenProfileModal(false)}
          user={selectedUser}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-450 cursor-pointer">
            <thead className="border border-slate-700">
              <tr className="align-top hover:bg-slate-800 duration-300">
                <th className="p-4 text-left">User Information</th>
                <th className="p-4 text-left">Account Details</th>
                <th className="p-4 text-left">Order Statistics</th>
                <th className="p-4 text-left">Top up/withdraw/wallet</th>
                <th className="p-4 text-left">Upper-level Agent</th>
                <th className="p-4 text-center">Recently Logged In</th>
                <th className="p-4 text-center">Online Status</th>
                <th className="p-4 text-center">Registration Information</th>
                <th className="p-4 text-center">Operate</th>
              </tr>
            </thead>

            <tbody className="">
              {/* LOADING STATE (FIXED - NO DIV INSIDE TBODY ISSUE) */}
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center p-10">
                    Loading members...
                  </td>
                </tr>
              ) : currentMembers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-10">
                    No members found
                  </td>
                </tr>
              ) : (
                currentMembers.map((member) => {
                  return (
                    <tr
                      key={member._id}
                      className="border-t border-slate-700 align-top hover:bg-gray-800 duration-300"
                    >
                      {/* USER INFO */}
                      <td className="p-2 text-xs font-semibold leading-7">
                        <p>username : {member.username}</p>
                        <p>Phone : {member.phoneNumber}</p>
                        <p>Invitation Code : {member.referredBy}</p>
                        <p>Current Level : {member.vipLevel}</p>
                        <p>invitation code : {member.myInvitationCode}</p>
                      </td>

                      {/* ACCOUNT DETAILS */}
                      <td className="p-2 text-xs leading-7">
                        <p className="text-green-600 font-semibold">
                          Account Balance : ${member?.balance?.toFixed(2) || 0}
                        </p>
                        <p>
                          Frozen Amount :{" "}
                          {"$" + member?.frozenAmount?.toFixed(2) || 0}
                        </p>
                        <p className="text-red-500">
                          Difference Amount :{" "}
                          {"$" + member?.difference?.toFixed(2) || 0}
                        </p>
                        <p>
                          Commission Earned :{" "}
                          {member?.commission?.toFixed(2) || 0}%
                        </p>
                      </td>

                      {/* ORDER STATS */}
                      <td className="p-2 text-xs leading-7">
                        <p className="flex items-center gap-4">
                          Remaining Orders :{" "}
                          {member.totalOrders - member.completedOrders}
                        </p>
                        <p>
                          Today's Completed Orders : {member.completedOrders}
                        </p>
                        <p>Total Orders : {member.totalOrders}</p>
                        <p>
                          Cumulative completions :{" "}
                          {member.completedOrders + member.totalOrders}
                        </p>
                        <p>
                          Number of orders received : {member.ordersReceived}
                        </p>
                      </td>

                      {/* WALLET */}
                      <td className="p-2 text-xs leading-7">
                        <p>
                          Total Recharges : {member.recharges?.length} times
                        </p>
                        <p>
                          Total Withdrawals : {member.withdrawals?.length} times
                        </p>
                        <p>Bank Card number : {member.bankCard}</p>
                      </td>

                      {/* AGENT */}
                      <td className="p-2 text-xs leading-7">
                        <p className="text-red-500">
                          parent user : {member?.parentUser || "not available"}
                        </p>
                        <p className="text-green-600">
                          user : {member.adminId || ""}
                        </p>
                      </td>

                      {/* LOGIN INFO */}
                      <td className="p-2 text-xs leading-7 text-center">
                        <p>
                          Login IP at : {member.lastLogin || "not available"}
                        </p>
                        <p className="text-xs text-red-400">
                          ({member.country || "not available"})
                        </p>
                        <p>browser : {member.userAgent || "not available"}</p>
                      </td>

                      {/* STATUS */}
                      <td className="p-2 text-center pt-12">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            member.isOnline
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {member.isOnline ? "Online" : "Offline"}
                        </span>
                      </td>

                      {/* REGISTRATION */}
                      <td className="p-2 text-xs leading-7 text-center">
                        <p>
                          Registered on:{" "}
                          <span className="font-medium">
                            {member.createdAt}
                          </span>
                        </p>
                        <p>
                          ip:{" "}
                          {member.ip === "::1"
                            ? "Localhost (Dev)"
                            : member.ip || "N/A"}
                        </p>
                        <p>({member.country || "not available"})</p>
                        <p>
                          note:
                          <span className="text-red-500 ml-1">
                            {member.note || "-"}
                          </span>
                        </p>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                          {/* Injection Management */}
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/injectionManagement/${member._id}`,
                              )
                            }
                            className="flex items-center justify-center gap-2 px-3 py-2 font-medium bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400 transition-all duration-300 cursor-pointer rounded-md shadow-sm"
                          >
                            <ShieldCheck size={14} />
                            Injection
                          </button>

                          {/* Balance Management */}
                          <button
                            onClick={() => balanceManagement(member)}
                            className="flex items-center justify-center gap-2 px-3 py-2 font-medium bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 cursor-pointer rounded-md"
                          >
                            <Wallet size={14} />
                            Balance
                          </button>

                          {/* Clear Orders */}
                          <button
                            onClick={() => clearOrdersHandle(member)}
                            className="flex items-center justify-center gap-2 px-3 py-2 font-medium bg-slate-900 border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all duration-300 cursor-pointer rounded-md active:scale-95"
                          >
                            <RefreshCcw size={14} />
                            Clear
                          </button>

                          {/* Profile View */}
                          <button
                            onClick={() => {
                              setSelectedUser(member);
                              setOpenProfileModal(true);
                            }}
                            className="flex items-center justify-center gap-2 px-3 py-2 font-medium bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300 cursor-pointer rounded-md"
                          >
                            <User size={14} />
                            Profile
                          </button>

                          {/* Edit Notes */}
                          <button
                            onClick={() => handleEditNotes(member)}
                            className="flex items-center justify-center gap-2 px-3 py-2 font-medium bg-slate-900 border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 cursor-pointer rounded-md"
                          >
                            <FileText size={14} />
                            Notes
                          </button>

                          {/* Add Orders */}
                          <button
                            onClick={() => handleAddOrder(member)}
                            className="flex items-center justify-center gap-2 px-3 py-2 font-medium bg-slate-900 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400 transition-all duration-300 cursor-pointer rounded-md"
                          >
                            <Plus size={14} />
                            Orders
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* notes modal */}
      {editNotesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-slate-100">
                Edit User Notes
              </h2>

              <button
                onClick={() => setEditNotesModal(false)}
                className="text-slate-400 hover:text-red-400 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-4">
              <label className="text-xs text-slate-400">
                Notes for:{" "}
                <span className="font-semibold text-slate-200">
                  {selectedUser?.username}
                </span>
              </label>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full mt-3 bg-slate-800 border border-slate-700 text-slate-200 resize-none p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                rows={6}
                placeholder="Write admin notes here..."
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 p-4 border-t border-slate-800 bg-slate-900">
              <button
                onClick={() => setEditNotesModal(false)}
                className="px-4 py-2 text-xs bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleNoteSave(selectedUser, note)}
                className="px-4 py-2 text-xs bg-blue-600 duration-300 cursor-pointer text-white hover:bg-blue-700 transition shadow-md"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* add order modal */}
      {addOrderModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setAddOrderModal(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-slate-100">
                Add Order
              </h2>

              <button
                onClick={() => setAddOrderModal(false)}
                className="text-slate-400 hover:text-red-400 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-4">
              <label className="text-xs text-slate-400">
                Enter number of orders
              </label>

              <input
                type="text"
                placeholder="e.g. 5"
                value={totalOrders}
                onChange={(e) => setTotalOrders(e.target.value)}
                className="w-full mt-2 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-800 bg-slate-900">
              <button
                onClick={() => setAddOrderModal(false)}
                className="px-4 py-2 text-xs  bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={handlePlaceOrder}
                className="px-4 py-2 text-xs bg-blue-600 duration-300 cursor-pointer text-white hover:bg-blue-700 transition shadow-md"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* balance modal */}
      {balanceModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setBalanceModal(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-slate-100">
                Add Balance
              </h2>

              <button
                onClick={() => setBalanceModal(false)}
                className="text-slate-400 hover:text-red-400 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-4">
              <label className="text-xs text-slate-400">
                Enter balance amount
              </label>

              <input
                type="text"
                placeholder="e.g. 1000"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full mt-2 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-800 bg-slate-900">
              <button
                onClick={() => setBalanceModal(false)}
                className="px-4 py-2 text-xs bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleBalance}
                className="px-4 py-2 text-xs duration-300 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
              >
                Add Balance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
