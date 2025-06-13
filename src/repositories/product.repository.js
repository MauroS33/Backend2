const Product = require('../models/product.model');

class ProductRepository {
  // Obtener todos los productos
  async getAllProducts() {
    return await Product.find();
  }

  // Obtener un producto por ID
  async getProductById(id) {
    return await Product.findById(id);
  }

  // Crear un nuevo producto
  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  // Actualizar un producto
  async updateProduct(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  // Eliminar un producto
  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductRepository();