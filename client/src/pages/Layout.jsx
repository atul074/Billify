import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiShoppingCart, FiPackage, FiDollarSign, FiFileText, FiSettings, FiUser, FiLogOut, FiMenu, FiCalendar, FiMail } from "react-icons/fi";
import Mycontext from "../context/Mycontext";
import logo from "../assets/logo.png"

const SidebarItem = ({ to, icon, text, isOpen }) => {
  const Icon = icon;
  
  return (
    <motion.li 
      className="mb-1"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link 
        to={to} 
        className="flex items-center p-3 rounded-md hover:bg-teal-700/20 transition-colors"
      >
        <Icon className="text-teal-400 mr-3" size={18} />
        <motion.span
          animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
          transition={{ duration: 0.2 }}
          className={`${isOpen ? 'block' : 'hidden'}`}
        >
          {text}
        </motion.span>
      </Link>
    </motion.li>
  );
};

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const context = useContext(Mycontext);
//   const { isAuthenticated, userdetail } = context;

//   // Get current date and day
//   const currentDate = new Date();
//   const formattedDate = currentDate.toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'long', 
//     day: 'numeric' 
//   });
//   const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

//   const menuItems = [
//     { to: "/home", icon: FiHome, text: "Dashboard" },
//     { to: "/transaction", icon: FiShoppingCart, text: "Transactions" },
//     { to: "/product", icon: FiPackage, text: "Products" },
//     { to: "/purchase", icon: FiDollarSign, text: "Purchase" },
//     { to: "/sell", icon: FiFileText, text: "Sell / Invoice" },
//     { to: "/templates", icon: FiSettings, text: "Templates" },
//     { to: "/profile", icon: FiUser, text: "Profile" }
//   ];

//   // Typing animation variants
//   const typingVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.3
//       }
//     }
//   };

//   const letterVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.3,
//         ease: "easeOut"
//       }
//     }
//   };

//   const text = "Billify Pro";

//   return (
//     <div 
//       className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40 shadow-2xl transition-all duration-300 ${
//         isOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}
//     >
//       <div className="flex flex-col h-full p-6">
//         <div className="text-center mb-8">
//           <motion.h1 
//             className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"
//             initial="hidden"
//             animate="visible"
//             variants={typingVariants}
//           >
//             {text.split("").map((char, index) => (
//               <motion.span key={index} variants={letterVariants}>
//                 {char}
//               </motion.span>
//             ))}
//           </motion.h1>
//           <motion.p 
//             className="text-xs text-gray-400 mt-1"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.2 }}
//           >
//             Inventory & Billing Solution
//           </motion.p>
//         </div>

//         <nav className="flex-1 overflow-y-auto">
//           <ul className="space-y-2">
//             {isAuthenticated && menuItems.map((item, index) => (
//               <SidebarItem
//                 key={index}
//                 to={item.to}
//                 icon={item.icon}
//                 text={item.text}
//                 isOpen={isOpen}
//               />
//             ))}
//           </ul>
//         </nav>

//         {/* User info panel */}
//         <motion.div 
//           className="mt-auto p-4 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg"
//           whileHover={{ y: -3 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           <div className="flex items-center mb-3">
//             <FiMail className="text-white mr-2" size={16} />
//             <p className="text-sm text-white truncate">{userdetail?.email || "user@example.com"}</p>
//           </div>
//           <div className="flex items-center">
//             <FiCalendar className="text-white mr-2" size={16} />
//             <p className="text-sm text-white">
//               {dayName}, {formattedDate}
//             </p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

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
    <div 
      className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40 shadow-2xl transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-6">
        {/* Logo and App Name */}
        <div className="flex items-center justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src={logo} 
              alt="Billify Logo" 
              className="w-10 h-10 mr-3" 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Billify
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Inventory & Billing Solution
            </p>
          </motion.div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {isAuthenticated && menuItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
                isOpen={isOpen}
              />
            ))}
          </ul>
        </nav>

        {/* User info panel */}
        <motion.div 
          className="mt-auto p-4 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
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
    </div>
  );
};

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const context = useContext(Mycontext);
  const { userdetail, logoutUser } = context;
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logoutUser();
      navigate("/login");
    }, 800);
  };

  return (
    <header className={`fixed top-0 right-0 ${isSidebarOpen ? 'left-64' : 'left-0'} bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg z-30 transition-all duration-300`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <motion.button 
           whileHover={{ scale: 1.1, rotate: 90 }}
           whileTap={{ scale: 0.95 }}
           onClick={toggleSidebar}
           className="p-2 rounded-md hover:bg-gray-700/50 transition-colors"
           animate={{ rotate: isSidebarOpen ? 0 : 180 }}
           transition={{ type: "spring", stiffness: 300 }}
          >
            <FiMenu size={20} />
          </motion.button>
          <h2 className="text-xl font-semibold">
            Welcome, <span className="text-teal-300">{userdetail?.username || "User"}</span>
          </h2>
        </div>
        <div className="flex items-center space-x-4 mr-4">
          <motion.button
            onClick={logout}
            className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg transition-all"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 5px 15px rgba(239, 68, 68, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              x: isLoggingOut ? [0, 20, -20, 20, -20, 0] : 0,
              opacity: isLoggingOut ? [1, 0.8, 0.6, 0.4, 0.2, 0] : 1
            }}
            transition={{ 
              duration: isLoggingOut ? 0.8 : 0.2,
              ease: "easeInOut"
            }}
          >
            <motion.span
              animate={{ rotate: isLoggingOut ? 360 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <FiLogOut className="mr-2" />
            </motion.span>
            <motion.span
              animate={{ opacity: isLoggingOut ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              Logout
            </motion.span>
          </motion.button>
        </div>
      </div>
    </header>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;