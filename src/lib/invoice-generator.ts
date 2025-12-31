import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
}

export function generateInvoicePDF(invoiceData: InvoiceData): jsPDF {
  const doc = new jsPDF();
  
  // Add logo/company header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text("Fritz's Forge", 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Handcrafted Metalwork', 20, 27);
  doc.text('www.fritzforge.com', 20, 32);
  
  // Invoice title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 150, 20);
  
  // Order details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order #: ${invoiceData.orderNumber}`, 150, 27);
  doc.text(`Date: ${new Date(invoiceData.orderDate).toLocaleDateString('en-US')}`, 150, 32);
  
  // Customer information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 45);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.customerName, 20, 52);
  doc.text(invoiceData.customerEmail, 20, 57);
  if (invoiceData.customerPhone) {
    doc.text(invoiceData.customerPhone, 20, 62);
  }
  
  // Shipping address
  if (invoiceData.shippingAddress) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Ship To:', 110, 45);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.shippingAddress.address, 110, 52);
    doc.text(`${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.postalCode}`, 110, 57);
  }
  
  // Items table
  const tableStartY = invoiceData.customerPhone ? 75 : 70;
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['Item', 'Quantity', 'Price', 'Total']],
    body: invoiceData.items.map(item => [
      item.name,
      item.quantity.toString(),
      `€${Number(item.price).toFixed(2)}`,
      `€${(item.quantity * Number(item.price)).toFixed(2)}`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [230, 81, 0], textColor: 255 },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    }
  });
  
  // Get final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY || tableStartY + 50;
  
  // Totals
  const totalsX = 130;
  let currentY = finalY + 10;
  
  doc.setFontSize(10);
  doc.text('Subtotal:', totalsX, currentY);
  doc.text(`€${Number(invoiceData.subtotal).toFixed(2)}`, 180, currentY, { align: 'right' });
  
  currentY += 6;
  doc.text('Shipping:', totalsX, currentY);
  doc.text(`€${Number(invoiceData.shipping).toFixed(2)}`, 180, currentY, { align: 'right' });
  
  currentY += 6;
  doc.text('Tax:', totalsX, currentY);
  doc.text(`€${Number(invoiceData.tax).toFixed(2)}`, 180, currentY, { align: 'right' });
  
  currentY += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', totalsX, currentY);
  doc.text(`€${Number(invoiceData.total).toFixed(2)}`, 180, currentY, { align: 'right' });
  
  // Payment information
  if (invoiceData.paymentMethod || invoiceData.paymentStatus) {
    currentY += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (invoiceData.paymentMethod) {
      doc.text(`Payment Method: ${invoiceData.paymentMethod}`, 20, currentY);
    }
    if (invoiceData.paymentStatus) {
      currentY += 5;
      doc.text(`Payment Status: ${invoiceData.paymentStatus}`, 20, currentY);
    }
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text("Fritz's Forge - Handcrafted with Soul", 105, 285, { align: 'center' });
  
  return doc;
}

export function downloadInvoice(invoiceData: InvoiceData): void {
  const pdf = generateInvoicePDF(invoiceData);
  pdf.save(`invoice-${invoiceData.orderNumber}.pdf`);
}

export function getInvoiceBlob(invoiceData: InvoiceData): Blob {
  const pdf = generateInvoicePDF(invoiceData);
  return pdf.output('blob');
}
