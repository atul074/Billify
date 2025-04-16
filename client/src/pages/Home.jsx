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
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const context = useContext(Mycontext);
  const { userdetail,   getAllTransactions, } = context;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const transactionResponse = await getAllTransactions();
        if (transactionResponse.status === 200) {
          setTransactionData(
            transformTransactionData(
              transactionResponse.transactions,
              selectedMonth,
              selectedYear
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
  }, [selectedMonth, selectedYear]);

  const transformTransactionData = (transactions, month, year) => {
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

      if (transactionMonth === month && transactionYear === year) {
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

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const dataOptions = [
    { key: "count", label: "Total Transactions" },
    { key: "quantity", label: "Product Quantity" },
    { key: "amount", label: "Amount ($)" }
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" })
  }));

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 p-4 md:p-8"
      >
        {message && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-sm"
            role="alert"
          >
            <p>{message}</p>
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-teal-800 mb-8 text-center">Sales Dashboard</h1>
          
          {/* Data Type Selector */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {dataOptions.map((option) => (
              <motion.button
                key={option.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedData === option.key
                    ? "bg-teal-700 text-white shadow-md"
                    : "bg-white text-teal-700 border border-teal-700 hover:bg-teal-50"
                }`}
                onClick={() => setSelectedData(option.key)}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <label htmlFor="month-select" className="text-gray-700 font-medium">
                Month:
              </label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="year-select" className="text-gray-700 font-medium">
                Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                {yearOptions.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Chart Section */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Daily {dataOptions.find(o => o.key === selectedData)?.label} - {monthOptions[selectedMonth-1]?.label} {selectedYear}
            </h2>
            
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={transactionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="day" 
                      label={{ 
                        value: 'Day of Month', 
                        position: 'insideBottomRight', 
                        offset: -10,
                        fill: '#6b7280'
                      }} 
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280' }}
                      label={{ 
                        value: selectedData === 'amount' ? 'Amount ($)' : selectedData === 'quantity' ? 'Quantity' : 'Count',
                        angle: -90, 
                        position: 'insideLeft',
                        fill: '#6b7280'
                      }} 
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={selectedData}
                      stroke="#0d9488"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: '#115e59', strokeWidth: 2 }}
                      name={dataOptions.find(o => o.key === selectedData)?.label}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Summary Cards */}
          {!isLoading && transactionData.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500">
                <h3 className="text-gray-500 font-medium">Total Transactions</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {transactionData.reduce((sum, day) => sum + day.count, 0)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-gray-500 font-medium">Total Products Sold</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {transactionData.reduce((sum, day) => sum + day.quantity, 0)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-gray-500 font-medium">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  ${transactionData.reduce((sum, day) => sum + day.amount, 0).toFixed(2)}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Home;