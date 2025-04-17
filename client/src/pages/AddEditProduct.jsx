import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FiPackage, FiDollarSign, FiLayers, FiMapPin, FiSave } from "react-icons/fi";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";

const AddEditProduct = () => {
  const context = useContext(Mycontext);
  const { addProduct, updateProduct, getProductById } = context;
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    location: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductById = async () => {
      if (productId) {
        setIsEditing(true);
        try {
          const productData = await getProductById(productId);
          if (productData?.status === 200) {
            setFormData({
              name: productData.product.name,
              price: productData.product.price,
              stockQuantity: productData.product.stockQuantity,
              location: productData.product.location
            });
          } else {
            showMessage(productData.message);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message ||
              "Error Getting a Product by Id: " + error
          );
        }
      }
    };

    if (productId) fetchProductById();
  }, [productId]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    try {
      if (isEditing) {
        submitData.append("productId", productId);
        await updateProduct(submitData);
        showMessage("Product successfully updated 🎉");
      } else {
        await addProduct(submitData);
        showMessage("Product successfully added 🤩");
      }
      setTimeout(() => navigate("/product"), 1500);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Saving Product: " + error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <AnimatePresence>
        {message && (
          <motion.div
            className="mx-auto max-w-2xl mb-6 p-4 rounded-lg shadow-lg"
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-xl border border-gray-100">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <FiPackage className="text-3xl text-teal-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 font-medium mb-2">Product Name</label>
              <div className="relative">
                <FiPackage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                  placeholder="Enter product name"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 font-medium mb-2">Price</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                  placeholder="Enter price"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-gray-700 font-medium mb-2">Stock Quantity</label>
              <div className="relative">
                <FiLayers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                  placeholder="Enter quantity"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                  placeholder="Enter location"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-4"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-md text-white font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-teal-600 to-cyan-600'}`}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <FiSave />
                    {isEditing ? "Update Product" : "Add Product"}
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AddEditProduct;