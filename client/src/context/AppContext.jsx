import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../../config/config";

export const AppContext = createContext();

export const useApp = () => {
  return useContext(AppContext); 
};

const AppProvider = ({ children }) => {
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
  const [allAdmins, setAllAdmins] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [allPayments, setAllPayments] = useState([])
  const [allWithdrawals, setAllWithdrawals] = useState([])
  const [allSupports, setAllSupports] = useState([])


   const fetchUserProfile = async () => {
     setLoading(true);
     const token = localStorage.getItem("token");
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
  
  useEffect(() => {
    fetchUserProfile();
  }, []);


   const getLeaderData = async () => {
     try {
       const token = localStorage.getItem("leaderToken");
       const { data } = await axios.get(`${baseUrl}/leader/get-leader`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       console.log(data);
       setLeader(data.leader);
       setAllAdmins(data.admins);
       setAllUsers(data.users);
       setAllPayments(data.recharges);
       setAllWithdrawals(data.withdrawals);
       setAllSupports(data.supports);
     } catch (error) {
       console.log("Error fetching leader:", error);
     }
  };
  
  useEffect(() => {
    getLeaderData();
  }, []);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};;

export default AppProvider;
