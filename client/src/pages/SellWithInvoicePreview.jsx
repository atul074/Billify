import React, { useState, useEffect, useContext } from "react";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";
import InvoicePreview from "./InvoicePreview";

const SellWithInvoicePreview = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { productId: "", quantity: "" },
  ]);
  const [note, setNote] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhoneNo, setBuyerPhoneNo] = useState("");
  const [message, setMessage] = useState("");

  const context = useContext(Mycontext);
  const { getAllProducts, userdetail, sellProduct} = context;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productData = await getAllProducts();
        setProducts(productData.products);

        
    
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Initialization Error: " + error
        );
      }
    };

    fetchInitialData();
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
      const response = await sellProduct(body);
      showMessage(response.message || "Products purchased successfully!");
      resetForm();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Purchasing Products: " + error
      );
    }
  };

  const resetForm = () => {
    setSelectedProducts([{ productId: "", quantity: "" }]);
    setNote("");
    setBuyerName("");
    setBuyerPhoneNo("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && (
        <div className="text-center text-white bg-teal-500 px-4 py-2 rounded-md mb-4 max-w-xl mx-auto">
          {message}
        </div>
      )}
      <div className="max-w-6xl mx-auto mt-8 flex gap-6">
        <div className="w-1/2 p-6 bg-gray-100 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-teal-700">
            Sell Product
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">
                Buyer Name
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">
                Buyer Phone No
              </label>
              <input
                type="text"
                value={buyerPhoneNo}
                onChange={(e) => setBuyerPhoneNo(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {selectedProducts.map((item, index) => (
              <div key={index} className="mb-4 border-b pb-4">
                <label className="block mb-2 text-gray-700 font-medium">
                  Product #{index + 1}
                </label>
                <div className="flex gap-2">
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      handleProductChange(index, "productId", e.target.value)
                    }
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                    placeholder="Quantity"
                    required
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {selectedProducts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProductField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addProductField}
              className="text-sm text-teal-600 hover:underline mb-4"
            >
              + Add Product
            </button>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Sell Products
            </button>
          </form>
        </div>
        <InvoicePreview
          products={products}
          selectedProductsId={selectedProducts}
          buyerName={buyerName}
          buyerPhoneNo={buyerPhoneNo}
          note={note}
        />
      </div>
    </Layout>
  );
};

export default SellWithInvoicePreview;
