
import React, { useState, useEffect, useContext } from "react";
import Layout from "./Layout";
import { useParams } from "react-router-dom";
import Mycontext from "../context/Mycontext";

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState("");
  const [showTransactionInfo, setShowTransactionInfo] = useState(true);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const context = useContext(Mycontext);
  const { getTransactionById } = context;

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const transactionData = await getTransactionById(transactionId);
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

  const toggleTransactionInfo = () => setShowTransactionInfo(!showTransactionInfo);
  const toggleProductInfo = () => setShowProductInfo(!showProductInfo);
  const toggleUserInfo = () => setShowUserInfo(!showUserInfo);

  return (
    <Layout>
      {message && (
        <p className="text-red-600 font-medium text-center my-4">{message}</p>
      )}

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
        {transaction && (
          <div className="space-y-8 animate-fade-in transition-all duration-500 ease-in-out">
            {/* Transaction Info */}
            <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
              <button onClick={toggleTransactionInfo} className="flex justify-between w-full text-left">
                <h2 className="text-2xl font-bold text-teal-700 mb-4 border-b pb-2">Transaction Information</h2>
                <span>{showTransactionInfo ? '-' : '+'}</span>
              </button>
              {showTransactionInfo && (
                <div className="space-y-2 text-gray-700 leading-relaxed">
                  <p><span className="font-medium">Type:</span> {transaction.transactionType}</p>
                  <p><span className="font-medium">Note:</span> {transaction.note}</p>
                  <p><span className="font-medium">Total Products:</span> {transaction.totalProducts}</p>
                  <p><span className="font-medium">Total Price:</span> ₹{transaction.totalPrice?.toFixed(2)}</p>
                  <p><span className="font-medium">Created At:</span> {new Date(transaction.createdAt).toLocaleString()}</p>
                  {transaction.updatedAt && (
                    <p><span className="font-medium">Updated At:</span> {new Date(transaction.updatedAt).toLocaleString()}</p>
                  )}
                  {transaction.transactionType === "sale" && (
                    <>
                      <p><span className="font-medium">Buyer Name:</span> {transaction.buyerName}</p>
                      <p><span className="font-medium">Buyer Phone No:</span> {transaction.buyerPhoneNo}</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
              <button onClick={toggleProductInfo} className="flex justify-between w-full text-left">
                <h2 className="text-2xl font-bold text-teal-700 mb-4 border-b pb-2">
                  Products Information ({transaction.product.length})
                </h2>
                <span>{showProductInfo ? '-' : '+'}</span>
              </button>
              {showProductInfo && (
                <div className="divide-y">
                  {transaction.product?.map((prod, index) => (
                    <div key={index} className="py-4 text-gray-700 space-y-1">
                      <p><span className="font-medium">Name:</span> {prod.name}</p>
                      <p><span className="font-medium">Quantity:</span> {transaction.quantity.at(index)}</p>
                      <p><span className="font-medium">Location:</span> {prod.location}</p>
                      <p><span className="font-medium">Price:</span> ₹{prod.price?.toFixed(2)}</p>
                      <p><span className="font-medium">Stock Quantity:</span> {prod.stockQuantity}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Info */}
            {transaction.user && (
              <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
                <button onClick={toggleUserInfo} className="flex justify-between w-full text-left">
                  <h2 className="text-2xl font-bold text-teal-700 mb-4 border-b pb-2">User  Information</h2>
                  <span>{showUserInfo ? '-' : '+'}</span>
                </button>
                {showUserInfo && (
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Name:</span> {transaction.user.username}</p>
                    <p><span className="font-medium">Email:</span> {transaction.user.email}</p>
                    <p><span className="font-medium">Phone Number:</span> {transaction.user.phoneNo}</p>
                    <p><span className="font-medium">Address:</span> {transaction.user.address}</p>
                    <p><span className="font-medium">Created At:</span> {new Date(transaction.createdAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionDetail;