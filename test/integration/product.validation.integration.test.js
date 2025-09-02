const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app');

chai.should();
chai.use(chaiHttp);

describe('Products Router - Validation Integration Tests', () => {
  const token = 'TOKEN_DE_ADMIN'; // Genera un token válido previamente

  // Test para crear un producto con datos válidos
  describe('POST /api/products', () => {
    it('Debería crear un producto con datos válidos', (done) => {
      const validProduct = {
        title: 'Producto de prueba',
        description: 'Descripción del producto',
        price: 99.99,
        stock: 10,
        category: 'remeras',
      };

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(validProduct)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Producto de prueba');
          done();
        });
    });

    it('Debería fallar si falta un campo requerido', (done) => {
      const invalidProduct = {
        description: 'Descripción del producto',
        price: 99.99,
        stock: 10,
        category: 'remeras',
      }; // Falta el campo "title"

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidProduct)
        .end((err, res) => {
          res.should.have.status(400); // Bad Request
          res.body.should.be.a('object');
          res.body.should.have.property('error'); // Mensaje de error
          done();
        });
    });

    it('Debería fallar si el precio o el stock son negativos', (done) => {
      const invalidProduct = {
        title: 'Producto de prueba',
        description: 'Descripción del producto',
        price: -10,
        stock: -5,
        category: 'remeras',
      };

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidProduct)
        .end((err, res) => {
          res.should.have.status(400); // Bad Request
          res.body.should.be.a('object');
          res.body.should.have.property('error'); // Mensaje de error
          done();
        });
    });

    it('Debería fallar si la categoría no es válida', (done) => {
      const invalidProduct = {
        title: 'Producto de prueba',
        description: 'Descripción del producto',
        price: 99.99,
        stock: 10,
        category: 'categoria-invalida',
      };

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidProduct)
        .end((err, res) => {
          res.should.have.status(400); // Bad Request
          res.body.should.be.a('object');
          res.body.should.have.property('error'); // Mensaje de error
          done();
        });
    });
  });
});