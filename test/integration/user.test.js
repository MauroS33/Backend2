const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app');

chai.should(); // Usé should por recomendación
chai.use(chaiHttp);

describe('Users Router', () => {
  // Test para registrar un usuario
  describe('POST /api/auth/register', () => {
    it('Debería registrar un nuevo usuario', (done) => {
      const newUser = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/api/auth/register')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('¡Registro exitoso! Ahora puedes iniciar sesión.');
          done();
        });
    });
  });

  // Test para iniciar sesión
  describe('POST /api/auth/login', () => {
    it('Debería iniciar sesión con credenciales válidas', (done) => {
      const credentials = {
        email: 'testuser@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/api/auth/login')
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });

    it('Debería fallar con credenciales inválidas', (done) => {
      const invalidCredentials = {
        email: 'testuser@example.com',
        password: 'wrongpassword',
      };

      chai
        .request(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Credenciales inválidas');
          done();
        });
    });
  });

  // Test para obtener el perfil del usuario
  describe('GET /api/users/profile', () => {
    it('Debería devolver el perfil del usuario autenticado', (done) => {
      const token = 'TOKEN_DE_PRUEBA'; // Genera un token válido previamente

      chai
        .request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('email');
          done();
        });
    });

    it('Debería fallar si el token no es válido', (done) => {
      chai
        .request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer INVALID_TOKEN')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });
});