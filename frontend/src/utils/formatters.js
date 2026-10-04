/**
 * Formats a numeric amount in Indian Rupees (INR)
 * @param {number|string} amount
 * @param {boolean} includeDecimals
 * @returns {string} e.g. "₹249" or "₹1,249.00"
 */
export function formatINR(amount, includeDecimals = true) {
  const num = Number(amount || 0);
  if (isNaN(num)) return '₹0.00';
  if (!includeDecimals && Number.isInteger(num)) {
    return `₹${num.toLocaleString('en-IN')}`;
  }
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactINR(amount) {
  const num = Number(amount || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
  return `₹${num.toFixed(0)}`;
}
