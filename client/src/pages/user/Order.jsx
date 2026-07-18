import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";
import BackButton from "../../components/user/BackButton";
const Orders = () => {
  const { orders, setOrders, loading } = useApp();

  // confirm order
  const handleConfirmOrder = async (orderId) => {
    try {
      const { data } = await axios.patch(`${baseUrl}/orders/${orderId}`, {
        status: "completed",
      });
      if (data.success) {
        toast.success("Order completed successfully");
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "completed" } : order,
          ),
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="p-4 w-full max-w-7xl mx-auto mb-10 md:my-0">
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <p className="text-lg font-medium text-gray-600">
            Loading your orders...
          </p>
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <BackButton />
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders?.map((order) => (
              <div
                key={order?._id}
                className="bg-white relative shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                <div className="relative flex justify-center bg-gray-50 p-3 overflow-hidden rounded-lg">
                  <img
                    src={order?.image}
                    alt={order.title}
                    className="w-28 h-28 object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h2 className="font-semibold text-sm text-gray-800 line-clamp-2 min-h-10">
                      {order?.title}
                    </h2>

                    <span
                      className={`absolute top-3 left-3 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm ${
                        order?.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order?.status === "completed"
                        ? "✓ completed"
                        : "⏳ undone"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Created: {new Date(order?.createdAt).toLocaleString()}
                  </p>
                  {order?.completedAt && (
                    <p className="text-xs text-green-600">
                      Completed: {new Date(order?.completedAt).toLocaleString()}
                    </p>
                  )}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                      <span>Quantity</span>
                      <span>{order?.quantity}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-100 pb-1">
                      <span>Total</span>
                      <span className="font-medium text-blue-600">
                        ${order?.totalAmount}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-gray-100 pb-1">
                      <span>Commission</span>

                      {order?.requiresInjection ? (
                        <span className="font-medium text-green-600">
                          ${order?.fixedCommission?.toFixed(2)}
                        </span>
                      ) : (
                        <span className="font-medium text-green-600">
                          ${order?.commission?.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-1">
                      <span>Difference Amount</span>
                      <span className="font-medium text-red-600">
                        ${order?.differenceAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                {order.status === "undone" && (
                  <button
                    onClick={() => handleConfirmOrder(order._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 duration-300 cursor-pointer"
                  >
                    Confirm Order
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-80">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-700">
            No Orders Yet
          </h2>
          <p className="text-gray-500 mt-2">
            Start snapping up products to see your orders here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
