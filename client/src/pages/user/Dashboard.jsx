import ImageSlider from "../../components/user/ImageSlider";
import MenuSection from "../../components/user/MenuSection";
import MembershipCard from "./MembershipCard";
import PartnersFooter from "../../components/user/Footer";
import { membershipData } from "../../../config/membershipData";
import { useNavigate } from "react-router-dom";
import { Bell, Gift, MessageCircle, Wallet } from "lucide-react";
import { useApp } from "../../context/AppContext";
export default function Dashboard() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen max-w-7xl mx-auto w-full">
      {/* TOP SECTION */}
      <div className="bg-white shadow-sm">
        <div className="grid lg:grid-cols-12">
          {/* Slider */}
          <div className="lg:col-span-6">
            <ImageSlider />
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-3 bg-gray-100 rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4">
              {[
                {
                  title: "Message",
                  icon: (
                    <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  ),
                  path: "/messages",
                },
                {
                  title: "Top-up",
                  icon: (
                    <Wallet className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  ),
                  path: "/topup",
                },
                {
                  title: "Withdrawal",
                  icon: (
                    <Wallet className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  ),
                  path: "/withdrawal-form",
                },
                {
                  title: "Invite",
                  icon: (
                    <Gift className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                  ),
                  path: "/invite",
                },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center gap-2 p-4 sm:p-6 transition hover:bg-white rounded-lg"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#2B3374] text-white flex items-center justify-center shadow">
                    {item.icon}
                  </div>

                  <span className="text-sm sm:text-base font-medium text-gray-700 text-center">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile */}
          <div className="lg:col-span-3 p-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg">
              <div className="w-full h-full bg-[#2B3374] flex items-center justify-center text-white text-xl md:text-3xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            <div className="w-full space-y-3 mt-4 text-sm">
              {/* Username */}
              <p className="font-semibold text-slate-700 text-center">
                {user?.username || "User"}
              </p>

              {/* Balance */}
              <div className="flex justify-between">
                <span className="text-gray-500">Balance</span>
                <span className="font-medium text-blue-600">
                  $
                  {(
                    (user?.depositAmount ?? 0) + (user?.commission ?? 0)
                  ).toFixed(2)}
                </span>
              </div>

              {/* Phone */}
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="text-gray-700">
                  {user?.phoneNumber || "-"}
                </span>
              </div>

              {/* Invitation Code */}
              <div className="flex justify-between">
                <span className="text-gray-500">Invitation code</span>
                <span className="text-green-500">
                  {user?.myInvitationCode || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTICE BAR */}
      <div className="bg-white mt-2 shadow-sm px-4 py-3 flex items-center">
        <Bell className="text-blue-500" size={18} />

        <marquee className="ml-3 text-[#2B3374] font-medium">
          Welcome to Mercadolibre Shopping Center
        </marquee>
      </div>

      {/* BENEFITS */}
      <div className="mt-3 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 md:w-1.5 h-7 bg-blue-500"></div>

          <h2 className="text-lg md:text-2xl font-semibold text-gray-700">
            Reap the Benefits
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            "Today's Earnings",
            "Today's Commission",
            "Reap Benefits",
            "Profit Treasure",
          ].map((item, index) => (
            <div key={index} className="bg-white shadow-md p-6 text-center">
              <h3 className="text-2xl md:text-4xl font-bold text-[#2B3374]">
                0
              </h3>

              <p className="mt-3 text-gray-600 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MEMBERSHIP + AGENCY */}
      <div className="grid lg:grid-cols-2 gap-4 mt-3">
        <MembershipCard membershipData={membershipData} />

        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 md:w-1.5 h-7 bg-blue-500 rounded-full"></div>

            <h2 className="md:text-2xl font-semibold text-gray-700">
              Agency Income Presentation
            </h2>
          </div>

          <div className="space-y-4">
            {[13858, 17663, 1566, 11254, 7885, 12321, 13445, 3424].map(
              (item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between shadow-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="text-blue-500" size={20} />

                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </p>

                      <p className="font-medium text-gray-700">
                        Today's Earnings
                      </p>
                    </div>
                  </div>

                  <span className="text-blue-500 font-bold md:text-lg">
                    {item}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <PartnersFooter />
      <MenuSection />
    </div>
  );
}
