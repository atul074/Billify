import html2pdf from 'html2pdf.js';

export const generateInvoiceData = (formData, products, user) => {
  const { selectedProducts, buyerName, buyerPhoneNo, note } = formData;
  
  const invoiceItems = selectedProducts
    .filter(item => item.productId && item.quantity)
    .map(item => {
      const product = products.find(p => 
        String(p.productId) === String(item.productId) || 
        String(p.id) === String(item.productId)
      );
      
      return {
        name: product?.name || "Unknown Product",
        quantity: parseInt(item.quantity),
        price: product?.price || 0,
        total: parseInt(item.quantity) * (product?.price || 0)
      };
    });

  if (invoiceItems.length === 0) {
    return null;
  }

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return {
    invoiceNumber,
    date,
    seller: {
      name: user.username,
      email: user.email,
      phoneNo: user.phoneNo,
      address: user.address
    },
    buyer: {
      name: buyerName,
      phone: buyerPhoneNo
    },
    items: invoiceItems,
    subtotal,
    note
  };
};

const generateInvoiceHTML = (invoiceData, template) => {
  return `
    <div style="
      position: relative;
      width: 800px;
      margin: 0 auto;
      padding: 40px;
      font-family: 'Arial', sans-serif;
      color: #333;
      line-height: 1.5;
    ">
      <!-- Background Template -->
      ${template ? `
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(${template});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.1;
          z-index: 0;
        "></div>
      ` : ''}

      <!-- Content Container -->
      <div style="position: relative; z-index: 10;">
        <!-- Header -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        ">
          <div>
            <h1 style="
              font-size: 28px;
              font-weight: 700;
              color: #0d9488;
              margin: 0;
            ">
              INVOICE
            </h1>
            <p style="color: #64748b; margin: 5px 0 0; font-size: 14px;">#${invoiceData.invoiceNumber}</p>
          </div>
          <div style="text-align: right;">
            <p style="color: #64748b; margin: 8px 0 0; font-size: 14px;">${invoiceData.date}</p>
          </div>
        </div>

        <!-- Seller/Buyer Info -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        ">
          <div>
            <h3 style="
              font-size: 16px;
              font-weight: 600;
              color: #0d9488;
              margin-bottom: 12px;
              border-bottom: 2px solid #0d9488;
              padding-bottom: 6px;
              display: inline-block;
            ">
              SELLER DETAILS
            </h3>
            <div style="margin-top: 12px; font-size: 14px;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${invoiceData.seller.name}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${invoiceData.seller.email}</p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> ${invoiceData.seller.phoneNo}</p>
              <p style="margin: 8px 0;"><strong>Address:</strong> ${invoiceData.seller.address}</p>
            </div>
          </div>
          
          <div>
            <h3 style="
              font-size: 16px;
              font-weight: 600;
              color: #0d9488;
              margin-bottom: 12px;
              border-bottom: 2px solid #0d9488;
              padding-bottom: 6px;
              display: inline-block;
            ">
              BUYER DETAILS
            </h3>
            <div style="margin-top: 12px; font-size: 14px;">
              <p style="margin: 8px 0;"><strong>Name:</strong> ${invoiceData.buyer.name}</p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> ${invoiceData.buyer.phone}</p>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 14px;
        ">
          <thead>
            <tr style="
              background-color: #0d9488;
              color: white;
              font-weight: 600;
            ">
              <th style="padding: 12px 16px; text-align: left;">Item</th>
              <th style="padding: 12px 16px; text-align: right;">Qty</th>
              <th style="padding: 12px 16px; text-align: right;">Price</th>
              <th style="padding: 12px 16px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map((item, index) => `
              <tr style="${index % 2 === 0 ? 'background-color: rgba(248, 250, 252, 0.8);' : 'background-color: rgba(255, 255, 255, 0.8);'}">
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
                <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #e2e8f0;">${item.quantity}</td>
                <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #e2e8f0;">₹${item.price.toFixed(2)}</td>
                <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #e2e8f0;">₹${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Total -->
        <div style="
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
        ">
          <div style="width: 300px;">
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 12px 16px;
              background-color: rgba(248, 250, 252, 0.8);
              border-radius: 6px;
              font-weight: 600;
              font-size: 14px;
            ">
              <span>Subtotal</span>
              <span>₹${invoiceData.subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Note -->
        ${invoiceData.note ? `
          <div style="
            margin-bottom: 30px;
            padding: 16px;
            background-color: rgba(240, 253, 250, 0.8);
            border-left: 4px solid #0d9488;
            border-radius: 0 6px 6px 0;
            font-size: 14px;
          ">
            <p style="font-weight: 600; color: #0d9488; margin-bottom: 8px;">Note</p>
            <p style="margin: 0; color: #334155;">${invoiceData.note}</p>
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="
          text-align: center;
          padding-top: 30px;
          margin-top: 40px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        ">
          <p style="margin: 0 0 8px;">Thank you for your business!</p>
          <p style="margin: 0;">Please contact us if you have any questions</p>
        </div>
      </div>
    </div>
  `;
};

export const downloadInvoicePDF = (invoiceData, template) => {
  if (!invoiceData) return;

  const element = document.createElement('div');
  element.style.width = '800px';
  element.style.margin = '0 auto';
  
  element.innerHTML = generateInvoiceHTML(invoiceData, template);

  document.body.appendChild(element);

  const opt = {
    margin: 0,
    filename: `invoice_${invoiceData.invoiceNumber}.pdf`,
    image: { 
      type: 'jpeg', 
      quality: 1
    },
    html2canvas: { 
      scale: 3,
      useCORS: true,
      letterRendering: true,
      allowTaint: true,
      logging: true,
      backgroundColor: null,
      width: 800
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: false
    }
  };

  // Ensure the image is loaded before generating PDF
  const images = element.getElementsByTagName('img');
  if (images.length > 0) {
    images[0].onload = () => {
      setTimeout(() => {
        html2pdf()
          .set(opt)
          .from(element)
          .save()
          .then(() => {
            document.body.removeChild(element);
          });
      }, 500);
    };
  } else {
    setTimeout(() => {
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          document.body.removeChild(element);
        });
    }, 500);
  }
};

