import { Crown, HelpCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function MembershipCard() {
  const { user } = useApp();
  const commission = Number(user?.commission || 0).toFixed(2);
  const completedOrders = Number(user?.completedOrders || 0);
  const currentOrders = Number(user?.currentCycleOrders || 0);

  return (
    <div className="bg-[#2B3374] text-white p-8">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Crown />
          </div>

          <div>
            <h2 className="md:text-2xl">
              Membership grade {user?.vipLevel || "VIP0"}
            </h2>

            <p className="mt-2">
              Commission: ${commission}
              <span className="mx-2">|</span> {currentOrders} Orders
            </p>
          </div>
        </div>

        <HelpCircle size={30} />
      </div>

      <div className="grid grid-cols-3 text-center mt-10">
        <div>
          <h3 className="md:text-3xl font-bold">{completedOrders}</h3>
          <p>Completed</p>
        </div>

        <div>
          <h3 className="md:text-3xl font-bold">{currentOrders}</h3>
          <p>Remaining</p>
        </div>

        <div>
          <h3 className="md:text-3xl font-bold">{user?.undone}</h3>
          <p>Undone</p>
        </div>
      </div>
    </div>
  );
}
