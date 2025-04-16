import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiShoppingCart, FiPackage, FiDollarSign, FiFileText, FiSettings, FiUser, FiLogOut, FiMenu, FiCalendar, FiMail } from "react-icons/fi";
import Mycontext from "../context/Mycontext";

const SidebarItem = ({ to, icon, text }) => {
  const Icon = icon;
  
  return (
    <li className="mb-1">
      <Link 
        to={to} 
        className="flex items-center p-3 rounded-md hover:bg-teal-700/20 transition-colors"
      >
        <Icon className="text-teal-400 mr-3" size={18} />
        <span>{text}</span>
      </Link>
    </li>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const context = useContext(Mycontext);
  const { isAuthenticated, userdetail } = context;

  // Get current date and day
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  const menuItems = [
    { to: "/home", icon: FiHome, text: "Dashboard" },
    { to: "/transaction", icon: FiShoppingCart, text: "Transactions" },
    { to: "/product", icon: FiPackage, text: "Products" },
    { to: "/purchase", icon: FiDollarSign, text: "Purchase" },
    { to: "/sell", icon: FiFileText, text: "Sell / Invoice" },
    { to: "/templates", icon: FiSettings, text: "Templates" },
    { to: "/profile", icon: FiUser, text: "Profile" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40 shadow-2xl"
        >
          <div className="flex flex-col h-full p-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                Billify Pro
              </h1>
              <p className="text-xs text-gray-400 mt-1">Inventory & Billing System</p>
            </motion.div>

            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {isAuthenticated && menuItems.map((item, index) => (
                  <SidebarItem
                    key={index}
                    to={item.to}
                    icon={item.icon}
                    text={item.text}
                  />
                ))}
              </ul>
            </nav>

            {/* User info panel */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-auto p-4 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg"
            >
              <div className="flex items-center mb-3">
                <FiMail className="text-white mr-2" size={16} />
                <p className="text-sm text-white truncate">{userdetail?.email || "user@example.com"}</p>
              </div>
              <div className="flex items-center">
                <FiCalendar className="text-white mr-2" size={16} />
                <p className="text-sm text-white">
                  {dayName}, {formattedDate}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const context = useContext(Mycontext);
  const { userdetail, logoutUser } = context;
  const navigate = useNavigate();

  const logout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 right-0 ${isSidebarOpen ? 'left-64' : 'left-0'} bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg z-30 transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-700/50 transition-colors"
          >
            <FiMenu size={20} />
          </button>
          <h2 className="text-xl font-semibold">
            Welcome, <span className="text-teal-300">{userdetail?.username || "User"}</span>
          </h2>
        </div>
        <div className="flex items-center space-x-4 mr-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
          >
            <FiLogOut className="mr-2" />
            Logout
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="p-6 pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;