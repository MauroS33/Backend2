const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.should();
chai.use(chaiHttp);

describe('Checkout Process - Functional Tests', () => {
  const token = 'TOKEN_DE_USUARIO'; // recordar cambiar el token antes de terminar

  it('Debería completar un flujo de compra exitoso', async () => {
    // Paso 1: Agregar productos al carrito
    const cartItem = {
      productId: 'ID_DEL_PRODUCTO_1',
      quantity: 2,
    };

    let res = await chai
      .request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send(cartItem);

    res.should.have.status(201);
    res.body.should.have.property('message').eql('Producto agregado al carrito');

    // Paso 2: Crear una orden de compra
    const orderDetails = {
      cartItems: [
        { productId: 'ID_DEL_PRODUCTO_1', quantity: 2 },
      ],
      totalAmount: 199.99,
    };

    res = await chai
      .request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(orderDetails);

    res.should.have.status(201);
    res.body.should.have.property('message').eql('Orden creada exitosamente');
    const orderId = res.body.order._id;

    // Paso 3: Procesar el pago
    const paymentDetails = {
      orderId: orderId,
      amount: 199.99,
      paymentMethod: 'tarjeta',
    };

    res = await chai
      .request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send(paymentDetails);

    res.should.have.status(200);
    res.body.should.have.property('message').eql('Pago procesado exitosamente');

    // Paso 4: Vaciar el carrito
    res = await chai
      .request(app)
      .delete('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    res.should.have.status(200);
    res.body.should.have.property('message').eql('Carrito vaciado exitosamente');
  });
});