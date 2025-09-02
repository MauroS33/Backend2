const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app');

chai.should();
chai.use(chaiHttp);

describe('Cart Router', () => {
  const token = 'TOKEN_DE_USUARIO'; // Genera un token válido previamente

  // Test para agregar un producto al carrito
  describe('POST /api/cart', () => {
    it('Debería agregar un producto al carrito', (done) => {
      const cartItem = {
        productId: 'ID_DEL_PRODUCTO',
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send(cartItem)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Producto agregado al carrito');
          res.body.should.have.property('cartItem');
          res.body.cartItem.should.have.property('productId').eql('ID_DEL_PRODUCTO');
          res.body.cartItem.should.have.property('quantity').eql(2);
          done();
        });
    });

    it('Debería fallar si el producto no existe', (done) => {
      const invalidCartItem = {
        productId: 'ID_INEXISTENTE',
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidCartItem)
        .end((err, res) => {
          res.should.have.status(404); // Producto no encontrado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Producto no encontrado');
          done();
        });
    });

    it('Debería fallar si el usuario no está autenticado', (done) => {
      const cartItem = {
        productId: 'ID_DEL_PRODUCTO',
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/cart')
        .send(cartItem) // Sin token de autenticación
        .end((err, res) => {
          res.should.have.status(401); // No autorizado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });

  // Test para listar los productos en el carrito
  describe('GET /api/cart', () => {
    it('Debería devolver los productos en el carrito del usuario', (done) => {
      chai
        .request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array'); // El carrito es un array de productos
          done();
        });
    });

    it('Debería manejar correctamente un carrito vacío', (done) => {
      chai
        .request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          if (res.body.length === 0) {
            res.body.should.be.a('array').that.is.empty; // Verifica que el array esté vacío
          }
          done();
        });
    });

    it('Debería fallar si el usuario no está autenticado', (done) => {
      chai
        .request(app)
        .get('/api/cart')
        .end((err, res) => {
          res.should.have.status(401); // No autorizado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });

  // Test para eliminar un producto del carrito
  describe('DELETE /api/cart/:id', () => {
    it('Debería eliminar un producto del carrito', (done) => {
      const cartItemId = 'ID_DEL_ITEM_EN_EL_CARRITO';

      chai
        .request(app)
        .delete(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Producto eliminado del carrito');
          done();
        });
    });

    it('Debería fallar si el producto en el carrito no existe', (done) => {
      const invalidCartItemId = 'ID_INEXISTENTE';

      chai
        .request(app)
        .delete(`/api/cart/${invalidCartItemId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(404); // Producto en el carrito no encontrado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Producto en el carrito no encontrado');
          done();
        });
    });

    it('Debería fallar si el usuario no está autenticado', (done) => {
      const cartItemId = 'ID_DEL_ITEM_EN_EL_CARRITO';

      chai
        .request(app)
        .delete(`/api/cart/${cartItemId}`)
        .end((err, res) => {
          res.should.have.status(401); // No autorizado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });

  // Test para actualizar la cantidad de un producto en el carrito
  describe('PUT /api/cart/:id', () => {
    it('Debería actualizar la cantidad de un producto en el carrito', (done) => {
      const cartItemId = 'ID_DEL_ITEM_EN_EL_CARRITO';
      const updatedQuantity = { quantity: 5 };

      chai
        .request(app)
        .put(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedQuantity)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Cantidad actualizada exitosamente');
          res.body.should.have.property('cartItem');
          res.body.cartItem.should.have.property('quantity').eql(5);
          done();
        });
    });

    it('Debería fallar si el producto en el carrito no existe', (done) => {
      const invalidCartItemId = 'ID_INEXISTENTE';
      const updatedQuantity = { quantity: 5 };

      chai
        .request(app)
        .put(`/api/cart/${invalidCartItemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedQuantity)
        .end((err, res) => {
          res.should.have.status(404); // Producto en el carrito no encontrado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Producto en el carrito no encontrado');
          done();
        });
    });

    it('Debería fallar si la cantidad no es válida', (done) => {
      const cartItemId = 'ID_DEL_ITEM_EN_EL_CARRITO';
      const invalidQuantity = { quantity: -1 }; // Cantidad inválida

      chai
        .request(app)
        .put(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidQuantity)
        .end((err, res) => {
          res.should.have.status(400); // Error de validación
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('La cantidad debe ser mayor a 0');
          done();
        });
    });

    it('Debería fallar si el usuario no está autenticado', (done) => {
      const cartItemId = 'ID_DEL_ITEM_EN_EL_CARRITO';
      const updatedQuantity = { quantity: 5 };

      chai
        .request(app)
        .put(`/api/cart/${cartItemId}`)
        .send(updatedQuantity) // Sin token de autenticación
        .end((err, res) => {
          res.should.have.status(401); // No autorizado
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('Token inválido o expirado');
          done();
        });
    });
  });
});