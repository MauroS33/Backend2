const chai = require('chai');
const sinon = require('sinon'); // Librería para crear mocks
const { getProductById } = require('../controllers/product.controller');
const Product = require('../models/product.model');

const expect = chai.expect;

describe('Product Controller - Unit Tests', () => {
  describe('getProductById', () => {
    it('Debería devolver un producto si se encuentra', async () => {
      // Mockear el método findById del modelo Product
      const mockProduct = { _id: '456', title: 'Producto de prueba', price: 99.99, stock: 10 };
      const findByIdStub = sinon.stub(Product, 'findById').resolves(mockProduct);

      // Simular una solicitud HTTP
      const req = { params: { id: '456' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Ejecutar la función del controlador
      await getProductById(req, res);

      // Verificar el resultado
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ product: mockProduct })).to.be.true;

      // Restaurar el stub después del test
      findByIdStub.restore();
    });

    it('Debería devolver un error 404 si el producto no existe', async () => {
      // Mockear el método findById del modelo Product
      const findByIdStub = sinon.stub(Product, 'findById').resolves(null);

      // Simular una solicitud HTTP
      const req = { params: { id: 'invalidId' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Ejecutar la función del controlador
      await getProductById(req, res);

      // Verificar el resultado
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Producto no encontrado' })).to.be.true;

      // Restaurar el stub después del test
      findByIdStub.restore();
    });

    it('Debería manejar errores internos correctamente', async () => {
      // Mockear el método findById del modelo Product para simular un error
      const findByIdStub = sinon.stub(Product, 'findById').rejects(new Error('Error simulado'));

      // Simular una solicitud HTTP
      const req = { params: { id: '456' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Ejecutar la función del controlador
      await getProductById(req, res);

      // Verificar el resultado
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Error al obtener el producto' })).to.be.true;

      // Restaurar el stub después del test
      findByIdStub.restore();
    });
  });
});