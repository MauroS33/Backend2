const chai = require('chai');
const mongoose = require('mongoose');
const Product = require('../models/product.model');

const expect = chai.expect;

describe('Product Model - Validation Tests', () => {
  // Limpiar la base de datos antes de cada test
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  // Test para crear un producto con datos válidos
  it('Debería crear un producto con datos válidos', async () => {
    const validProduct = {
      title: 'Producto de prueba',
      description: 'Descripción del producto',
      price: 99.99,
      stock: 10,
      category: 'remeras',
    };

    const product = new Product(validProduct);
    const validationError = product.validateSync(); // Valida el modelo

    expect(validationError).to.be.undefined; // No debería haber errores
  });

  // Test para verificar campos requeridos
  it('Debería fallar si falta un campo requerido', async () => {
    const invalidProduct = {
      description: 'Descripción del producto',
      price: 99.99,
      stock: 10,
      category: 'remeras',
    }; // Falta el campo "title"

    const product = new Product(invalidProduct);
    const validationError = product.validateSync();

    expect(validationError).to.not.be.undefined;
    expect(validationError.errors.title.message).to.equal('Path `title` is required.');
  });

  // Test para verificar tipos de datos incorrectos
  it('Debería fallar si los tipos de datos son incorrectos', async () => {
    const invalidProduct = {
      title: 12345, // Debería ser una cadena
      description: 'Descripción del producto',
      price: 'no-es-un-numero', // Debería ser un número
      stock: 'tampoco-es-un-numero',
      category: 'remeras',
    };

    const product = new Product(invalidProduct);
    const validationError = product.validateSync();

    expect(validationError).to.not.be.undefined;
    expect(validationError.errors.title.message).to.equal('Cast to String failed for value "12345" at path "title".');
    expect(validationError.errors.price.message).to.equal('Cast to Number failed for value "\\"no-es-un-numero\\"" at path "price".');
    expect(validationError.errors.stock.message).to.equal('Cast to Number failed for value "\\"tampoco-es-un-numero\\"" at path "stock".');
  });

  // Test para verificar valores mínimos
  it('Debería fallar si el precio o el stock son negativos', async () => {
    const invalidProduct = {
      title: 'Producto de prueba',
      description: 'Descripción del producto',
      price: -10, // Valor negativo
      stock: -5, // Valor negativo
      category: 'remeras',
    };

    const product = new Product(invalidProduct);
    const validationError = product.validateSync();

    expect(validationError).to.not.be.undefined;
    expect(validationError.errors.price.message).to.equal('Path `price` (-10) is less than minimum allowed value (0).');
    expect(validationError.errors.stock.message).to.equal('Path `stock` (-5) is less than minimum allowed value (0).');
  });

  // Test para verificar categorías válidas
  it('Debería fallar si la categoría no es válida', async () => {
    const invalidProduct = {
      title: 'Producto de prueba',
      description: 'Descripción del producto',
      price: 99.99,
      stock: 10,
      category: 'categoria-invalida', // Categoría no permitida
    };

    const product = new Product(invalidProduct);
    const validationError = product.validateSync();

    expect(validationError).to.not.be.undefined;
    expect(validationError.errors.category.message).to.equal(
      '`categoria-invalida` is not a valid enum value for path `category`.'
    );
  });
});