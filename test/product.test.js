const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.should();
chai.use(chaiHttp);

describe('Products Router', () => {
  // Test para listar productos
  describe('GET /api/products', () => {
    it('Debería devolver una lista de productos', (done) => {
      chai
        .request(app)
        .get('/api/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  // Test para crear un producto (solo admin)
  describe('POST /api/products', () => {
    it('Debería crear un nuevo producto si el usuario es admin', (done) => {
      const newProduct = {
        title: 'Producto de prueba',
        price: 99.99,
        stock: 10,
      };

      const token = 'TOKEN_DE_ADMIN'; // Genera un token válido de admin previamente

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Producto de prueba');
          done();
        });
    });

    it('Debería fallar si el usuario no es admin', (done) => {
      const newProduct = {
        title: 'Producto de prueba',
        price: 99.99,
        stock: 10,
      };

      const token = 'TOKEN_DE_USUARIO'; // Token de usuario normal

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Acceso denegado');
          done();
        });
    });
  });

  // Test para actualizar un producto (solo admin)
  describe('PUT /api/products/:id', () => {
    it('Debería actualizar un producto si el usuario es admin', (done) => {
      const updatedProduct = {
        title: 'Producto actualizado',
        price: 199.99,
      };

      const productId = 'ID_DEL_PRODUCTO'; // ID de un producto existente
      const token = 'TOKEN_DE_ADMIN';

      chai
        .request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProduct)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Producto actualizado');
          done();
        });
    });
  });
});