import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Mycontext from "../context/Mycontext";
import { motion } from "framer-motion";
import background from "../assets/background.jpg"; // Make sure to import your background image

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const context = useContext(Mycontext);
  const { registerUser } = context;
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const registerData = { 
        username: name, 
        email: email, 
        password: password, 
        phoneNo: phoneNumber,
        address: address 
      };
      
      await registerUser(registerData);
      setMessage("Registration Successful");
      setTimeout(() => navigate("/login"), 1500); // Redirect to login after success
    } catch (error) {
      setMessage("Registration Unsuccessful");
      console.log(error);
    }
  };

  const formFields = [
    {
      id: "name",
      type: "text",
      placeholder: "Enter your name",
      value: name,
      onChange: (e) => setName(e.target.value),
      label: "Full Name"
    },
    {
      id: "email",
      type: "email",
      placeholder: "Enter your email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      label: "Email"
    },
    {
      id: "password",
      type: "password",
      placeholder: "Create a password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      label: "Password"
    },
    {
      id: "phone",
      type: "text",
      placeholder: "Enter your phone number",
      value: phoneNumber,
      onChange: (e) => setPhoneNumber(e.target.value),
      label: "Phone Number"
    },
    {
      id: "address",
      type: "text",
      placeholder: "Enter your address",
      value: address,
      onChange: (e) => setAddress(e.target.value),
      label: "Address"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image with blur and overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={background} 
          alt="background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-pink-600/20 backdrop-blur-sm"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                Create Account
              </h2>
              <p className="text-gray-600 mt-2">Join us today</p>
            </motion.div>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center mb-4 p-2 rounded-md ${
                  message.includes("Successful") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </motion.p>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {formFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={field.onChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Register
                </button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition"
                >
                  Login
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;