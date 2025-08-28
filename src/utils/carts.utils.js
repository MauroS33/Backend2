function calculateTotalPrice(cartItems) {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

module.exports = { calculateTotalPrice };