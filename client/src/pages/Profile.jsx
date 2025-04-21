import React, { useContext } from "react";
import { motion } from "framer-motion";
import Mycontext from "../context/Mycontext";
import Layout from "./Layout";

const Profile = () => {
  const context = useContext(Mycontext);
  const { userdetail,token } = context;
  console.log(token);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 25px 50px -12px rgba(0, 179, 159, 0.25)"
    }
  };

  // Get first character safely
  const getInitial = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 p-5 md:p-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex justify-center items-center min-h-[80vh]"
        >
          {userdetail && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-cyan-100"
            >
              {/* Profile Header with Gradient */}
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-8 text-center relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-400 rounded-full opacity-20"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-400 rounded-full opacity-20"></div>
                
                <motion.div variants={itemVariants}>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-3xl font-bold text-white">
                    {getInitial(userdetail.username)}
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2 capitalize">
                    {userdetail.username}
                  </h1>
                  <p className="text-cyan-100 text-lg font-medium">
                    Billing Counter Employee
                  </p>
                </motion.div>
              </div>

              {/* Profile Details */}
              <motion.div 
                variants={containerVariants}
                className="p-8 space-y-6"
              >
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl shadow-sm hover:shadow-md transition-all border border-cyan-100"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <label className="font-semibold text-cyan-700">Full Name</label>
                  </div>
                  <span className="text-gray-800 font-medium text-lg mt-2 sm:mt-0">
                    {userdetail.username}
                  </span>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl shadow-sm hover:shadow-md transition-all border border-cyan-100"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <label className="font-semibold text-cyan-700">Email Address</label>
                  </div>
                  <span className="text-gray-800 font-medium text-lg mt-2 sm:mt-0">
                    {userdetail.email}
                  </span>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl shadow-sm hover:shadow-md transition-all border border-cyan-100"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <label className="font-semibold text-cyan-700">Phone Number</label>
                  </div>
                  <span className="text-gray-800 font-medium text-lg mt-2 sm:mt-0">
                    {userdetail.phoneNo || "Not provided"}
                  </span>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl shadow-sm hover:shadow-md transition-all border border-cyan-100"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <label className="font-semibold text-cyan-700">Address</label>
                  </div>
                  <span className="text-gray-800 font-medium text-lg text-right mt-2 sm:mt-0">
                    {userdetail.address || "Not provided"}
                  </span>
                </motion.div>
              </motion.div>

              {/* Footer with role information */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 p-4 text-center">
                <p className="text-cyan-600/70 text-sm font-medium">
                  Authorized billing system operator
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;