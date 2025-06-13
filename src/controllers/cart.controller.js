const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Ticket = require('../models/ticket.model');

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Buscar o crear el carrito del usuario
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Agregar un producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    // Validar que el producto exista
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Buscar o crear el carrito del usuario
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'Producto agregado al carrito', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
};

// Actualizar la cantidad de un producto en el carrito
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId, quantity } = req.body;

    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Encontrar el producto en el carrito
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: 'Cantidad actualizada', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;

    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Eliminar el producto del carrito
    cart.items.pull(itemId);
    await cart.save();
    res.status(200).json({ message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Buscar el carrito del usuario y vaciarlo
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json({ message: 'Carrito vaciado', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};

// Comprar productos del carrito
exports.purchaseCart = async (req, res) => {
  try {
    const userId = req.user.userId; // ID del usuario autenticado

    // Obtener el carrito del usuario
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Verificar el stock de los productos
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `No hay suficiente stock para el producto "${product.title}"`,
        });
      }
    }

    // Calcular el monto total
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    // Crear el ticket
    const ticket = new Ticket({
      user: userId,
      products: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
    });
    await ticket.save();

    // Actualizar el stock de los productos
    for (const item of cart.items) {
      const product = item.product;
      product.stock -= item.quantity;
      await product.save();
    }

    // Vaciar el carrito
    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: 'Compra realizada exitosamente',
      ticket,
    });
  } catch (error) {
    console.error('Error durante la compra:', error);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
};