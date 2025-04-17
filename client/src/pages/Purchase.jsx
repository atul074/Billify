import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiShoppingCart, FiClipboard, FiPackage, FiDollarSign } from "react-icons/fi";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";

const Purchase = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { productId: "", quantity: "" },
  ]);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const context = useContext(Mycontext);
  const { purchaseProduct, getAllProducts, userdetail } = context;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await getAllProducts();
        setProducts(productData.products);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Products: " + error
        );
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    setSelectedProducts(updated);
  };

  const addProductField = () => {
    setSelectedProducts([...selectedProducts, { productId: "", quantity: "" }]);
  };

  const removeProductField = (index) => {
    const updated = [...selectedProducts];
    updated.splice(index, 1);
    setSelectedProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEmpty = selectedProducts.some(
      (item) => !item.productId || !item.quantity
    );

    if (isEmpty) {
      showMessage("Please select all products and enter quantities.");
      setIsSubmitting(false);
      return;
    }

    const productId = selectedProducts.map((item) => item.productId);
    const quantity = selectedProducts.map((item) => parseInt(item.quantity));
    const email = userdetail.email;
    const body = {
      productId,
      quantity,
      note,
      email,
    };

    try {
      const response = await purchaseProduct(body);
      showMessage(response.message || "Products purchased successfully!");
      resetForm();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Purchasing Products: " + error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedProducts([{ productId: "", quantity: "" }]);
    setNote("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      <AnimatePresence>
        {message && (
          <motion.div
            className="mx-auto max-w-4xl mb-6 p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              background: message.includes("success") 
                ? "linear-gradient(135deg, #4ade80, #22d3ee)"
                : "linear-gradient(135deg, #f87171, #f59e0b)"
            }}
          >
            <p className="text-white font-medium text-center">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Section - Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-xl border border-gray-100">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                <FiShoppingCart className="text-3xl text-teal-600" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Receive Inventory
                </h1>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {selectedProducts.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 border-b border-gray-200 pb-4"
                    >
                      <label className="block mb-2 text-gray-700 font-medium">
                        Product #{index + 1}
                      </label>
                      <div className="flex gap-3 items-center">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            handleProductChange(index, "productId", e.target.value)
                          }
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                        >
                          <option value="">Select a product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (₹{product.price})
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleProductChange(index, "quantity", e.target.value)
                          }
                          placeholder="Qty"
                          required
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                        />

                        {selectedProducts.length > 1 && (
                          <motion.button
                            type="button"
                            onClick={() => removeProductField(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <FiTrash2 />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={addProductField}
                    className="text-sm flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium"
                  >
                    <FiPlus /> Add Another Product
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className=" mb-2 text-gray-700 font-medium flex items-center gap-2">
                    <FiClipboard /> Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm min-h-[80px]"
                    placeholder="Any additional notes..."
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-md text-white font-medium ${
                      isSubmitting ? "bg-gray-400" : "bg-gradient-to-r from-teal-600 to-cyan-600"
                    }`}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <FiShoppingCart />
                        Purchase Products
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </div>

          {/* Right Section - Summary/Info */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-xl border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiPackage className="text-teal-600" />
                Quick Summary
              </h2>
              
              <div className="space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-medium text-teal-700 mb-2">Current Selection</h3>
                  {selectedProducts.filter(p => p.productId).length > 0 ? (
                    <ul className="space-y-2">
                      {selectedProducts.filter(p => p.productId).map((item, index) => {
                        const product = products.find(p => p.id === item.productId);
                        return product ? (
                          <li key={index} className="flex justify-between text-sm">
                            <span className="truncate max-w-[120px]">{product.name}</span>
                            <span className="font-medium">x{item.quantity}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No products selected yet</p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">Recent Products</h3>
                  {products.slice(0, 5).length > 0 ? (
                    <ul className="space-y-2">
                      {products.slice(0, 5).map((product) => (
                        <li key={product.id} className="flex justify-between text-sm">
                          <span className="truncate max-w-[120px]">{product.name}</span>
                          <span className="font-medium">₹{product.price}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No recent products</p>
                  )}
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-700 mb-2">Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span> Double check quantities before submitting
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span> Use notes to record supplier info
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-500">•</span> Click the + button to add multiple products
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Purchase;