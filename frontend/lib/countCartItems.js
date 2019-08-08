/**
 * Count the total number of items in a cart
 *
 * @param {CartItem[]} cart
 *
 * @returns {number}
 */
export default function countCartItems(cart) {
  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
}

/**
 * @typedef {Object} CartItem
 * @property {number} quantity
 */
