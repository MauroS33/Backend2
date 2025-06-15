const Cart = require('../models/cart.model');

class CartRepository {
  // Obtener el carrito de un usuario
  async getCartByUserId(userId) {
    return await Cart.findOne({ user: userId }).populate('items.product');
  }

  // Crear un carrito vacío para un usuario
  async createCart(userId) {
    const cart = new Cart({ user: userId, items: [] });
    return await cart.save();
  }

  // Agregar un producto al carrito
  async addProductToCart(userId, productId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    return await cart.save();
  }

  // Vaciar el carrito
  async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    cart.items = [];
    return await cart.save();
  }
}

module.exports = new CartRepository();