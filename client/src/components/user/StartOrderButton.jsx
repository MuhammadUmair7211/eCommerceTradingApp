import axios from "axios";
import { useEffect, useState } from "react";
import LowBalanceModal from "./LowBalanceModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PenguinLoader from "./PenguinLoader";
import { baseUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";
export default function StartOrderButton() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [lowBalanceModal, setLowBalanceModal] = useState(false);
  const [modal, setModal] = useState(false);
  const isInjectionOrder = currentOrder?.requiresInjection;
  const product = products.find(
    (p) => Number(p.id) === Number(currentOrder?.productId),
  );
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=194")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      })
      .catch((err) => console.error(err));
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // handle start
  const handleStartOrder = async () => {
    setLoader(true);
    try {
      await delay(3000);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${baseUrl}/orders/check-start`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);

      if (!data.success) {
        toast.error(data.message);
        return;
      }
      if (!data.canStart) {
        switch (data.reason) {
          case "LOW_BALANCE":
            toast.error(data.message);
            return;

          case "NO_ORDERS":
            toast.error(data.message);
            return;

          case "INJECTION_REQUIRED": {
            setCurrentOrder(data.lastOrder);
            setModal(true);
            toast.error(data.message);
            return;
          }
          default:
            toast.error("Unable to start order.");
            return;
        }
      }
      // Safety check
      if (!products.length) {
        toast.error("Products are still loading.");
        return;
      }

      // Random product
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      const newOrderId = `ORD-${randomProduct.id}-${Date.now()}`;

      const order = {
        id: newOrderId,
        productId: randomProduct.id,
        title: randomProduct.title,
        image: randomProduct.thumbnail,
        price: randomProduct.price,
        quantity: 1,
        totalAmount: randomProduct.price,
        createdAt: new Date().toISOString(),
      };

      setCurrentOrder(order);
      setModal(true);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoader(false);
    }
  };

  // handle confirm order
  const submitOrder = async (action) => {
    try {
      const { data } = await axios.post(`${baseUrl}/orders`, {
        userId: user?._id,
        title: currentOrder.title,
        productId: currentOrder?.productId,
        image: currentOrder.image,
        quantity: currentOrder.quantity,
        totalAmount: currentOrder.totalAmount,
        action,
      });
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        setUser(data.user);
        setModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("ERROR:", error);
      console.log("Data:", error.response?.data);
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <>
      <LowBalanceModal
        open={lowBalanceModal}
        onClose={() => setLowBalanceModal(false)}
        onTopUp={() => {
          setLowBalanceModal(false);
          navigate("/topup"); // or your route
        }}
      />

      <div className="flex justify-center mt-12">
        <button
          onClick={handleStartOrder}
          className="bg-[#2B3374] hover:bg-[#111e97] text-white md:text-2xl font-medium px-24 py-5 rounded-full transition duration-300 cursor-pointer"
        >
          Start to Snap Up
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-5">
              <h2 className="text-xl font-bold">Submit Order</h2>
              <p className="text-sm opacity-90">
                {new Date().toLocaleString()}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <img
                  src={product?.thumbnail || currentOrder?.image}
                  alt={product?.title || currentOrder?.title}
                  className="w-full h-20 md:w-56 md:h-56 rounded-xl object-center md:object-cover border border-gray-200"
                />

                <div className="flex-1">
                  <p className="font-semibold text-gray-800 uppercase leading-relaxed">
                    {product?.title || currentOrder?.title}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {product?.brand}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {product?.description}
                  </p>
                  <p className="text-gray-600 text-sm">{product?.rating}</p>
                  <p className="text-gray-600 text-sm">
                    {product?.shippingInformation}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {product?.stock} items in stock
                  </p>

                  <p className="text-sm text-gray-500">
                    Order ID: {currentOrder?._id || currentOrder?.id}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product?.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <p>Quantity</p>
                  <span className="font-semibold">
                    {currentOrder?.quantity}
                  </span>
                </div>

                <div className="flex justify-between">
                  <p>Total Order</p>
                  <span className="font-semibold text-blue-600">
                    USDT {(currentOrder?.totalAmount || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <p>Commission</p>
                  <span className="font-semibold text-green-600">
                    USDT{" "}
                    {isInjectionOrder
                      ? (currentOrder?.fixedCommission || 0).toFixed(2)
                      : (user?.commissionArray?.[0] || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <p>Difference Amount</p>
                  <span className="font-semibold">
                    USDT{" "}
                    {isInjectionOrder
                      ? (currentOrder?.differenceAmount || 0).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 p-5 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>
                  isInjectionOrder ? setModal(false) : submitOrder("cancel")
                }
                className="flex-1 py-3 border border-gray-300 hover:bg-gray-100 duration-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => submitOrder("confirm")}
                className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {loader && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white/60 backdrop-blur-md px-8 py-6 shadow-lg w-96">
            <PenguinLoader />
          </div>
        </div>
      )}
    </>
  );
}
