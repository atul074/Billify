import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiDollarSign, FiPackage, FiUser, FiCalendar, FiInfo, FiShoppingCart } from "react-icons/fi";
import Layout from "./Layout";
import { useParams } from "react-router-dom";
import Mycontext from "../context/Mycontext";

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("transaction");

  const context = useContext(Mycontext);
  const { getTransactionById } = context;

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const transactionData = await getTransactionById(transactionId);
        console.log(transactionData);
        
        if (transactionData.status === 200) {
          setTransaction(transactionData.transaction);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting a transaction: " + error
        );
      }
    };

    getTransaction();
  }, [transactionId]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "transaction":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiShoppingCart className="text-teal-600 text-2xl" />
              <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl shadow-sm">
                <h4 className="font-medium text-gray-700 mb-4">Basic Information</h4>
                <div className="space-y-3 text-gray-600">
                  <p className="font-bold text-black"><span className="font-medium text-teal-700">Type:</span> {transaction.transactionType}</p>
                  <p><span className="font-medium text-teal-700">Note:</span> {transaction.note || "N/A"}</p>
                  <p><span className="font-medium text-teal-700">Total Products:</span> {transaction.totalProducts}</p>
                  <p><span className="font-medium text-teal-700">Total Price:</span> ₹{transaction.totalPrice?.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl shadow-sm">
                <h4 className="font-medium text-gray-700 mb-4">Timestamps</h4>
                <div className="space-y-3 text-gray-600">
                  <p><span className="font-medium text-teal-700">Created At:</span> {new Date(transaction.createdAt).toLocaleString()}</p>
                  {transaction.updatedAt && (
                    <p><span className="font-medium text-teal-700">Updated At:</span> {new Date(transaction.updatedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>

            {transaction.transactionType === "SALE" && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-xl shadow-md">
                <h4 className="font-medium text-gray-700 mb-4">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <p><span className="font-medium text-teal-700">Buyer Name:</span> {transaction.buyerName}</p>
                  <p><span className="font-medium text-teal-700">Buyer Phone:</span> {transaction.buyerPhoneNo}</p>
                </div>
              </div>
            )}
          </motion.div>
        );
      case "products":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiPackage className="text-teal-600 text-2xl" />
              <h3 className="text-xl font-bold text-gray-800">Products ({transaction.product.length})</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transaction.product?.map((prod, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-teal-50 to-cyan-100 p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all"
                >
                  <h4 className="font-bold text-gray-800 mb-2">{prod.name}</h4>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium text-teal-700">Quantity:</span> {transaction.quantity.at(index)}</p>
                    <p><span className="font-medium text-teal-700">Price:</span> ₹{prod.price?.toFixed(2)}</p>
                    <p><span className="font-medium text-teal-700">Location:</span> {prod.location}</p>
                    <p><span className="font-medium text-teal-700">Stock:</span> {prod.stockQuantity}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case "user":
        return transaction.user && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiUser className="text-teal-600 text-2xl" />
              <h3 className="text-xl font-bold text-gray-800">User Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-xl shadow-sm">
                <h4 className="font-medium text-gray-700 mb-4">Basic Details</h4>
                <div className="space-y-3 text-gray-600">
                  <p><span className="font-medium text-teal-700">Name:</span> {transaction.user.username}</p>
                  <p><span className="font-medium text-teal-700">Email:</span> {transaction.user.email}</p>
                  <p><span className="font-medium text-teal-700">Phone:</span> {transaction.user.phoneNo || "N/A"}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-xl shadow-sm">
                <h4 className="font-medium text-gray-700 mb-4">Address</h4>
                <div className="space-y-3 text-gray-600">
                  <p>{transaction.user.address || "N/A"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-6 mx-auto max-w-2xl shadow-md"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {transaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Left Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                  Transaction #{transactionId.slice(0, 6)}
                </h2>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveSection("transaction")}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${activeSection === "transaction" ? "bg-teal-100 text-teal-700" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <FiInfo className="text-lg" />
                      <span>Transaction Info</span>
                    </div>
                    {activeSection === "transaction" ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  <button
                    onClick={() => setActiveSection("products")}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${activeSection === "products" ? "bg-teal-100 text-teal-700" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <FiPackage className="text-lg" />
                      <span>Products ({transaction.product.length})</span>
                    </div>
                    {activeSection === "products" ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {transaction.user && (
                    <button
                      onClick={() => setActiveSection("user")}
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${activeSection === "user" ? "bg-teal-100 text-teal-700" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-3">
                        <FiUser className="text-lg" />
                        <span>User Info</span>
                      </div>
                      {activeSection === "user" ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  )}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-gray-600 mb-2">
                    <span>Total Amount:</span>
                    <span className="font-bold text-teal-700">₹{transaction.totalPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Date:</span>
                    <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-md p-6">
                {renderSection()}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionDetail;