import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";
const InjectionManagement = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [injectionModal, setInjectionModal] = useState(false);
  const [injections, setInjections] = useState([]);
  const [formData, setFormData] = useState({
    injectionOrder: "",
    commissionRate: "",
    fixedCommission: "",
    injectionCost: "",
  });

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

  // create injection
  const createInjection = async () => {
    try {
      const { data } = await axios.post(`${baseUrl}/injections/create`, {
        ...formData,
        userId: id,
      });

      if (data.success) {
        toast.success(data.message);
        setFormData({
          injectionOrder: "",
          commissionRate: "",
          fixedCommission: "",
          injectionCost: "",
        });
        fetchUserInjections();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.message);
    }
  };

  // get user injection
  const fetchUserInjections = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/injections/${id}`);
      if (data.success) {
        setInjections(data.injections);
      }
    } catch (error) {
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
        fetchUserInjections();
        setInjections((prev) =>
          prev.map((inj) =>
            inj._id === item._id ? { ...inj, status: "completed" } : inj,
          ),
        );
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
        fetchUserInjections();
        setInjections((prev) =>
          prev.map((inj) =>
            inj._id === item._id ? { ...inj, status: "rejected" } : inj,
          ),
        );
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
        fetchUserInjections();
      } else {
        toast.error(data?.message || "Delete failed");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchUserInjections();
    fetchUserInfoInjectionPage();
    handleInjectionTaskComplete();
  }, []);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setInjectionModal(false);
    createInjection();
  };

  const handleInjectionForUser = () => {
    if (user?.currentCycleOrders > 0) {
      setInjectionModal(!injectionModal);
    } else {
      toast.error("No injection can be added as, no orders are assigned");
    }
  };
  return (
    <div>
      <div className="bg-slate-900 text-gray-300 flex items-center justify-between p-4">
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
      <div className="border border-slate-700 p-4 text-sm leading-7">
        <p>
          <strong>Injection:</strong> This refers to increasing the amount on a
          user's fixed order. Calculation method: User's principal × Additional
          amount × Injection increment = Order amount.
        </p>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Mobile:</strong> {user?.phoneNumber}
          </p>
          <p>
            <strong>Level:</strong> {user?.vipLevel}
          </p>
          <p>
            <strong>Balance: </strong>
            {"$" + user?.balance.toFixed(2)}
          </p>
          <p>
            <strong>Frozen:</strong> {"$" + user?.frozenAmount.toFixed(2)}
          </p>
          <p>
            <strong>Remarks:</strong> {user?.note || "no note"}
          </p>
        </div>
      </div>
      <div className="mt-2 border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-450">
            <thead className="border border-slate-700">
              <tr className="align-center hover:bg-slate-800 duration-300">
                {headers.map((t, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider"
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-gray-600">
              {injections?.length > 0 ? (
                injections?.map((item, index) => {
                  return (
                    <tr
                      key={item._id}
                      className="border-t border-slate-700 text-center hover:bg-gray-800 duration-300"
                    >
                      <td className="p-3 text-sm">{index + 1}</td>

                      <td className="p-3 text-sm">
                        {item?.user.myInvitationCode}
                      </td>

                      <td className="p-3 text-sm">{item.injectionOrder}</td>

                      <td className="p-3 text-sm">
                        {item?.commissionRate || 0}%
                      </td>

                      <td className="p-3 text-sm text-red-500 font-medium">
                        ${item?.injectionCost || 0}
                      </td>

                      <td className="p-3 text-sm text-green-600 font-medium">
                        ${item?.fixedCommission || 0}
                      </td>

                      <td className="p-3 text-sm">filterData?.difference</td>

                      <td className="p-3">
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

                      <td className="p-3 text-sm font-medium">
                        TASK-{item.id}
                      </td>

                      <td className="p-3 text-sm">
                        {item?.status === "completed" && item?.completedAt && (
                          <span className="text-green-600">
                            {new Date(item.completedAt).toLocaleString()}
                          </span>
                        )}

                        {item?.status === "rejected" && item?.rejectedAt && (
                          <span className="text-red-600">
                            {new Date(item.rejectedAt).toLocaleString()}
                          </span>
                        )}

                        {item?.status === "pending" && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      <td className="p-3 text-sm">
                        {new Date(item?.createdAt).toLocaleString()}
                      </td>

                      <td className="p-3">
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
                          className={`border rounded-lg px-2 py-1 text-xs cursor-pointer bg-white ${
                            item?.status === "completed" ||
                            item?.status === "rejected"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <option value="">Select</option>
                          <option value="completed">Complete</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </td>
                      <td>
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
    </div>
  );
};

export default InjectionManagement;
