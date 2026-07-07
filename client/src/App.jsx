import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "./components/user/Auth";
import Dashboard from "./pages/user/Dashboard";
import TopUp from "./pages/user/TopUp";
import Company from "./pages/user/Company";
import Rules from "./pages/user/Rules";
import Agent from "./pages/user/Agent";
import Qualification from "./pages/user/Qualification";
import Invite from "./pages/user/Invite";
import Messages from "./pages/user/Messages";
import Membership from "./pages/user/Membership";
import MembershipDetails from "./pages/user/MembershipDetails";
import ContactSupport from "./pages/user/ContactSupport";
import PaymentStatus from "./pages/user/PaymentStatus";
import RechargeHistory from "./pages/user/RechargeHistory";
// admin routes
import Members from "./pages/admin/Members";
import AdminLayout from "./pages/admin/layouts/AdminLayout";
import Statistics from "./pages/admin/Statistics";
import TopUps from "./pages/admin/TopUp";
import Withdrawals from "./pages/admin/Withdrawals";
import InjectionManagement from "./pages/admin/InjectionManagement";
import Order from "./pages/user/Order";
import GrabOrder from "./pages/user/GrabOrder";
import Account from "./pages/user/Account";
import UserLayout from "./pages/user/UserLayout";
import { ToastContainer, Zoom } from "react-toastify";
import BankAddress from "./pages/user/bankCardAddress";
import LeaderDashboard from "./pages/leader/LeaderDashboard";
import AdminTeamPage from "./pages/leader/AdminTeamPage";
import LeaderAuth from "./pages/leader/LeaderAuth";
import WithdrawalHistory from "./pages/user/withdrawalHistory";
import WithdrawalForm from "./pages/user/WithdrawalForm";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminProfile from "./pages/admin/AdminProfile";
import Recharges from "./pages/leader/Recharges";
import Withdraws from "./pages/leader/Withdraws";
import AllUsers from "./pages/leader/AllUsers";
import ChangePassword from "./pages/user/ChangePassword";
import LeaderProtectedRoute from "./pages/leader/components/LeaderProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import UserProtectedRoute from "./components/user/UserProtectedRoute";
import LeaderSupport from "./pages/leader/LeaderSupport";
import UserSupport from "./pages/user/UserSupport";
function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
      <Routes>
        {/* leader routes */}
        <Route path="/leader-auth" element={<LeaderAuth />} />

        {/* leader protected route */}
        <Route element={<LeaderProtectedRoute />}>
          <Route path="/leader-dashboard" element={<LeaderDashboard />} />
          <Route
            path="/leader-dashboard/:adminId"
            element={<AdminTeamPage />}
          />
          <Route path="/leader-dashboard/recharges" element={<Recharges />} />
          <Route path="/leader-dashboard/withdraws" element={<Withdraws />} />
          <Route path="/leader-dashboard/all-users" element={<AllUsers />} />
          <Route path="/leader-dashboard/support" element={<LeaderSupport />} />
        </Route>
        {/* USER ROUTES */}
        <Route path="/" element={<Auth />} />
        <Route element={<UserProtectedRoute />}>
          <Route path="/topup" element={<TopUp />} />
          <Route path="/company" element={<Company />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/qualification" element={<Qualification />} />
          <Route path="/withdrawal-form" element={<WithdrawalForm />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/membership/:vipLevel" element={<Membership />} />
          <Route path="/membershipDetails" element={<MembershipDetails />} />
          <Route path="/contactSupport" element={<ContactSupport />} />
          <Route path="/paymentStatus" element={<PaymentStatus />} />
          <Route path="/recharge-history" element={<RechargeHistory />} />
          <Route path="/withdrawal-history" element={<WithdrawalHistory />} />

          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order" element={<Order />} />
            <Route path="/grabOrder" element={<GrabOrder />} />
            <Route path="/account" element={<Account />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/bankCardAddress" element={<BankAddress />} />
            <Route path="/user-support" element={<UserSupport />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="statistics" replace />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="admin-profile" element={<AdminProfile />} />
            <Route path="members" element={<Members />} />
            <Route path="recharge-history" element={<RechargeHistory />} />
            <Route path="withdrawals" element={<Withdrawals />} />
            <Route path="topups" element={<TopUps />} />
            <Route path="recharges" element={<RechargeHistory />} />
            <Route
              path="injectionManagement/:id"
              element={<InjectionManagement />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
