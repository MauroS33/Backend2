const chai = require('chai');
const sinon = require('sinon'); // Librería para crear mocks
const { getUserById } = require('../controllers/user.controller');
const User = require('../models/user.model');

const expect = chai.expect;

describe('User Controller - Unit Tests', () => {
  // Mock para simular el método findById del modelo User
  describe('getUserById', () => {
    it('Debería devolver un usuario si se encuentra', async () => {
      // Mockear el método findById del modelo User
      const mockUser = { _id: '123', name: 'Test User', email: 'test@example.com' };
      const findByIdStub = sinon.stub(User, 'findById').resolves(mockUser);

      // Simular una solicitud HTTP
      const req = { params: { id: '123' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Ejecutar la función del controlador
      await getUserById(req, res);

      // Verificar el resultado
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ user: mockUser })).to.be.true;

      // Restaurar el stub después del test
      findByIdStub.restore();
    });

    it('Debería devolver un error 404 si el usuario no existe', async () => {
      // Mockear el método findById del modelo User
      const findByIdStub = sinon.stub(User, 'findById').resolves(null);

      // Simular una solicitud HTTP
      const req = { params: { id: 'invalidId' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      // Ejecutar la función del controlador
      await getUserById(req, res);

      // Verificar el resultado
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Usuario no encontrado' })).to.be.true;

      // Restaurar el stub después del test
      findByIdStub.restore();
    });
  });
});