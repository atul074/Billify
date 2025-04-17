import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiShoppingCart, FiUser, FiPhone, FiFileText, FiDownload, FiArrowLeft } from "react-icons/fi";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";
import { generateInvoiceData, downloadInvoicePDF, InvoicePreview } from "./InvoicePreview";

const Sell = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { productId: "", quantity: "" },
  ]);
  const [note, setNote] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [template, setTemplate] = useState("");
  const [buyerPhoneNo, setBuyerPhoneNo] = useState("");
  const [message, setMessage] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);

  const context = useContext(Mycontext);
  const { getAllProducts, userdetail, sellProduct, getDefaultTemplate } = context;

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

    const getTemplate = async () => {
      const template = await getDefaultTemplate();
      setTemplate(template.data);
    };

    fetchProducts();
    getTemplate();
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

    const isEmpty = selectedProducts.some(
      (item) => !item.productId || !item.quantity
    );

    if (isEmpty || !buyerName || !buyerPhoneNo) {
      showMessage("Please fill all fields, including buyer info.");
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
      buyerName,
      buyerPhoneNo,
    };

    try {
      await sellProduct(body);
      const formData = { selectedProducts, buyerName, buyerPhoneNo, note };
      const invoice = generateInvoiceData(formData, products, userdetail);
      setInvoiceData(invoice);
      showMessage("Products sold successfully! Invoice generated.");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error selling products: " + error
      );
    }
  };

  const handleDownloadInvoice = async () => {
    downloadInvoicePDF(invoiceData, template);
  };

  const handleNewSale = () => {
    setSelectedProducts([{ productId: "", quantity: "" }]);
    setNote("");
    setBuyerName("");
    setBuyerPhoneNo("");
    setInvoiceData(null);
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center text-white bg-teal-500 px-4 py-2 rounded-md mb-6 max-w-xl mx-auto shadow-md"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 py-8"
      >
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-5 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <FiShoppingCart className="inline" /> Sell Products
            </h1>
          </div>

          {invoiceData ? (
            <div className="p-6">
              <InvoicePreview
                invoiceData={invoiceData}
                template={template}
              />
              <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNewSale}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FiArrowLeft /> New Sale
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadInvoice}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FiDownload /> Download Invoice
                </motion.button>
              </div>
            </div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="mb-6"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="mb-3 text-gray-700 font-medium flex items-center gap-2">
                  <FiUser className="text-teal-500" /> Buyer Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className=" mb-3 text-gray-700 font-medium flex items-center gap-2">
                  <FiPhone className="text-teal-500" /> Buyer Phone No
                </label>
                <input
                  type="text"
                  value={buyerPhoneNo}
                  onChange={(e) => setBuyerPhoneNo(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </motion.div>

              {selectedProducts.map((item, index) => (
                <motion.div
                  key={index}
                  className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <label className="block mb-3 text-gray-700 font-medium">
                    Product #{index + 1}
                  </label>
                  <div className="flex gap-3 items-center">
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleProductChange(index, "productId", e.target.value)
                      }
                      required
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                      value={item.quantity}
                      onChange={(e) =>
                        handleProductChange(index, "quantity", e.target.value)
                      }
                      placeholder="Qty"
                      required
                      min="1"
                      className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />

                    {selectedProducts.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={() => removeProductField(index)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiX />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.div
                className="mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + selectedProducts.length * 0.1 }}
              >
                <motion.button
                  type="button"
                  onClick={addProductField}
                  className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
                  whileHover={{ x: 2 }}
                >
                  <FiPlus /> Add Another Product
                </motion.button>
              </motion.div>

              <motion.div
                className="mb-8"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + selectedProducts.length * 0.1 }}
              >
                <label className=" mb-3 text-gray-700 font-medium flex items-center gap-2">
                  <FiFileText className="text-teal-500" /> Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows="3"
                />
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + selectedProducts.length * 0.1 }}
              >
                <FiShoppingCart /> Process Sale
              </motion.button>
            </motion.form>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Sell;