const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon'); // Para mocks en tests unitarios
const app = require('../../src/app');
const { getProductById } = require('../controllers/product.controller');
const Product = require('../models/product.model');

chai.should();
chai.use(chaiHttp);

const expect = chai.expect;

// Tests de Integración
describe('Products Router - Integration Tests', () => {
  // Test para listar productos
  describe('GET /api/products', () => {
    it('Debería devolver una lista de productos', (done) => {
      chai
        .request(app)
        .get('/api/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array'); // Verifica que la respuesta sea un array
          done();
        });
    });

    it('Debería manejar correctamente una lista vacía si no hay productos', (done) => {
      chai
        .request(app)
        .get('/api/products')
        .end((err, res) => {
          res.should.have.status(200);
          if (res.body.length === 0) {
            res.body.should.be.a('array').that.is.empty; // Verifica que el array esté vacío
          }
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
        category: 'remeras',
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
          res.body.should.have.property('price').eql(99.99);
          res.body.should.have.property('stock').eql(10);
          res.body.should.have.property('category').eql('remeras');
          done();
        });
    });

    it('Debería fallar si el usuario no es admin', (done) => {
      const newProduct = {
        title: 'Producto de prueba',
        price: 99.99,
        stock: 10,
        category: 'remeras',
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

    it('Debería fallar si faltan campos obligatorios', (done) => {
      const invalidProduct = {
        price: 99.99,
        stock: 10,
        category: 'remeras',
      }; // Falta el campo "title"

      const token = 'TOKEN_DE_ADMIN';

      chai
        .request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidProduct)
        .end((err, res) => {
          res.should.have.status(400); // Error de validación
          res.body.should.be.a('object');
          res.body.should.have.property('error'); // Verifica que haya un mensaje de error
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
          res.body.should.have.property('price').eql(199.99);
          done();
        });
    });

    it('Debería fallar si el producto no existe', (done) => {
      const updatedProduct = {
        title: 'Producto actualizado',
        price: 199.99,
      };

      const productId = 'ID_INEXISTENTE'; // ID de un producto inexistente
      const token = 'TOKEN_DE_ADMIN';

      chai
        .request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProduct)
        .end((err, res) => {
          res.should.have.status(404); // Producto no encontrado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Producto no encontrado');
          done();
        });
    });

    it('Debería fallar si el usuario no es admin', (done) => {
      const updatedProduct = {
        title: 'Producto actualizado',
        price: 199.99,
      };

      const productId = 'ID_DEL_PRODUCTO';
      const token = 'TOKEN_DE_USUARIO'; // Token de usuario normal

      chai
        .request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProduct)
        .end((err, res) => {
          res.should.have.status(403); // Acceso denegado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Acceso denegado');
          done();
        });
    });
  });

  // Test para eliminar un producto (solo admin)
  describe('DELETE /api/products/:id', () => {
    it('Debería eliminar un producto si el usuario es admin', (done) => {
      const productId = 'ID_DEL_PRODUCTO'; // ID de un producto existente
      const token = 'TOKEN_DE_ADMIN';

      chai
        .request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Producto eliminado exitosamente');
          done();
        });
    });

    it('Debería fallar si el producto no existe', (done) => {
      const productId = 'ID_INEXISTENTE'; // ID de un producto inexistente
      const token = 'TOKEN_DE_ADMIN';

      chai
        .request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(404); // Producto no encontrado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Producto no encontrado');
          done();
        });
    });

    it('Debería fallar si el usuario no es admin', (done) => {
      const productId = 'ID_DEL_PRODUCTO';
      const token = 'TOKEN_DE_USUARIO'; // Token de usuario normal

      chai
        .request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(403); // Acceso denegado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Acceso denegado');
          done();
        });
    });
  });
});

// Tests Unitarios
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