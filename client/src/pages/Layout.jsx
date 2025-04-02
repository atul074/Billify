import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext,useEffect } from "react";
import Mycontext from "../context/Mycontext";
const Sidebar = () => {
  //const isAuth = ApiService.isAuthenticated();
  //const isAdmin = ApiService.isAdmin();
  const context=useContext(Mycontext);
  const navigate=useNavigate();
  const {isAuthenticated,logoutUser,userdetail,token}=context;
  const logout = () => {
   logoutUser();
   alert("user logout");
    navigate("/login");
  };

  return (
    <div className="w-1/5 h-screen bg-gray-900 text-white flex flex-col p-6 fixed shadow-lg">
      <h1 className="text-center text-teal-500 font-extrabold text-xl mb-4">atul</h1>
      <ul className="space-y-3">
        { <li><Link to="/dashboard" className="block p-3 rounded-md hover:text-teal-500 text-amber-600">Dashboard</Link></li>}
        {isAuthenticated && <li><Link to="/transaction" className="block p-3 rounded-md hover:text-teal-500">Transactions</Link></li>}
        {isAuthenticated && <li><Link to="/product" className="block p-3 rounded-md hover:text-teal-500">Product</Link></li>}
        {isAuthenticated && <li><Link to="/purchase" className="block p-3 rounded-md hover:text-teal-500">Purchase</Link></li>}
        {isAuthenticated && <li><Link to="/sell" className="block p-3 rounded-md hover:text-teal-500">Sell</Link></li>}
        {isAuthenticated && <li><Link to="/profile" className="block p-3 rounded-md hover:text-teal-500">Profile</Link></li>}
        { <li><Link onClick={logout} to="/login" className="block p-3 rounded-md hover:text-teal-500">Logout</Link></li>}
      </ul>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-1/5 flex-grow p-6 transition-all">{children}</div>
    </div>
  );
};

export default Layout;
