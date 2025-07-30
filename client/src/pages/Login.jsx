import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Mycontext from "../context/Mycontext";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const { loginUser } = context;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { email: email, password: password };
      const res = await loginUser(loginData);

      if (res?.status === 200) {
        setMessage("Login Successful");
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Login Unsuccessful");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
        
        {/* Moving Gradient Elements */}
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-teal-400/10 to-cyan-500/10"
          animate={{
            x: ["0%", "10%", "0%"],
            y: ["0%", "20%", "0%"],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute -bottom-[15%] -right-[15%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-400/10"
          animate={{
            x: ["0%", "-15%", "0%"],
            y: ["0%", "-15%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-1/4 right-1/4 w-[40%] h-[40%] rounded-full bg-gradient-to-r from-teal-400/15 to-cyan-500/15"
          animate={{
            x: ["0%", "15%", "0%"],
            y: ["0%", "-15%", "0%"],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Glowing Elements */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-teal-400/5 to-cyan-500/5"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-cyan-400/5 to-teal-500/5"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHBhdGggZD0iTTAgMEg1MFY1MEgwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWYxZjJmIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-cyan-500/20"
        >
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                Welcome Back
              </h2>
              <p className="text-gray-400 mt-2">Sign in to your account</p>
            </motion.div>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center mb-4 p-3 rounded-md ${
                  message.includes("Successful") 
                    ? "bg-green-900/30 text-green-400 border border-green-500/30" 
                    : "bg-red-900/30 text-red-400 border border-red-500/30"
                }`}
              >
                {message}
              </motion.p>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-white placeholder-gray-400 transition"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent text-white placeholder-gray-400 transition"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Login</span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20"
                    animate={{
                      x: ["-100%", "100%", "-100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-teal-500/5 group-hover:opacity-30 transition-opacity" />
                </button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition"
                >
                  Register
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;