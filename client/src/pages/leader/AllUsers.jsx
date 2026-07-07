import { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";
import UserCard from "./components/UserCard";
import Pagination from "./components/Pagination";
function AllUsers() {
  const { allUsers, loading, getLeaderData } = useApp();

  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 🔍 SEARCH FILTER
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const q = search.toLowerCase();

      return (
        u.username?.toLowerCase().includes(q) ||
        u.phoneNumber?.toLowerCase().includes(q) ||
        u.referralCode?.toLowerCase().includes(q) ||
        u.myInvitationCode?.toLowerCase().includes(q)
      );
    });
  }, [allUsers, search]);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFormSubmit = async (e, id) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `${baseUrl}/users/update-users-leader/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getLeaderData();
        setSelectedUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-screen p-4 bg-slate-900 text-slate-300">
        <h1 className="text-xl font-bold mb-2">All Users Information</h1>
        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by name, phone, referral..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-slate-700 px-3 py-3 w-full shadow-lg outline-none"
        />
        {loading ? (
          <div className="text-center ">Loading...</div>
        ) : paginatedUsers?.length === 0 ? (
          <div className="text-center ">No users found</div>
        ) : (
          <div className="bg-slate-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {paginatedUsers?.map((user) => {
              return (
                <UserCard
                  key={user?._id}
                  user={user}
                  adminUsername={user?.adminId?.username}
                  showEditButton={true}
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData(user);
                  }}
                />
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={allUsers.length}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {selectedUser && formData && (
        <div className="fixed inset-0 z-999 flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />

          {/* MODAL */}
          <form
            onSubmit={(e) => handleFormSubmit(e, selectedUser?._id)}
            className="relative bg-slate-800 text-slate-400 w-full max-w-6xl shadow-2xl p-6 z-10"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-red-500 font-bold cursor-pointer hover:scale-110 transition duration-300"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-6">Edit User Profile</h2>

            {/* FORM GRID */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Username */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  Username
                </label>
                <input
                  name="username"
                  value={formData.username || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
                  placeholder="Enter username"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  phone number
                </label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
                  placeholder="Enter phone"
                />
              </div>

              {/* Balance */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">Balance</label>
                <input
                  type="number"
                  value={formData.balance || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      balance: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>

              {/* Bank Card */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  Bank Card
                </label>
                <input
                  value={formData.bankCard || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankCard: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                  placeholder="Card number"
                />
              </div>

              {/* Commission */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  Commission
                </label>
                <input
                  type="number"
                  value={formData.commission || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>

              {/* Completed Orders */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  completed orders
                </label>
                <input
                  type="number"
                  value={formData.completedOrders || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      completedOrders: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>

              {/* Joined */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">Joined</label>

                <input
                  type="date"
                  value={
                    formData.createdAt
                      ? new Date(formData.createdAt).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      createdAt: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300 cursor-pointer"
                />
              </div>

              {/* Difference */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  Difference
                </label>
                <input
                  type="number"
                  value={formData.difference || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difference: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>

              {/* Frozen Amount */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  Frozen Amount
                </label>
                <input
                  type="number"
                  value={formData.frozenAmount || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frozenAmount: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>

              {/* Invitation Code */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  Invitation Code
                </label>
                <input
                  value={formData.myInvitationCode || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      myInvitationCode: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">Role</label>
                <input
                  value={formData.role || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                  placeholder="user / admin / leader"
                />
              </div>

              {/* VIP Level */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  VIP Level
                </label>
                <input
                  value={formData.vipLevel || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vipLevel: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>

              {/* password */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  password
                </label>
                <input
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>
              {/* withdrawal password */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">
                  withdrawal password
                </label>
                <input
                  value={formData.withdrawalPassword || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      withdrawalPassword: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 transition duration-300"
                />
              </div>

              {/* Note */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-xs text-gray-500 md:mb-1">Note</label>
                <textarea
                  value={formData.note || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      note: e.target.value,
                    })
                  }
                  className="border p-2 rounded hover:border-blue-400 resize-none transition duration-300 outline-none"
                  placeholder="Add internal note about user..."
                  rows={3}
                />
              </div>

              {/* Active */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 md:mb-1">Status</label>
                <select
                  value={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "true",
                    })
                  }
                  className="border p-2 rounded cursor-pointer hover:border-blue-400 transition duration-300"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 md:mt-6">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default AllUsers;
