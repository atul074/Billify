import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiChevronDown } from "react-icons/fi";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showZeroStock, setShowZeroStock] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const { addProduct, getAllProducts, deleteProduct } = context;

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const productData = await getAllProducts();
        if (productData?.status === 200) {
          setProducts(productData.products);
          setFilteredProducts(productData.products);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Products: " + error
        );
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    if (showZeroStock) {
      setFilteredProducts(products.filter(p => p.stockQuantity === 0));
    } else {
      setFilteredProducts(products);
    }
  }, [showZeroStock, products]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      try {
        await deleteProduct(productId);
        showMessage("Product successfully deleted");
        setProducts(products.filter((p) => p.id !== productId));
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error deleting product: " + error
        );
      }
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const zeroStockItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: { 
      y: -5, 
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      borderColor: "#ef4444"
    }
  };

  return (
    <Layout>
      <AnimatePresence>
        {message && (
          <motion.div
            className="mb-6 p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <FiPackage className="text-3xl text-teal-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Product Inventory
            </h1>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>Filter</span>
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown />
                </motion.span>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2">
                      <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showZeroStock}
                          onChange={() => setShowZeroStock(!showZeroStock)}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span>Show Zero Stock Only</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg shadow-md"
              onClick={() => navigate("/add-product")}
            >
              <FiPlus />
              Add Product
            </motion.button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={product.stockQuantity === 0 ? zeroStockItemVariants : itemVariants}
                whileHover={product.stockQuantity === 0 ? "hover" : { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className={`bg-white rounded-xl overflow-hidden shadow-lg border ${
                  product.stockQuantity === 0 ? "border-red-200" : "border-gray-100"
                }`}
              >
                <div className="p-5">
                  <h3 className={`text-xl font-semibold mb-2 truncate ${
                    product.stockQuantity === 0 ? "text-red-600" : "text-gray-800"
                  }`}>
                    {product.name}
                    {product.stockQuantity === 0 && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex justify-between">
                      <span>Price:</span>
                      <span className={`font-medium ${
                        product.stockQuantity === 0 ? "text-red-600" : "bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
                      }`}>
                        ₹{product.price}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Stock:</span>
                      <span className={`font-medium ${
                        product.stockQuantity === 0 ? "text-red-600" : ""
                      }`}>
                        {product.stockQuantity}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{product.location}</span>
                    </p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${
                        product.stockQuantity === 0 
                          ? "bg-red-100 text-red-700" 
                          : "bg-teal-100 text-teal-700"
                      }`}
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <motion.div
            className="bg-white rounded-xl p-8 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FiPackage className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {showZeroStock ? "No zero stock products found" : "No products found"}
            </h3>
            <p className="text-gray-500 mb-4">
              {showZeroStock 
                ? "All products currently have stock available" 
                : "Get started by adding your first product"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg shadow-md"
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </motion.button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Product;