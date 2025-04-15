import React, { useContext, useRef } from "react";
import html2pdf from "html2pdf.js";
import Mycontext from "../context/Mycontext";

const InvoicePreview = ({ products, selectedProducts, buyerName, buyerPhoneNo, note, templateImage }) => {
  const ref = useRef();

  const context=useContext(Mycontext);
    const{getProductById}=context;

  

  const downloadPDF = () => {
    html2pdf().from(ref.current).set({
      margin: 0,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    }).save();
  };
  console.log();
  
  
  

  return (
    <div className="w-1/2">
      <div ref={ref} className="relative w-full h-[600px] border shadow overflow-hidden">
        <img src={templateImage} alt="Template" className="w-full h-full object-cover absolute" />
        <div className="absolute top-20 left-10 text-black">
          <p className="text-lg font-bold">Buyer: {buyerName}</p>
          <p className="text-md">Phone: {buyerPhoneNo}</p>
          <p className="text-md mt-4 font-bold">Items:</p>
          <ul className="pl-4 list-disc">
            {selectedProducts.map((p, idx) => (
             <li key={idx}>{getProduct(p.productId)} — Qty: {p.quantity}</li>
            ))}
          </ul>
          <p className="mt-4">Note: {note}</p>
        </div>
      </div>
      <button onClick={downloadPDF} className="mt-4 px-4 py-2 bg-teal-700 text-white rounded">
        Download PDF
      </button>
    </div>
  );
};

export default InvoicePreview;
