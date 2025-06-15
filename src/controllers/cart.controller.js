const cartRepository = require('../repositories/cart.repository');
const Product = require('../models/product.model');
const Ticket = require('../models/product.model');
const sendEmail = require('../utils/email.utils');
const logger = require('../utils/logger');

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Usar el repositorio para obtener o crear el carrito
    let cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      cart = await cartRepository.createCart(userId);
      logger.info(`Carrito creado para el usuario ${userId}`);
    }

    logger.info(`Carrito obtenido para el usuario ${userId}`);
    res.status(200).json(cart);
  } catch (error) {
    logger.error(`Error al obtener el carrito para el usuario ${req.user.userId}: ${error.message}`);
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
      logger.warn(`Intento de agregar producto fallido: Producto no encontrado (${productId})`);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Usar el repositorio para agregar el producto al carrito
    await cartRepository.addProductToCart(userId, productId, quantity);

    logger.info(`Producto agregado al carrito por el usuario ${userId}: Producto ID ${productId}`);
    res.status(200).json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    logger.error(`Error al agregar producto al carrito para el usuario ${userId}: ${error.message}`);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
};

// Actualizar la cantidad de un producto en el carrito
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId, quantity } = req.body;

    // Buscar el carrito del usuario usando el repositorio
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      logger.warn(`Intento de actualizar carrito fallido: Carrito no encontrado para el usuario ${userId}`);
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Encontrar el producto en el carrito
    const item = cart.items.id(itemId);
    if (!item) {
      logger.warn(`Intento de actualizar carrito fallido: Producto no encontrado en el carrito (${itemId})`);
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    item.quantity = quantity;
    await cart.save();

    logger.info(`Cantidad actualizada en el carrito para el usuario ${userId}: Producto ID ${itemId}`);
    res.status(200).json({ message: 'Cantidad actualizada', cart });
  } catch (error) {
    logger.error(`Error al actualizar el carrito para el usuario ${userId}: ${error.message}`);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;

    // Buscar el carrito del usuario usando el repositorio
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      logger.warn(`Intento de eliminar producto fallido: Carrito no encontrado para el usuario ${userId}`);
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Eliminar el producto del carrito
    cart.items.pull(itemId);
    await cart.save();

    logger.info(`Producto eliminado del carrito por el usuario ${userId}: Producto ID ${itemId}`);
    res.status(200).json({ message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    logger.error(`Error al eliminar producto del carrito para el usuario ${userId}: ${error.message}`);
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Usar el repositorio para vaciar el carrito
    await cartRepository.clearCart(userId);

    logger.info(`Carrito vaciado por el usuario ${userId}`);
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    logger.error(`Error al vaciar el carrito para el usuario ${userId}: ${error.message}`);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};

// Comprar productos del carrito
exports.purchaseCart = async (req, res) => {
  try {
    const userId = req.user.userId; // ID del usuario autenticado

    // Obtener el carrito del usuario usando el repositorio
    let cart = await cartRepository.getCartByUserId(userId);
    if (!cart || cart.items.length === 0) {
      logger.warn(`Compra fallida: Carrito vacío para el usuario ${userId}`);
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Verificar el stock de los productos
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product.stock < item.quantity) {
        logger.warn(
          `Compra fallida: No hay suficiente stock para el producto "${product.title}" (${product._id})`
        );
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
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      await product.save();
    }

    // Vaciar el carrito usando el repositorio
    await cartRepository.clearCart(userId);

    // Enviar correo de confirmación
    const userEmail = req.user.email; // Asumiendo que el email está disponible en el token
    const subject = 'Compra Exitosa';
    const html = `
      <p>¡Gracias por tu compra!</p>
      <p>Tu ticket de compra ha sido generado con éxito.</p>
      <p>Total pagado: $${totalAmount}</p>
    `;
    await sendEmail(userEmail, subject, html);

    logger.info(`Compra realizada exitosamente por el usuario ${userId}`);
    res.status(200).json({
      message: 'Compra realizada exitosamente',
      ticket,
    });
  } catch (error) {
    logger.error(`Error durante la compra para el usuario ${userId}: ${error.message}`);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
};