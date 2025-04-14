import React, { useState, useEffect, useContext } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import Mycontext from "../context/Mycontext";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [message, setMessage] = useState("");

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
        console.log(transactionData.transactions);
        
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
      {message && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-center font-medium">
          {message}
        </div>
      )}

      <div className="p-4 sm:p-6 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Transactions</h1>

        {/* Filter UI */}
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Types</option>
            <option value="SALE">Sale</option>
            <option value="PURCHASE">Purchase</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-3 py-2 rounded w-28"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-3 py-2 rounded w-28"
          />
        </div>

        {/* Table with animation on render */}
        <div className="overflow-x-auto transition-all duration-500 ease-in-out transform">
          {filteredTransactions.length > 0 ? (
            <table className="min-w-full bg-white text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
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
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-teal-50 transition duration-200`}
                  >
                    <td className="px-6 py-4 capitalize">{transaction.transactionType}</td>
                    <td className="px-6 py-4">₹{transaction.totalPrice}</td>
                    <td className="px-6 py-4">{transaction.totalProducts}</td>
                    <td className="px-6 py-4">{transaction.note}</td>
                    <td className="px-6 py-4">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigateToTransactionDetailsPage(transaction.id)}
                        className="bg-teal-600 hover:bg-teal-800 text-white px-4 py-2 rounded font-semibold transition duration-200"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 mt-4">No transactions found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Transaction;
