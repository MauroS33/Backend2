//Este test mockea la llamada a la API externa (axios.post) para simular respuestas exitosas o errores.

const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const { processPayment } = require('../services/payment.service');

const expect = chai.expect;

describe('Payment Service - Unit Tests', () => {
  describe('processPayment', () => {
    it('Debería procesar el pago correctamente', async () => {
      const mockResponse = { data: { success: true, message: 'Pago exitoso' } };
      const postStub = sinon.stub(axios, 'post').resolves(mockResponse);

      const paymentDetails = { amount: 100, paymentMethod: 'tarjeta' };
      const result = await processPayment(paymentDetails);

      expect(result.success).to.be.true;
      expect(result.message).to.equal('Pago exitoso');

      postStub.restore();
    });

    it('Debería manejar errores de la API correctamente', async () => {
      const postStub = sinon.stub(axios, 'post').rejects(new Error('Error de red'));

      const paymentDetails = { amount: 100, paymentMethod: 'tarjeta' };

      try {
        await processPayment(paymentDetails);
      } catch (error) {
        expect(error.message).to.equal('Error al procesar el pago');
      }

      postStub.restore();
    });
  });
});