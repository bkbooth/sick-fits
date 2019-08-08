/**
 * Calculate the total price of a cart by summing cart items' price multiplied by quantity
 *
 * @param {CartItem[]} cart
 * @param
 *
 * @returns {number}
 */
export default function calculateTotalPrice(cart) {
  return cart.reduce((total, cartItem) => {
    if (!cartItem.item) return total;
    return total + cartItem.quantity * cartItem.item.price;
  }, 0);
}

/**
 * @typedef {Object} CartItem
 * @property {number} quantity
 * @property {Object} item
 * @property {number} item.price
 */
