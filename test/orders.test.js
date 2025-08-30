const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.should();
chai.use(chaiHttp);

describe('Orders Router - Integration Tests', () => {
  const token = 'TOKEN_DE_USUARIO'; // Genera un token válido previamente

  // Test para crear una orden de compra
  describe('POST /api/orders', () => {
    it('Debería crear una nueva orden de compra', (done) => {
      const orderDetails = {
        cartItems: [
          { productId: 'ID_DEL_PRODUCTO_1', quantity: 2 },
          { productId: 'ID_DEL_PRODUCTO_2', quantity: 1 },
        ],
        totalAmount: 199.99,
      };

      chai
        .request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderDetails)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Orden creada exitosamente');
          res.body.should.have.property('order');
          res.body.order.should.have.property('cartItems').that.is.an('array');
          res.body.order.should.have.property('totalAmount').eql(199.99);
          done();
        });
    });

    it('Debería fallar si el carrito está vacío', (done) => {
      const invalidOrder = {
        cartItems: [],
        totalAmount: 0,
      };

      chai
        .request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidOrder)
        .end((err, res) => {
          res.should.have.status(400); // Bad Request
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('El carrito está vacío');
          done();
        });
    });

    it('Debería fallar si el usuario no está autenticado', (done) => {
      const orderDetails = {
        cartItems: [
          { productId: 'ID_DEL_PRODUCTO_1', quantity: 2 },
        ],
        totalAmount: 99.99,
      };

      chai
        .request(app)
        .post('/api/orders')
        .send(orderDetails) // Sin token de autenticación
        .end((err, res) => {
          res.should.have.status(401); // Unauthorized
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });

  // Test para procesar el pago
  describe('POST /api/payments', () => {
    it('Debería procesar el pago correctamente', (done) => {
      const paymentDetails = {
        orderId: 'ID_DE_LA_ORDEN',
        amount: 199.99,
        paymentMethod: 'tarjeta',
      };

      chai
        .request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${token}`)
        .send(paymentDetails)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Pago procesado exitosamente');
          done();
        });
    });

    it('Debería fallar si el método de pago no está especificado', (done) => {
      const invalidPayment = {
        orderId: 'ID_DE_LA_ORDEN',
        amount: 199.99,
      };

      chai
        .request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidPayment)
        .end((err, res) => {
          res.should.have.status(400); // Bad Request
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Método de pago no especificado');
          done();
        });
    });
  });

  // Test para vaciar el carrito
  describe('DELETE /api/cart', () => {
    it('Debería vaciar el carrito del usuario', (done) => {
      chai
        .request(app)
        .delete('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Carrito vaciado exitosamente');
          done();
        });
    });

    it('Debería fallar si el usuario no está autenticado', (done) => {
      chai
        .request(app)
        .delete('/api/cart')
        .end((err, res) => {
          res.should.have.status(401); // Unauthorized
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });
});