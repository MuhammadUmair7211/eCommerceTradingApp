import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../../config/config";
import { useLocation } from "react-router-dom";

export const AppContext = createContext();

export const useApp = () => {
  return useContext(AppContext);
};

const AppProvider = ({ children }) => {
  const location = useLocation();
  // user data
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [injections, setInjections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supports, setSupports] = useState([]);

  // leader data
  const [leader, setLeader] = useState(null);
  const [allAdmins, setAllAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [allSupports, setAllSupports] = useState([]);

  // admin data
  const [admin, setAdmin] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminPayments, setAdminPayments] = useState([]);
  const [adminWithdrawals, setAdminWithdrawals] = useState([]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInjections(data.injections);
      setOrders(data.orders);
      setRecharges(data.recharges);
      setUser(data.user);
      setWithdrawals(data.withdrawals);
      setSupports(data.supports);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getLeaderData = async () => {
    const token = localStorage.getItem("leaderToken");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/leader/get-leader`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeader(data.leader);
      setAllAdmins(data.admins);
      setAllUsers(data.users);
      setAllPayments(data.recharges);
      setAllWithdrawals(data.withdrawals);
      setAllSupports(data.supports);
    } catch (error) {
      console.log("Error fetching leader:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.get(`${baseUrl}/admin-auth/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmin(data.admin);
      setAdminPayments(data.payments);
      setAdminWithdrawals(data.withdrawals);
      setAdminUsers(data.users);
    } catch (error) {
      console.error(
        "Error fetching admin:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function load() {
      await fetchAdminData();
    }
    load();
  }, [location.pathname]);

  useEffect(() => {
    async function load() {
      await fetchUserProfile();
    }
    load();
  }, [location.pathname]);

  useEffect(() => {
    async function load() {
      await getLeaderData();
    }
    load();
  }, [location.pathname]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        orders,
        setOrders,
        payments,
        setPayments,
        withdrawals,
        setWithdrawals,
        recharges,
        setRecharges,
        injections,
        setInjections,
        loading,
        setLoading,
        supports,
        setSupports,
        leader,
        allAdmins,
        allUsers,
        allPayments,
        allWithdrawals,
        allSupports,
        fetchUserProfile,
        getLeaderData,
        fetchAdminData,
        admin,
        adminUsers,
        adminPayments,
        adminWithdrawals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
