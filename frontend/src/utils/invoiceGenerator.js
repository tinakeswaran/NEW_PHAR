import jsPDF from 'jspdf';

function getPaymentStatusDisplay(order) {
  const method = (order?.paymentMethod || order?.payment_method || '').toUpperCase();
  const status = (order?.paymentStatus || order?.payment_status || '').toUpperCase();

  if (status === 'REFUNDED') return 'REFUNDED';
  if (status === 'FAILED') return 'FAILED';

  if (method === 'COD' || method === 'CASH_ON_DELIVERY' || method === 'CASH ON DELIVERY') {
    return 'CASH ON DELIVERY';
  }
  if (method === 'UPI') {
    return 'PAID THROUGH UPI';
  }
  if (method === 'CARD' || method === 'CREDIT_CARD' || method === 'DEBIT_CARD') {
    return 'PAID THROUGH CARD';
  }
  if (method === 'NET_BANKING' || method === 'NETBANKING' || method === 'NET BANKING') {
    return 'PAID THROUGH NET BANKING';
  }

  // Fallback checks
  if (status === 'PAID') {
    return 'PAID THROUGH UPI';
  }

  return 'CASH ON DELIVERY';
}

export function generateInvoicePDF(order, user) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [9, 38, 32]; // #092620
  const secondaryColor = [44, 122, 106]; // #2C7A6A
  const darkTextColor = [17, 24, 22];
  const mutedTextColor = [94, 109, 104];
  const lightBg = [245, 244, 239];

  // Header Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 36, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('PHARMED', 16, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 220, 210);
  doc.text('DIGITAL PHARMACY & HEALTHCARE PLATFORM', 16, 25);
  doc.text('GSTIN: 27AABCV1234F1Z8 | FSSAI Lic. 10022000000000', 16, 30);

  // Invoice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('TAX INVOICE', 194, 18, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 230, 220);
  doc.text('Original for Recipient', 194, 25, { align: 'right' });

  // Order & Customer Details Section
  let y = 46;

  // Left Column: Customer details
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('BILLED & DELIVERED TO:', 16, y);

  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  y += 6;
  const customerName = user?.name || user?.username || order?.userName || 'Valued Patient';
  const splitName = doc.splitTextToSize(customerName, 85);
  doc.text(splitName, 16, y);
  y += splitName.length * 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  const address = order.shippingAddress || 'Registered Delivery Address';
  const splitAddress = doc.splitTextToSize(address, 85);
  doc.text(splitAddress, 16, y);
  y += splitAddress.length * 4.5;

  const emailStr = `Email: ${user?.email || 'customer@pharmed.in'}`;
  const splitEmail = doc.splitTextToSize(emailStr, 85);
  doc.text(splitEmail, 16, y);
  y += splitEmail.length * 4.5;

  // Right Column: Invoice Details
  let ry = 46;
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('INVOICE DETAILS:', 125, ry);

  ry += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);

  const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : new Date().toLocaleDateString('en-IN'));

  doc.text('Invoice / Order No:', 125, ry);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text(`VAL-${String(order.id).padStart(6, '0')}`, 194, ry, { align: 'right' });

  ry += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedTextColor);
  doc.text('Order Date:', 125, ry);
  doc.setTextColor(...darkTextColor);
  doc.text(orderDate, 194, ry, { align: 'right' });

  ry += 5;
  const paymentStatusText = getPaymentStatusDisplay(order);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedTextColor);
  doc.text('Payment Status:', 125, ry);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(paymentStatusText.length > 18 ? 8 : 8.5);
  doc.text(paymentStatusText, 194, ry, { align: 'right' });

  ry += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  doc.text('Fulfillment Stage:', 125, ry);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text(order.orderStatus || 'CONFIRMED', 194, ry, { align: 'right' });

  // Table Header Helper
  const tableStartY = Math.max(y, ry) + 6;

  function drawTableHeader(pdfDoc, startY) {
    pdfDoc.setFillColor(...lightBg);
    pdfDoc.roundedRect(16, startY, 178, 8, 1, 1, 'F');

    pdfDoc.setFont('helvetica', 'bold');
    pdfDoc.setFontSize(8.5);
    pdfDoc.setTextColor(...primaryColor);
    pdfDoc.text('#', 20, startY + 5.5);
    pdfDoc.text('MEDICATION & FORMULATION', 30, startY + 5.5);
    pdfDoc.text('PACK/DOSAGE', 110, startY + 5.5);
    pdfDoc.text('QTY', 142, startY + 5.5, { align: 'center' });
    pdfDoc.text('RATE (Rs.)', 166, startY + 5.5, { align: 'right' });
    pdfDoc.text('AMOUNT (Rs.)', 194, startY + 5.5, { align: 'right' });
  }

  drawTableHeader(doc, tableStartY);

  let rowY = tableStartY + 12;
  const items = order.items || [];

  items.forEach((item, index) => {
    // Multi-page check
    if (rowY > 235) {
      doc.addPage();
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`PHARMED TAX INVOICE - ORD #${order.id} (Continued)`, 16, 8);
      
      rowY = 20;
      drawTableHeader(doc, rowY);
      rowY += 12;
    }

    const medName = item.medicine?.name || item.medicineName || 'Medicine';
    const brand = item.medicine?.brand || item.medicine?.composition || 'Prescription Formulation';
    const dosage = item.medicine?.dosage || `${item.medicine?.unitsPerPack || 1} units`;
    const qty = item.quantity || 1;
    const rate = Number(item.price || 0).toFixed(2);
    const amount = (Number(item.price || 0) * qty).toFixed(2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(String(index + 1), 20, rowY);

    const splitMed = doc.splitTextToSize(medName, 76);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkTextColor);
    doc.text(splitMed, 30, rowY);

    const subY = rowY + (splitMed.length * 3.8);
    const splitBrand = doc.splitTextToSize(brand, 76);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(splitBrand, 30, subY);

    doc.setFontSize(8.5);
    doc.setTextColor(...darkTextColor);
    doc.text(dosage, 110, rowY);
    doc.text(String(qty), 142, rowY, { align: 'center' });
    doc.text(rate, 166, rowY, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(amount, 194, rowY, { align: 'right' });

    const totalRowHeight = (splitMed.length * 3.8) + (splitBrand.length * 3.5) + 3;
    const itemBottom = rowY + totalRowHeight;

    // Underline divider
    doc.setDrawColor(235, 232, 223);
    doc.line(16, itemBottom - 1, 194, itemBottom - 1);

    rowY = itemBottom + 4;
  });

  // Check overflow before rendering Totals breakdown
  if (rowY > 220) {
    doc.addPage();
    rowY = 25;
  }

  // Totals Breakdown
  rowY += 4;
  const subtotal = order.subtotalAmount || order.totalAmount || 0;
  const discount = order.discountAmount || 0;
  const delivery = order.deliveryCharge || 0;
  const finalTotal = order.totalAmount || (subtotal - discount + delivery);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  doc.text('Subtotal:', 115, rowY);
  doc.setTextColor(...darkTextColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${Number(subtotal).toFixed(2)}`, 194, rowY, { align: 'right' });

  if (discount > 0) {
    rowY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(44, 122, 106);
    const couponLabel = order.couponCode ? `Coupon Savings (${order.couponCode}):` : 'Coupon Savings:';
    doc.text(couponLabel, 115, rowY);
    doc.setFont('helvetica', 'bold');
    doc.text(`- Rs. ${Number(discount).toFixed(2)}`, 194, rowY, { align: 'right' });
  }

  rowY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedTextColor);
  doc.text('Delivery Charge:', 115, rowY);
  doc.setTextColor(44, 122, 106);
  doc.setFont('helvetica', 'bold');
  const deliveryText = delivery > 0 ? `Rs. ${Number(delivery).toFixed(2)}` : 'Rs. 0.00 (Complimentary)';
  doc.text(deliveryText, 194, rowY, { align: 'right' });

  rowY += 7;
  // Final Total Highlight Box
  doc.setFillColor(...lightBg);
  doc.roundedRect(110, rowY - 4.5, 84, 9, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('Total Amount:', 115, rowY + 1.5);
  doc.setFontSize(11);
  doc.text(`Rs. ${Number(finalTotal).toFixed(2)}`, 194, rowY + 1.5, { align: 'right' });

  // Add Footers to all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerY = 282;
    doc.setDrawColor(220, 220, 215);
    doc.line(16, footerY - 5, 194, footerY - 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...mutedTextColor);
    doc.text('PHARMED HEALTHCARE • Central Logistics Hub, Sector 44, Bengaluru, Karnataka 560103', 105, footerY - 1, { align: 'center' });
    doc.text('Prescription medicines dispensed strictly under supervision of Registered Pharmacist (Reg. No: KA-PHAR-88921).', 105, footerY + 2.5, { align: 'center' });
    doc.text(`This is an authentic system-generated tax invoice and requires no physical seal. • Page ${i} of ${pageCount}`, 105, footerY + 6, { align: 'center' });
  }

  // Trigger download
  doc.save(`PHARMED-Invoice-ORD-${order.id}.pdf`);
}
