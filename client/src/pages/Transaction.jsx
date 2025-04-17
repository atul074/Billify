import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiDollarSign, FiCalendar, FiType, FiX, FiChevronDown } from "react-icons/fi";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import Mycontext from "../context/Mycontext";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const { getAllTransactions } = context;

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactionData = await getAllTransactions();
        
        if (transactionData.status === 200) {
          setTransactions(transactionData.transactions);
          setFilteredTransactions(transactionData.transactions);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting transactions: " + error
        );
      }
    };

    getTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    // Type filter
    if (typeFilter) {
      result = result.filter((t) => t.transactionType === typeFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "7") {
      result = result.filter((t) => {
        const date = new Date(t.createdAt);
        return now - date <= 7 * 24 * 60 * 60 * 1000;
      });
    } else if (dateFilter === "30") {
      result = result.filter((t) => {
        const date = new Date(t.createdAt);
        return now - date <= 30 * 24 * 60 * 60 * 1000;
      });
    }

    // Price filter
    result = result.filter((t) => {
      const price = parseFloat(t.totalPrice);
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      return price >= min && price <= max;
    });

    setFilteredTransactions(result);
  }, [typeFilter, dateFilter, minPrice, maxPrice, transactions]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  return (
    <Layout>
      <AnimatePresence>
        {message && (
          <motion.div 
            className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-center font-medium shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 sm:p-6 space-y-6">
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Transactions
        </motion.h1>

        {/* Fixed Filter Button */}
        <div className="fixed right-6 top-24 z-20">
          <motion.button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="   bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-xl hover:shadow-2xl transition-all"
            style={{
              //background: 'linear-gradient(135deg, teal-600, blue-500)',
              boxShadow: '0 4px 6px rgba(1, 72, 113, 0.3)'
            }}
          
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 6px 8px rgba(1, 72, 113, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            {isFilterOpen ? (
              <FiX size={18} className="text-white" />
            ) : (
              <FiFilter size={18} className="text-white" />
            )}
            <span className="font-medium">Filters</span>
            <motion.span
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown size={18} className="text-white" />
            </motion.span>
          </motion.button>
        </div>

        {/* Animated Filter Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              className="fixed right-6 top-40 z-20 w-72 bg-white p-4 rounded-xl shadow-2xl border border-gray-100"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { 
                  type: "spring",
                  damping: 20,
                  stiffness: 300
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                transition: { duration: 0.2 }
              }}
              style={{
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}
            >
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { delay: 0.1 }
                }}
              >
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FiType className="text-teal-600" /> Transaction Type
                  </label>
                  <motion.select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    whileFocus={{ 
                      boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.3)',
                      scale: 1.01
                    }}
                  >
                    <option value="">All Types</option>
                    <option value="SALE">Sale</option>
                    <option value="PURCHASE">Purchase</option>
                  </motion.select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FiCalendar className="text-teal-600" /> Date Range
                  </label>
                  <motion.select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    whileFocus={{ 
                      boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.3)',
                      scale: 1.01
                    }}
                  >
                    <option value="all">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                  </motion.select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FiDollarSign className="text-teal-600" /> Min Price
                  </label>
                  <motion.input
                    type="number"
                    placeholder="Enter min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    whileFocus={{ 
                      boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.3)',
                      scale: 1.01
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FiDollarSign className="text-teal-600" /> Max Price
                  </label>
                  <motion.input
                    type="number"
                    placeholder="Enter max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    whileFocus={{ 
                      boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.3)',
                      scale: 1.01
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <motion.div 
          className="overflow-x-auto rounded-xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredTransactions.length > 0 ? (
            <table className="min-w-full bg-white">
              <thead className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md">
                <tr>
                  <th className="px-6 py-4 text-left">TYPE</th>
                  <th className="px-6 py-4 text-left">TOTAL PRICE</th>
                  <th className="px-6 py-4 text-left">TOTAL PRODUCTS</th>
                  <th className="px-6 py-4 text-left">NOTE</th>
                  <th className="px-6 py-4 text-left">DATE</th>
                  <th className="px-6 py-4 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-teal-50 transition-colors`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { 
                          duration: 0.3, 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 100
                        }
                      }}
                    >
                      <td className="px-6 py-4 capitalize">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          transaction.transactionType === "SALE" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          ₹{transaction.totalPrice}
                        </span>
                      </td>
                      <td className="px-6 py-4">{transaction.totalProducts}</td>
                      <td className="px-6 py-4 text-gray-600">{transaction.note || "-"}</td>
                      <td className="px-6 py-4">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          onClick={() => navigateToTransactionDetailsPage(transaction.id)}
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: '0 4px 8px rgba(5, 150, 105, 0.3)'
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <motion.div 
              className="bg-white p-8 text-center rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-medium text-gray-700 mb-2">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Transaction;