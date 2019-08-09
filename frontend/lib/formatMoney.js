/**
 * Format a number as money, leaving off the fraction digits if they're not significant
 *
 * @param {number} amount
 *
 * @returns {string}
 */
export default function formatMoney(amount) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: process.env.NODE_ENV === 'test' ? 'USD' : 'AUD',
    // if its a whole, dollar amount, leave off the .00
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}
