
import html2pdf from 'html2pdf.js';

export const generateInvoiceData = (formData, products, user) => {
  const { selectedProducts, buyerName, buyerPhoneNo, note } = formData;
  console.log("products: ", products);
  
  const invoiceItems = selectedProducts
    .filter(item => item.productId && item.quantity)
    .map(item => {
      console.log("item: ", item);
      
      const product = products.find(p => 
        String(p.productId) === String(item.productId) || 
        String(p.id) === String(item.productId)
      );
      console.log(product);
      
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
  const invoiceNumber = `INV-${Date.now()}`;
  const date = new Date().toLocaleDateString();

  return {
    invoiceNumber,
    date,
    seller: {
      name: user.username,
      email: user.email,
      phoneNo:user.phoneNo,
      address:user.address
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


const generateInvoiceHTML = (invoiceData) => {
  return `
    <div style="background-color: rgba(255, 255, 255, 0.8); 
      padding: 30px; 
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      ">
      <h1 style="text-align: center; color: #0d9488; margin-bottom: 30px;">INVOICE</h1>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
          <p><strong>Date:</strong> ${invoiceData.date}</p>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; width: 48%; background-color: rgba(255, 255, 255, 0.9);">
          <h3 style="color: #0d9488; margin-top: 0;">Seller Information</h3>
          <p><strong>Name:</strong> ${invoiceData.seller.name}</p>
          <p><strong>Email:</strong> ${invoiceData.seller.email}</p>
         
        </div>
        
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; width: 48%; background-color: rgba(255, 255, 255, 0.9);">
          <h3 style="color: #0d9488; margin-top: 0;">Buyer Information</h3>
          <p><strong>Name:</strong> ${invoiceData.buyer.name}</p>
          <p><strong>Phone:</strong> ${invoiceData.buyer.phone}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: rgba(255, 255, 255, 0.9);">
        <thead>
          <tr style="background-color: #0d9488; color: white;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: right;">Quantity</th>
            <th style="padding: 10px; text-align: right;">Price</th>
            <th style="padding: 10px; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.items.map((item, index) => `
            <tr style="${index % 2 === 0 ? 'background-color: rgba(243, 244, 246, 0.7);' : ''}">
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #0d9488;">Subtotal:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #0d9488;">$${invoiceData.subtotal.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      ${invoiceData.note ? `
        <div style="margin-bottom: 30px; background-color: rgba(255, 255, 255, 0.9); padding: 15px; border-radius: 5px;">
          <p style="font-weight: bold; margin-bottom: 5px;">Note:</p>
          <p>${invoiceData.note}</p>
        </div>
      ` : ''}
      
      <div style="text-align: center; color: #666; margin-top: 40px;">
      <p><strong>Contact No. :</strong> ${invoiceData.seller.phoneNo}</p>
        <p><strong>Address :</strong> ${invoiceData.seller.address}</p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  `;
};

export const downloadInvoicePDF = (invoiceData, template) => {
  if (!invoiceData) return;

  // Create a temporary div to hold the invoice HTML
  const element = document.createElement('div');
  
  // Add background image if template exists
  element.innerHTML = `
    <div style="
      position: relative;
      width: 100%;
      min-height: 100vh;
      ${template ? `
        background-image: url(${template});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
      ` : ''}
    ">
      ${template ? `
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.85);
          z-index: 0;
        "></div>
      ` : ''}
      
      <div style="
        position: relative;
        z-index: 10;
        width: 800px;
        margin: 0 auto;
        padding: 40px;
      ">
        ${generateInvoiceHTML(invoiceData)}
      </div>
    </div>
  `;

  document.body.appendChild(element);

  // PDF options
  const opt = {
    margin: 0, // Set margin to 0 for full-page background
    filename: `invoice_${invoiceData.invoiceNumber}.pdf`,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: null,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  // Generate PDF
  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      document.body.removeChild(element);
    })
    .catch(error => {
      console.error('Error generating PDF:', error);
      document.body.removeChild(element);
    });
};

export const InvoicePreview = ({ invoiceData, template, onDownload, onNewSale }) => {
  if (!invoiceData) return null;

  // Style object for the background image
  const backgroundStyle = template ? {
    backgroundImage: `url(${template})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backgroundBlendMode: 'overlay'
  } : {};

  return (
    <div className="bg-white p-6 rounded-md shadow-md relative overflow-hidden">
      {/* Background image with overlay */}
      {template && (
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src={template} 
            alt="Invoice background" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content with semi-transparent background */}
      <div 
        className="relative z-10 bg-white bg-opacity-90 p-6 rounded-md"
        style={backgroundStyle}
      >
        <h2 className="text-xl font-bold mb-4">Invoice #{invoiceData.invoiceNumber}</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">Seller</h3>
            {console.log("seller ", invoiceData.seller)}
            
            <p>{invoiceData.seller.name}</p>
            <p>{invoiceData.seller.phoneNo}</p>
            <p>{invoiceData.seller.email}</p>
            <p>{invoiceData.seller.address}</p>
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
            onClick={onNewSale}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            New Sale
          </button>
          <button
            onClick={onDownload}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};





