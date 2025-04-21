import React, { useContext, useEffect, useState } from "react";
import Layout from "./Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import Mycontext from "../context/Mycontext";

const Home = () => {
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState("amount");
  const [transactionType, setTransactionType] = useState("ALL");
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext(Mycontext);
  const { userdetail, getAllTransactions } = context;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const transactionResponse = await getAllTransactions();
        console.log(transactionResponse);
        
        if (transactionResponse.status === 200) {
          setTransactionData(
            transformTransactionData(
              transactionResponse.transactions,
              selectedMonth,
              selectedYear,
              transactionType
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching transactions: " + error
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear, transactionType]);

  const transformTransactionData = (transactions, month, year, type) => {
    const dailyData = {};
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = {
        day,
        count: 0,
        quantity: 0,
        amount: 0,
      };
    }

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      // Filter by transaction type if not "ALL"
      const typeMatches = transactionType === "ALL" || 
                         transaction.transactionType === transactionType;

      if (transactionMonth === month && transactionYear === year && typeMatches) {
        const day = transactionDate.getDate();
        dailyData[day].count += 1;
        dailyData[day].quantity += transaction.totalProducts;
        dailyData[day].amount += transaction.totalPrice;
      }
    });

    return Object.values(dailyData);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const dataOptions = [
    { key: "count", label: "Total Transactions" },
    { key: "quantity", label: "Product Quantity" },
    { key: "amount", label: "Amount (₹)" }
  ];

  const transactionTypeOptions = [
    { value: "ALL", label: "All Transactions" },
    { value: "PURCHASE", label: "Purchases" },
    { value: "SALE", label: "Sales" }
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" })
  }));

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  const getDashboardTitle = () => {
    switch(transactionType) {
      case "PURCHASE":
        return "Purchase Analytics Dashboard";
      case "SALE":
        return "Sales Analytics Dashboard";
      default:
        return "Inventory Analytics Dashboard";
    }
  };

  return (
    <Layout>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white p-4 md:p-8"
    >
      {message && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 mb-6 rounded-lg shadow-lg"
          role="alert"
        >
          <p className="font-medium">{message}</p>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Compact Transaction Type Selector */}
        <motion.div 
          className="mb-6 bg-gradient-to-r from-blue-50 to-teal-50 p-3 rounded-xl shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col items-center">
            <h2 className="text-md font-semibold text-gray-700 mb-2">View Analytics For</h2>
            <div className="flex gap-2">
              {transactionTypeOptions.map((type) => (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    transactionType === type.value
                      ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setTransactionType(type.value)}
                >
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4 text-center"
        >
          {getDashboardTitle()}
        </motion.h1>
          
          {/* Summary Cards */}
          {!isLoading && transactionData.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-4 rounded-xl shadow-md border-b-4 border-blue-500"
              >
                <h3 className="text-gray-500 text-sm font-medium">Transactions</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {transactionData.reduce((sum, day) => sum + day.count, 0)}
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-4 rounded-xl shadow-md border-b-4 border-purple-500"
              >
                <h3 className="text-gray-500 text-sm font-medium">Products {transactionType === "PURCHASE" ? "Purchased" : transactionType === "SALE" ? "Sold" : "Traded"}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {transactionData.reduce((sum, day) => sum + day.quantity, 0)}
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-4 rounded-xl shadow-md border-b-4 border-teal-500"
              >
                <h3 className="text-gray-500 text-sm font-medium">
                  {transactionType === "PURCHASE" ? "Total Expenditure" : 
                   transactionType === "SALE" ? "Total Revenue" : "Total Amount"}
                </h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                ₹{transactionData.reduce((sum, day) => sum + day.amount, 0).toFixed(2)}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Compact Filters Section */}
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap gap-3">
              {dataOptions.map((option) => (
                <motion.button
                  key={option.key}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedData === option.key
                      ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedData(option.key)}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                >
                  {yearOptions.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Chart Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                ></motion.div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={transactionData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.96)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={selectedData}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5, stroke: '#1d4ed8', strokeWidth: 2 }}
                      name={dataOptions.find(o => o.key === selectedData)?.label}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Home;