export const InvoicePreview = ({ invoiceData, template }) => {
  if (!invoiceData) return null;

  return (
    <div className="relative bg-white rounded-xl overflow-hidden p-8 max-w-4xl mx-auto">
      {/* Background image with overlay */}
      {template && (
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src={template} 
            alt="Invoice background" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-teal-600">INVOICE</h1>
            <p className="text-gray-500 text-sm">#{invoiceData.invoiceNumber}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 text-sm">{invoiceData.date}</p>
          </div>
        </div>

        {/* Seller/Buyer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 inline-block">
              SELLER DETAILS
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Name:</strong> {invoiceData.seller.name}</p>
              <p><strong>Email:</strong> {invoiceData.seller.email}</p>
              <p><strong>Phone:</strong> {invoiceData.seller.phoneNo}</p>
              <p><strong>Address:</strong> {invoiceData.seller.address}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 inline-block">
              BUYER DETAILS
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Name:</strong> {invoiceData.buyer.name}</p>
              <p><strong>Phone:</strong> {invoiceData.buyer.phone}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="text-left py-3 px-4">Item</th>
                <th className="text-right py-3 px-4">Qty</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 border-b border-gray-200">{item.name}</td>
                  <td className="py-3 px-4 text-right border-b border-gray-200">{item.quantity}</td>
                  <td className="py-3 px-4 text-right border-b border-gray-200">₹{item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right border-b border-gray-200">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>₹{invoiceData.subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        {invoiceData.note && (
          <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-lg mb-10 text-sm">
            <p className="font-semibold text-teal-600 mb-2">Note</p>
            <p className="text-gray-700">{invoiceData.note}</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 mt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p className="mb-2">Thank you for your business!</p>
          <p>Please contact us if you have any questions</p>
        </div>
      </div>
    </div>
  );
};

// const generateInvoiceHTML = (invoiceData) => {
//   return `
//     <div style="
//       background-color: white;
//       padding: 40px;
//       border-radius: 12px;
//       font-family: 'Arial', sans-serif;
//       color: #333;
//       width: 800px;
//       margin: 0 auto;
//       line-height: 1.5;
//     ">
//       <!-- Header -->
//       <div style="
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 30px;
//         padding-bottom: 20px;
//         border-bottom: 1px solid #e2e8f0;
//       ">
//         <div>
//           <h1 style="
//             font-size: 28px;
//             font-weight: 700;
//             color: #0d9488;
//             margin: 0;
//           ">
//             INVOICE
//           </h1>
//           <p style="color: #64748b; margin: 5px 0 0; font-size: 14px;">#${invoiceData.invoiceNumber}</p>
//         </div>
//         <div style="text-align: right;">
//           <p style="color: #64748b; margin: 8px 0 0; font-size: 14px;">${invoiceData.date}</p>
//         </div>
//       </div>

//       <!-- Seller/Buyer Info -->
//       <div style="
//         display: grid;
//         grid-template-columns: 1fr 1fr;
//         gap: 30px;
//         margin-bottom: 40px;
//       ">
//         <div>
//           <h3 style="
//             font-size: 16px;
//             font-weight: 600;
//             color: #0d9488;
//             margin-bottom: 12px;
//             border-bottom: 2px solid #0d9488;
//             padding-bottom: 6px;
//             display: inline-block;
//           ">
//             SELLER DETAILS
//           </h3>
//           <div style="margin-top: 12px; font-size: 14px;">
//             <p style="margin: 8px 0;"><strong>Name:</strong> ${invoiceData.seller.name}</p>
//             <p style="margin: 8px 0;"><strong>Email:</strong> ${invoiceData.seller.email}</p>
//             <p style="margin: 8px 0;"><strong>Phone:</strong> ${invoiceData.seller.phoneNo}</p>
//             <p style="margin: 8px 0;"><strong>Address:</strong> ${invoiceData.seller.address}</p>
//           </div>
//         </div>
        
//         <div>
//           <h3 style="
//             font-size: 16px;
//             font-weight: 600;
//             color: #0d9488;
//             margin-bottom: 12px;
//             border-bottom: 2px solid #0d9488;
//             padding-bottom: 6px;
//             display: inline-block;
//           ">
//             BUYER DETAILS
//           </h3>
//           <div style="margin-top: 12px; font-size: 14px;">
//             <p style="margin: 8px 0;"><strong>Name:</strong> ${invoiceData.buyer.name}</p>
//             <p style="margin: 8px 0;"><strong>Phone:</strong> ${invoiceData.buyer.phone}</p>
//           </div>
//         </div>
//       </div>

//       <!-- Items Table -->
//       <table style="
//         width: 100%;
//         border-collapse: collapse;
//         margin-bottom: 30px;
//         font-size: 14px;
//       ">
//         <thead>
//           <tr style="
//             background-color: #0d9488;
//             color: white;
//             font-weight: 600;
//           ">
//             <th style="
//               padding: 12px 16px;
//               text-align: left;
//             ">Item</th>
//             <th style="padding: 12px 16px; text-align: right;">Qty</th>
//             <th style="padding: 12px 16px; text-align: right;">Price</th>
//             <th style="padding: 12px 16px; text-align: right;">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${invoiceData.items.map((item, index) => `
//             <tr style="${index % 2 === 0 ? 'background-color: #f8fafc;' : ''}">
//               <td style="
//                 padding: 12px 16px;
//                 border-bottom: 1px solid #e2e8f0;
//               ">${item.name}</td>
//               <td style="
//                 padding: 12px 16px;
//                 text-align: right;
//                 border-bottom: 1px solid #e2e8f0;
//               ">${item.quantity}</td>
//               <td style="
//                 padding: 12px 16px;
//                 text-align: right;
//                 border-bottom: 1px solid #e2e8f0;
//               ">₹${item.price.toFixed(2)}</td>
//               <td style="
//                 padding: 12px 16px;
//                 text-align: right;
//                 border-bottom: 1px solid #e2e8f0;
//               ">₹${item.total.toFixed(2)}</td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>

//       <!-- Total -->
//       <div style="
//         display: flex;
//         justify-content: flex-end;
//         margin-bottom: 30px;
//       ">
//         <div style="width: 300px;">
//           <div style="
//             display: flex;
//             justify-content: space-between;
//             padding: 12px 16px;
//             background-color: #f8fafc;
//             border-radius: 6px;
//             font-weight: 600;
//             font-size: 14px;
//           ">
//             <span>Subtotal</span>
//             <span>₹${invoiceData.subtotal.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       <!-- Note -->
//       ${invoiceData.note ? `
//         <div style="
//           margin-bottom: 30px;
//           padding: 16px;
//           background-color: #f0fdfa;
//           border-left: 4px solid #0d9488;
//           border-radius: 0 6px 6px 0;
//           font-size: 14px;
//         ">
//           <p style="
//             font-weight: 600;
//             color: #0d9488;
//             margin-bottom: 8px;
//           ">Note</p>
//           <p style="margin: 0; color: #334155;">${invoiceData.note}</p>
//         </div>
//       ` : ''}

//       <!-- Footer -->
//       <div style="
//         text-align: center;
//         padding-top: 30px;
//         margin-top: 40px;
//         border-top: 1px solid #e2e8f0;
//         color: #64748b;
//         font-size: 14px;
//       ">
//         <p style="margin: 0 0 8px;">Thank you for your business!</p>
//         <p style="margin: 0;">Please contact us if you have any questions</p>
//       </div>
//     </div>
//   `;
// };

// export const downloadInvoicePDF = (invoiceData, template) => {
//   if (!invoiceData) return;

//   const element = document.createElement('div');
//   element.style.width = '800px';
//   element.style.margin = '0 auto';
  
//   element.innerHTML = generateInvoiceHTML(invoiceData);

//   document.body.appendChild(element);

//   const opt = {
//     margin: 10,
//     filename: `invoice_${invoiceData.invoiceNumber}.pdf`,
//     image: { 
//       type: 'jpeg', 
//       quality: 1 // Maximum quality
//     },
//     html2canvas: { 
//       scale: 3, // Higher scale for better quality
//       useCORS: true,
//       letterRendering: true,
//       allowTaint: true,
//       logging: false,
//       backgroundColor: '#FFFFFF',
//       width: 800 // Match the element width
//     },
//     jsPDF: { 
//       unit: 'mm', 
//       format: 'a4', 
//       orientation: 'portrait',
//       compress: false // Disable compression for better quality
//     }
//   };

//   // Use a timeout to ensure the element is properly rendered
//   setTimeout(() => {
//     html2pdf()
//       .set(opt)
//       .from(element)
//       .save()
//       .then(() => {
//         document.body.removeChild(element);
//       })
//       .catch(error => {
//         console.error('Error generating PDF:', error);
//         document.body.removeChild(element);
//       });
//   }, 500);
// };

// export const InvoicePreview = ({ invoiceData, template }) => {
//   if (!invoiceData) return null;

//   return (
//     <div className="relative bg-white rounded-xl overflow-hidden p-8 max-w-4xl mx-auto">
//       {/* Background image with overlay */}
//       {template && (
//         <div className="absolute inset-0 z-0 opacity-10">
//           <img 
//             src={template} 
//             alt="Invoice background" 
//             className="w-full h-full object-cover"
//           />
//         </div>
//       )}
      
//       {/* Content */}
//       <div className="relative z-10">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
//           <div>
//             <h1 className="text-3xl font-bold text-teal-600">INVOICE</h1>
//             <p className="text-gray-500 text-sm">#{invoiceData.invoiceNumber}</p>
//           </div>
//           <div className="mt-4 md:mt-0">
//             <p className="text-gray-500 text-sm">{invoiceData.date}</p>
//           </div>
//         </div>

//         {/* Seller/Buyer Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
//           <div className="bg-gray-50 p-5 rounded-lg">
//             <h3 className="text-lg font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 inline-block">
//               SELLER DETAILS
//             </h3>
//             <div className="mt-4 space-y-2 text-sm">
//               <p><strong>Name:</strong> {invoiceData.seller.name}</p>
//               <p><strong>Email:</strong> {invoiceData.seller.email}</p>
//               <p><strong>Phone:</strong> {invoiceData.seller.phoneNo}</p>
//               <p><strong>Address:</strong> {invoiceData.seller.address}</p>
//             </div>
//           </div>
          
//           <div className="bg-gray-50 p-5 rounded-lg">
//             <h3 className="text-lg font-semibold text-teal-600 border-b-2 border-teal-600 pb-2 inline-block">
//               BUYER DETAILS
//             </h3>
//             <div className="mt-4 space-y-2 text-sm">
//               <p><strong>Name:</strong> {invoiceData.buyer.name}</p>
//               <p><strong>Phone:</strong> {invoiceData.buyer.phone}</p>
//             </div>
//           </div>
//         </div>

//         {/* Items Table */}
//         <div className="mb-10 overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-teal-600 text-white">
//                 <th className="text-left py-3 px-4">Item</th>
//                 <th className="text-right py-3 px-4">Qty</th>
//                 <th className="text-right py-3 px-4">Price</th>
//                 <th className="text-right py-3 px-4">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoiceData.items.map((item, index) => (
//                 <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-3 px-4 border-b border-gray-200">{item.name}</td>
//                   <td className="py-3 px-4 text-right border-b border-gray-200">{item.quantity}</td>
//                   <td className="py-3 px-4 text-right border-b border-gray-200">₹{item.price.toFixed(2)}</td>
//                   <td className="py-3 px-4 text-right border-b border-gray-200">₹{item.total.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Total */}
//         <div className="flex justify-end mb-8">
//           <div className="w-full md:w-1/3">
//             <div className="bg-gray-50 p-4 rounded-lg text-sm">
//               <div className="flex justify-between font-semibold">
//                 <span>Subtotal</span>
//                 <span>₹{invoiceData.subtotal.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Note */}
//         {invoiceData.note && (
//           <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-lg mb-10 text-sm">
//             <p className="font-semibold text-teal-600 mb-2">Note</p>
//             <p className="text-gray-700">{invoiceData.note}</p>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="pt-6 mt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
//           <p className="mb-2">Thank you for your business!</p>
//           <p>Please contact us if you have any questions</p>
//         </div>
//       </div>
//     </div>
//   );
// };