const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.should();
chai.use(chaiHttp);

describe('Security - Authentication Tests', () => {
  // Test para verificar acceso sin token
  describe('GET /api/products (sin token)', () => {
    it('Debería fallar si el usuario no está autenticado', (done) => {
      chai
        .request(app)
        .get('/api/products')
        .end((err, res) => {
          res.should.have.status(401); // Unauthorized
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });

  // Test para verificar acceso con token inválido
  describe('GET /api/products (token inválido)', () => {
    it('Debería fallar si el token es inválido', (done) => {
      const invalidToken = 'TOKEN_INVALIDO';

      chai
        .request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${invalidToken}`)
        .end((err, res) => {
          res.should.have.status(401); // Unauthorized
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });

  // Test para verificar acceso con token válido
  describe('GET /api/products (token válido)', () => {
    it('Debería permitir el acceso con un token válido', (done) => {
      const validToken = 'TOKEN_DE_USUARIO'; // Genera un token válido previamente

      chai
        .request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${validToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array'); // Lista de productos
          done();
        });
    });
  });
});