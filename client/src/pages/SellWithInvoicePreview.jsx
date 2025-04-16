import React, { useState, useEffect, useContext } from "react";
import Layout from "./Layout";
import Mycontext from "../context/Mycontext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Sell2 = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { productId: "", quantity: "" },
  ]);
  const [note, setNote] = useState("");
  const [buyerName, setBuyerName] = useState("");
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

  const generateInvoice = (saleData) => {
    const invoiceItems = saleData.products.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      total: item.quantity * item.product.price
    }));

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const invoiceNumber = `INV-${Date.now()}`;
    const date = new Date().toLocaleDateString();

    const invoice = {
      invoiceNumber,
      date,
      seller: {
        name: userdetail.name,
        email: userdetail.email
      },
      buyer: {
        name: saleData.buyerName,
        phone: saleData.buyerPhoneNo
      },
      items: invoiceItems,
      subtotal,
      note: saleData.note
    };

    setInvoiceData(invoice);
    return invoice;
  };

  const downloadInvoice = () => {
    if (!invoiceData) return;

    const doc = new jsPDF();
    const template = getDefaultTemplate();

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(template.header.title, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 14, 30);
    doc.text(`Date: ${invoiceData.date}`, 14, 38);

    // Add seller and buyer info
    doc.setFontSize(14);
    doc.text("Seller Information:", 14, 50);
    doc.setFontSize(12);
    doc.text(`Name: ${invoiceData.seller.name}`, 14, 58);
    doc.text(`Email: ${invoiceData.seller.email}`, 14, 66);

    doc.setFontSize(14);
    doc.text("Buyer Information:", 105, 50);
    doc.setFontSize(12);
    doc.text(`Name: ${invoiceData.buyer.name}`, 105, 58);
    doc.text(`Phone: ${invoiceData.buyer.phone}`, 105, 66);

    // Add table
    const headers = [["Product", "Quantity", "Price", "Total"]];
    const data = invoiceData.items.map(item => [
      item.name,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${item.total.toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 80,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: template.table.headerColor,
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: template.table.alternateColor
      }
    });

    // Add totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Subtotal: $${invoiceData.subtotal.toFixed(2)}`, 160, finalY);

    // Add note if exists
    if (invoiceData.note) {
      doc.setFontSize(12);
      doc.text(`Note: ${invoiceData.note}`, 14, finalY + 10, { maxWidth: 180 });
    }

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(template.footer.text, 105, 285, { align: 'center' });

    doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
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
      console.log(body);
      
      const response = await sellProduct(body);
      const invoice = generateInvoice(response.sale);
      showMessage(response.message || "Products sold successfully! Invoice generated.");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error selling products: " + error
      );
    }
  };

  const resetForm = () => {
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
      {message && (
        <div className="text-center text-white bg-teal-500 px-4 py-2 rounded-md mb-4 max-w-xl mx-auto">
          {message}
        </div>
      )}
      <div className="max-w-xl mx-auto mt-8 p-6 bg-gray-100 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-teal-700">
          Sell Product
        </h1>
        
        {invoiceData ? (
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Invoice #{invoiceData.invoiceNumber}</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold">Seller</h3>
                <p>{invoiceData.seller.name}</p>
                <p>{invoiceData.seller.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Buyer</h3>
                <p>{invoiceData.buyer.name}</p>
                <p>{invoiceData.buyer.phone}</p>
              </div>
            </div>
            
            <table className="w-full mb-6">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                    <td className="p-2 text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-teal-600">
                  <td colSpan="3" className="p-2 text-right font-semibold">Subtotal:</td>
                  <td className="p-2 text-right font-semibold">${invoiceData.subtotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            {invoiceData.note && (
              <div className="mb-6">
                <p className="font-semibold">Note:</p>
                <p>{invoiceData.note}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                New Sale
              </button>
              <button
                onClick={downloadInvoice}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Download Invoice
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Buyer Info */}
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

            {/* Product Fields */}
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
                        {product.name} (${product.price})
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
                    min="1"
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

            {/* Note */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Sell Products
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default Sell2;