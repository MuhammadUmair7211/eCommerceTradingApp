import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";
import { Crown, FileText, Lock, Phone, User, Wallet } from "lucide-react";
import Pagination from "../../components/admin/Pagination";
import { useApp } from "../../context/AppContext";
const InjectionManagement = () => {
  const { adminInjections, setAdminInjections, fetchAdminData } = useApp();
  console.log(adminInjections);

  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [injectionModal, setInjectionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    injectionOrder: "",
    commissionRate: "",
    fixedCommission: "",
    injectionCost: "",
  });

  // create injection
  const createInjection = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const { data } = await axios.post(
        `${baseUrl}/injections/create`,
        {
          ...formData,
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        setAdminInjections((prev) => [data.injection, ...prev]);
        setFormData({
          injectionOrder: "",
          commissionRate: "",
          fixedCommission: "",
          injectionCost: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.message);
    }
  };

  // update injection status
  const handleInjectionTaskComplete = async (item) => {
    if (!item) return;
    try {
      const { data } = await axios.put(
        `${baseUrl}/injections/update-injection-status/${item._id}`,
      );

      if (data?.success) {
        toast.success(data.message);
        fetchAdminData();
      } else {
        toast.error(data?.message || "Failed to update");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // handle injection reject
  const handleInjectionReject = async (item) => {
    try {
      const { data } = await axios.put(
        `${baseUrl}/injections/reject/${item._id}`,
      );
      console.log(data);

      if (data?.success) {
        toast.success(data.message);
        fetchAdminData();
      } else {
        toast.error(data?.message || "Failed to reject");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Server error");
    }
  };

  // delete injection
  const handleInjectionDelete = async (item) => {
    try {
      // optional confirmation (very important)
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this injection?",
      );
      if (!confirmDelete) return;
      const { data } = await axios.delete(
        `${baseUrl}/injections/delete-injection/${item._id}`,
      );
      if (data?.success) {
        toast.success(data.message);
        fetchAdminData();
      } else {
        toast.error(data?.message || "Delete failed");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Server error");
    }
  };

  useEffect(() => {
    // get user info from params id
    const fetchUserInfoInjectionPage = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/users/${id}`);

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUserInfoInjectionPage();
  }, [id]);

  const headers = [
    "ID",
    "UID",
    "Injection orders",
    "Commission rate",
    "Injection cost",
    "Fixed Commission",
    "Task difference",
    "Is it completed?",
    "Task Number",
    "Completion/rejection time",
    "Creation time",
    "Operate",
    "action",
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setInjectionModal(false);
    await createInjection();
  };

  const handleInjectionForUser = () => {
    setInjectionModal(!injectionModal);
  };

  const itemsPerPage = 5;

  const totalPages = Math.max(
    1,
    Math.ceil(adminInjections.length / itemsPerPage),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentInjections = adminInjections.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  return (
    <div className="bg-slate-800 text-slate-300 border border-slate-700 overflow-hidden p-2">
      {/* header */}
      <div className="border border-slate-700 flex flex-wrap items-center justify-between p-2">
        <h2 className="font-semibold text-lg">
          UID: {user?.myInvitationCode} Vaccination Plan
        </h2>

        <button
          onClick={handleInjectionForUser}
          className="bg-teal-500 hover:bg-teal-600 cursor-pointer px-4 py-2 text-sm font-medium duration-300"
        >
          Add Injection
        </button>
      </div>

      {/* Information Card */}
      <div className="mt-2 border border-slate-700 bg-slate-900/40 overflow-hidden">
        {/* Description */}
        <div className="border-b border-slate-700 bg-slate-800/40 p-4">
          <p className="text-sm leading-7 text-slate-300">
            <span className="font-semibold text-white">Injection:</span>{" "}
            Increases the amount of a user's fixed order.
            <br />
            <span className="font-semibold text-white">Calculation:</span>{" "}
            Principal × Additional Amount × Injection Increment = Order Amount
          </p>
        </div>

        {/* User Details */}
        <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3">
          {/* Username */}
          <div className="border border-slate-700 bg-slate-800/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {user?.username?.[0]?.toUpperCase() || "N"}
              </div>

              <div>
                <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-slate-400">
                  <User size={14} className="text-blue-400" />
                  Username
                </p>
                <p className="mt-1 font-semibold text-white">
                  {user?.username || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="border border-slate-700 bg-slate-800/50 p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
              <Phone size={15} className="text-green-400" />
              Phone Number
            </p>
            <p className="mt-2 font-semibold text-white">
              {user?.phoneNumber || "N/A"}
            </p>
          </div>

          {/* VIP */}
          <div className="border border-slate-700 bg-slate-800/50 p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
              <Crown size={15} className="text-yellow-400" />
              VIP Level
            </p>
            <p className="mt-2 font-semibold text-yellow-400">
              {user?.vipLevel || "N/A"}
            </p>
          </div>

          {/* Balance */}
          <div className="border border-slate-700 bg-slate-800/50 p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
              <Wallet size={15} className="text-emerald-400" />
              Balance
            </p>
            <p className="mt-2 text-lg font-bold text-emerald-400">
              ${(user?.balance ?? 0).toFixed(2)}
            </p>
          </div>

          {/* Frozen */}
          <div className="border border-slate-700 bg-slate-800/50 p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
              <Lock size={15} className="text-red-400" />
              Frozen Amount
            </p>
            <p className="mt-2 text-lg font-bold text-red-400">
              ${(user?.frozenAmount ?? 0).toFixed(2)}
            </p>
          </div>

          {/* Remarks */}
          <div className="border border-slate-700 bg-slate-800/50 p-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
              <FileText size={15} className="text-purple-400" />
              Remarks
            </p>
            <p className="mt-2 font-medium text-slate-200">
              {user?.note || "No remarks"}
            </p>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full min-w-450 cursor-pointer">
          <thead className="border border-slate-700">
            <tr className="align-center hover:bg-slate-900 duration-300">
              {headers.map((t, index) => (
                <th
                  key={index}
                  className="p-4 text-left border border-slate-700"
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentInjections?.length > 0 ? (
              currentInjections?.map((item, index) => {
                console.log(item);

                return (
                  <tr
                    key={item._id}
                    className="border border-slate-700 align-middle text-center hover:bg-gray-900 duration-300"
                  >
                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      {indexOfFirstItem + index + 1}
                    </td>

                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      {item?.user.myInvitationCode}
                    </td>

                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      {item.injectionOrder}
                    </td>

                    <td className="p-2 text-xs text-yellow-500 font-bold leading-7 border border-slate-700">
                      {item?.commissionRate || 0}%
                    </td>

                    <td className="p-2 text-xs text-red-500 font-bold leading-7 border border-slate-700">
                      ${item?.injectionCost || 0}
                    </td>

                    <td className="p-2 text-xs text-green-500 font-bold leading-7 border border-slate-700">
                      ${item?.fixedCommission || 0}
                    </td>

                    <td className="p-2 text-red-500 text-xs text-center align-middle border border-slate-700">
                      ${(item?.injectionCost ?? 0).toFixed(2)}
                    </td>

                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item?.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item?.status}
                      </span>
                    </td>

                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      TASK-{item._id}
                    </td>

                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      {item?.status === "completed" && item?.completedAt && (
                        <span className="text-green-600">
                          {new Date(item?.completedAt).toLocaleString()}
                        </span>
                      )}

                      {item?.status === "rejected" && item?.rejectedAt && (
                        <span className="text-red-600">
                          {new Date(item?.rejectedAt).toLocaleString()}
                        </span>
                      )}

                      {item?.status === "pending" && (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      {new Date(item?.createdAt).toLocaleString()}
                    </td>

                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      <select
                        disabled={
                          item?.status === "completed" ||
                          item?.status === "rejected"
                        }
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "completed") {
                            handleInjectionTaskComplete(item);
                          }

                          if (value === "delete") {
                            handleInjectionDelete(item);
                          }
                          if (value === "rejected") {
                            handleInjectionReject(item);
                          }

                          e.target.value = "";
                        }}
                        className={`border border-slate-700 px-2 py-1 text-xs cursor-pointer ${
                          item?.status === "completed" ||
                          item?.status === "rejected"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="" className="bg-slate-900">
                          Select
                        </option>
                        <option value="completed" className="bg-slate-900">
                          Complete
                        </option>
                        <option value="rejected" className="bg-slate-900">
                          Reject
                        </option>
                      </select>
                    </td>
                    <td className="p-2 text-xs leading-7 border border-slate-700">
                      <button
                        className="bg-red-500 text-white px-2 py-1 border-none cursor-pointer duration-300 hover:bg-red-600"
                        onClick={() => handleInjectionDelete(item)}
                      >
                        delete injection
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className="text-center py-10 text-gray-500">
                  No injections found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {injectionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleFormSubmit}
            className="max-w-4xl w-full bg-slate-900 border border-slate-700 overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between bg-slate-800 border-b border-slate-700 px-5 py-4">
              <h3 className="font-semibold text-lg text-white">
                Add Injection
              </h3>

              <button
                type="button"
                onClick={() => setInjectionModal(false)}
                className="text-slate-400 hover:text-white duration-300 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-6">
              {/* Injection Orders */}
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                <label className="md:w-48 text-sm font-semibold text-slate-300 pt-2">
                  Injection Orders
                </label>

                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.injectionOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        injectionOrder: e.target.value,
                      })
                    }
                    placeholder="Injection for designated orders"
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2 text-slate-200 outline-none focus:border-slate-500"
                  />

                  <p className="text-xs text-slate-400 mt-1">0 = Next order</p>
                </div>
              </div>

              {/* Commission Rate */}
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                <label className="md:w-48 text-sm font-semibold text-slate-300 pt-2">
                  Commission Rate (%)
                </label>

                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRate: e.target.value,
                      })
                    }
                    placeholder="Specify commission rate"
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2 text-slate-200 outline-none focus:border-slate-500"
                  />

                  <p className="text-xs text-slate-400 mt-1">
                    0 = No commission rate set (50 = 50%)
                  </p>
                </div>
              </div>

              {/* Fixed Commission */}
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                <label className="md:w-48 text-sm font-semibold text-slate-300 pt-2">
                  Fixed Commission
                </label>

                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.fixedCommission}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fixedCommission: e.target.value,
                      })
                    }
                    placeholder="Fixed commission amount"
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2 text-slate-200 outline-none focus:border-slate-500"
                  />

                  <p className="text-xs text-slate-400 mt-1">
                    0 = No fixed commission set
                  </p>
                </div>
              </div>

              {/* Injection Cost */}
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                <label className="md:w-48 text-sm font-semibold text-slate-300 pt-2">
                  Injection Cost
                </label>

                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.injectionCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        injectionCost: e.target.value,
                      })
                    }
                    placeholder="Injection cost"
                    className="w-full bg-slate-800 border border-slate-700 px-4 py-2 text-slate-200 outline-none focus:border-slate-500"
                  />

                  <p className="text-xs text-slate-400 mt-1">
                    0 = No injection amount set
                  </p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setInjectionModal(false)}
                  className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 duration-300 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 duration-300 cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={adminInjections.length}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default InjectionManagement;
