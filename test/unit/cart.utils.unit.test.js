const chai = require('chai');
const sinon = require('sinon');
const { calculateTotalPrice } = require('../utils/cart.utils');

const expect = chai.expect;

describe('Cart Utils - Unit Tests', () => {
  describe('calculateTotalPrice', () => {
    it('Debería calcular correctamente el precio total del carrito', () => {
      const cartItems = [
        { price: 10, quantity: 2 },
        { price: 20, quantity: 1 },
      ];

      const totalPrice = calculateTotalPrice(cartItems);

      expect(totalPrice).to.equal(40);
    });

    it('Debería devolver 0 si el carrito está vacío', () => {
      const cartItems = [];

      const totalPrice = calculateTotalPrice(cartItems);

      expect(totalPrice).to.equal(0);
    });
  });
});