// Full Invoice Selling Page with Live Preview, Template Picker, and PDF Download

import React, { useState, useEffect, useRef, useContext } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";

const SellWithInvoicePreview = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([{ productId: "", quantity: "" }]);
  const [note, setNote] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhoneNo, setBuyerPhoneNo] = useState("");
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const invoiceRef = useRef(null);
  const context = useContext(Mycontext);
  const { getAllProducts, getAllTemplate, userdetail, sellProduct } = context;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productData = await getAllProducts();
        setProducts(productData.products);

        const templateData = await getAllTemplate();
        setTemplates(templateData);
        const defaultTemplate = templateData.find(t => t.defaultTemplate);
        setSelectedTemplate(defaultTemplate || null);
      } catch (error) {
        showMessage("Error fetching initial data");
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

    const isEmpty = selectedProducts.some(item => !item.productId || !item.quantity);

    if (isEmpty || !buyerName || !buyerPhoneNo) {
      showMessage("Please fill all fields, including buyer info.");
      return;
    }

    const body = {
      productId: selectedProducts.map(item => item.productId),
      quantity: selectedProducts.map(item => parseInt(item.quantity)),
      note,
      email: userdetail.email,
      buyerName,
      buyerPhoneNo,
    };

    try {
      const response = await sellProduct(body);
      showMessage(response.message || "Products sold successfully!");
      resetForm();
    } catch (error) {
      showMessage("Error during selling products");
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
    setTimeout(() => setMessage(""), 4000);
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("invoice.pdf");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-6 p-4">
        {message && <div className="bg-green-500 text-white text-center py-2 mb-4 rounded">{message}</div>}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold text-teal-700 mb-4">Sell Product</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Buyer Name"
                className="w-full mb-3 px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                value={buyerPhoneNo}
                onChange={(e) => setBuyerPhoneNo(e.target.value)}
                placeholder="Buyer Phone"
                className="w-full mb-3 px-4 py-2 border rounded"
                required
              />

              {selectedProducts.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={item.productId}
                    onChange={(e) => handleProductChange(index, "productId", e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    className="w-24 px-3 py-2 border rounded"
                    placeholder="Qty"
                    required
                  />
                  {selectedProducts.length > 1 && (
                    <button type="button" onClick={() => removeProductField(index)} className="text-red-600">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addProductField} className="text-sm text-teal-600 hover:underline mb-2">
                + Add Product
              </button>

              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note"
                className="w-full mb-3 px-4 py-2 border rounded"
              />

              <select
                className="w-full mb-4 px-3 py-2 border rounded"
                value={selectedTemplate?.id || ""}
                onChange={(e) => {
                  const selected = templates.find(t => t.id === e.target.value);
                  setSelectedTemplate(selected);
                }}
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>{template.originalName}</option>
                ))}
              </select>

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded">Sell Products</button>
            </form>
          </div>

          {/* Live Preview */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-semibold mb-2 text-teal-700">Live Invoice Preview</h2>
            <div ref={invoiceRef} className="relative w-full h-[600px] border rounded overflow-hidden shadow-md">
              {selectedTemplate && (
                <img
                  src={`http://localhost:8087/api/templates/${selectedTemplate.id}/preview`}
                  alt="Invoice Template"
                  className="absolute inset-0 w-full h-full object-contain z-0"
                />
              )}
              <div className="absolute top-20 left-12 z-10 text-black">
                <p className="text-lg font-bold">Buyer: {buyerName}</p>
                <p className="text-md">Phone: {buyerPhoneNo}</p>
                <p className="mt-2 font-semibold">Note: {note}</p>
                <ul className="mt-4 text-sm list-disc list-inside">
                  {selectedProducts.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <li key={idx}>{product?.name || "Unknown"} - {item.quantity}</li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <button
              onClick={downloadPDF}
              className="mt-4 bg-teal-700 hover:bg-teal-800 text-white py-2 px-4 rounded"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellWithInvoicePreview;
