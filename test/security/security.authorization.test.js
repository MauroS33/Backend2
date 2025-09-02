const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app');

chai.should();
chai.use(chaiHttp);

describe('Security - Authorization Tests', () => {
  const userToken = 'TOKEN_DE_USUARIO'; // Token de usuario normal
  const adminToken = 'TOKEN_DE_ADMIN'; // Token de admin

  // Test para crear un producto como usuario normal
  describe('POST /api/products (usuario normal)', () => {
    it('Debería fallar si el usuario no es admin', (done) => {
      const newProduct = {
        title: 'Producto de prueba',
        price: 99.99,
        stock: 10,
        category: 'remeras',
      };

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct)
        .end((err, res) => {
          res.should.have.status(403); // Forbidden
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Acceso denegado');
          done();
        });
    });
  });

  // Test para crear un producto como admin
  describe('POST /api/products (admin)', () => {
    it('Debería permitir crear un producto si el usuario es admin', (done) => {
      const newProduct = {
        title: 'Producto de prueba',
        price: 99.99,
        stock: 10,
        category: 'remeras',
      };

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct)
        .end((err, res) => {
          res.should.have.status(201); // Created
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Producto de prueba');
          done();
        });
    });
  });
});