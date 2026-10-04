import jsPDF from 'jspdf';

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
  doc.text('VALENCE', 16, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 220, 210);
  doc.text('CLINICAL DISPENSARY & INTEGRATED HEALTHCARE', 16, 25);
  doc.text('GSTIN: 27AABCV1234F1Z8 | FSSAI Lic. 10022000000000', 16, 30);

  // Invoice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('TAX INVOICE', 194, 18, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 230, 220);
  doc.text(`Original for Recipient`, 194, 25, { align: 'right' });

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
  doc.text(user?.name || user?.username || 'Valued Patient', 16, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  y += 5;
  const address = order.shippingAddress || 'Registered Delivery Address';
  const splitAddress = doc.splitTextToSize(address, 85);
  doc.text(splitAddress, 16, y);
  y += splitAddress.length * 4.5;
  doc.text(`Email: ${user?.email || 'customer@valence.in'}`, 16, y);

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
  }) : new Date().toLocaleDateString('en-IN');

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
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedTextColor);
  doc.text('Payment Status:', 125, ry);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(order.paymentStatus || 'PAID', 194, ry, { align: 'right' });

  ry += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedTextColor);
  doc.text('Fulfillment Stage:', 125, ry);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text(order.orderStatus || 'CONFIRMED', 194, ry, { align: 'right' });

  // Table Header
  const tableStartY = Math.max(y, ry) + 8;
  doc.setFillColor(...lightBg);
  doc.roundedRect(16, tableStartY, 178, 8, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text('#', 20, tableStartY + 5.5);
  doc.text('MEDICATION & FORMULATION', 32, tableStartY + 5.5);
  doc.text('PACK/DOSAGE', 115, tableStartY + 5.5);
  doc.text('QTY', 145, tableStartY + 5.5, { align: 'center' });
  doc.text('RATE (Rs.)', 168, tableStartY + 5.5, { align: 'right' });
  doc.text('AMOUNT (Rs.)', 190, tableStartY + 5.5, { align: 'right' });

  // Table Rows
  let rowY = tableStartY + 13;
  const items = order.items || [];

  items.forEach((item, index) => {
    const medName = item.medicine?.name || item.medicineName || 'Medicine';
    const brand = item.medicine?.brand || item.medicine?.composition || 'Prescription Drug';
    const dosage = item.medicine?.dosage || `${item.medicine?.unitsPerPack || 1} units`;
    const qty = item.quantity || 1;
    const rate = Number(item.price || 0).toFixed(2);
    const amount = (Number(item.price || 0) * qty).toFixed(2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(String(index + 1), 20, rowY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkTextColor);
    doc.text(medName.length > 40 ? medName.substring(0, 38) + '...' : medName, 32, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(brand.length > 40 ? brand.substring(0, 38) + '...' : brand, 32, rowY + 3.8);

    doc.setFontSize(8.5);
    doc.setTextColor(...darkTextColor);
    doc.text(dosage, 115, rowY);
    doc.text(String(qty), 145, rowY, { align: 'center' });
    doc.text(rate, 168, rowY, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(amount, 190, rowY, { align: 'right' });

    // Underline divider
    doc.setDrawColor(235, 232, 223);
    doc.line(16, rowY + 6, 194, rowY + 6);

    rowY += 10;
  });

  // Totals Breakdown
  rowY += 4;
  const subtotal = order.subtotalAmount || order.totalAmount || 0;
  const discount = order.discountAmount || 0;
  const delivery = order.deliveryCharge || 0;
  const finalTotal = order.totalAmount || (subtotal - discount + delivery);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedTextColor);
  doc.text('Subtotal (Gross Formulation Cost):', 125, rowY);
  doc.setTextColor(...darkTextColor);
  doc.text(`Rs. ${Number(subtotal).toFixed(2)}`, 190, rowY, { align: 'right' });

  if (discount > 0) {
    rowY += 5.5;
    doc.setTextColor(44, 122, 106);
    doc.text(`Coupon Savings (${order.couponCode || 'PROMO'}):`, 125, rowY);
    doc.text(`- Rs. ${Number(discount).toFixed(2)}`, 190, rowY, { align: 'right' });
  }

  rowY += 5.5;
  doc.setTextColor(...mutedTextColor);
  doc.text('Dispensary Express Delivery:', 125, rowY);
  doc.setTextColor(44, 122, 106);
  doc.setFont('helvetica', 'bold');
  doc.text('FREE (Complimentary)', 190, rowY, { align: 'right' });

  rowY += 7;
  // Final Total Highlight Box
  doc.setFillColor(...lightBg);
  doc.roundedRect(120, rowY - 4.5, 74, 9, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('Total Invoiced Amount:', 124, rowY + 1.5);
  doc.setFontSize(11);
  doc.text(`Rs. ${Number(finalTotal).toFixed(2)}`, 190, rowY + 1.5, { align: 'right' });

  // Compliance & Regulatory Footer
  const footerY = 265;
  doc.setDrawColor(220, 220, 215);
  doc.line(16, footerY, 194, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...mutedTextColor);
  doc.text('VALENCE CLINICAL DISPENSARY • Central Healthcare Logistics Park, Sector 44, Bengaluru, Karnataka 560103', 105, footerY + 5, { align: 'center' });
  doc.text('Prescription medicines dispensed strictly under supervision of Registered Pharmacist (Reg. No: KA-PHAR-88921).', 105, footerY + 9, { align: 'center' });
  doc.text('This is an authentic system-generated tax invoice and requires no physical seal.', 105, footerY + 13, { align: 'center' });

  // Trigger download
  doc.save(`VALENCE-Invoice-ORD-${order.id}.pdf`);
}
