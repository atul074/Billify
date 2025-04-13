import React, { useState, useEffect, useContext } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import Mycontext from "../context/Mycontext";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const context = useContext(Mycontext);
  const { getAllTransactions } = context;

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactionData = await getAllTransactions();
        console.log(transactionData);
        
        if (transactionData.status === 200) {
          setTransactions(transactionData.transactions);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting transactions: " + error
        );
      }
    };

    getTransactions();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
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

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white ">
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
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4">{transaction.transactionType}</td>
                    <td className="px-6 py-4">{transaction.totalPrice}</td>
                    <td className="px-6 py-4">{transaction.totalProducts}</td>
                    <td className="px-6 py-4">{transaction.note}</td>
                    <td className="px-6 py-4">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigateToTransactionDetailsPage(transaction.id)
                        }
                        className="bg-teal-600 hover:bg-teal-800 text-white px-4 py-2 rounded font-semibold transition duration-200"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No transactions found.</p>
        )}
      </div>
    </Layout>
  );
};

export default Transaction;
