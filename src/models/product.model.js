const mongoose = require('mongoose');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x400?text=Sin+Imagen',
  },
  category: {
    type: String,
    enum: ['remeras', 'buzos', 'pantalones', 'camisas', 'bermudas'],
    required: true,
  },
}, { collection: '2025' });

// Crear el modelo
const Product = mongoose.model('Product', productSchema);

module.exports = Product;