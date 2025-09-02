import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Incrementa a 10 usuarios en 30 segundos
    { duration: '1m', target: 10 }, // Mantén 10 usuarios durante 1 minuto
    { duration: '30s', target: 0 }, // Reduce a 0 usuarios en 30 segundos
  ],
};

export default function () {
  // Test para obtener productos
  let res = http.get('http://localhost:3000/api/products');
  check(res, { 'status was 200': (r) => r.status === 200 });

  // Test para agregar al carrito
  res = http.post(
    'http://localhost:3000/api/cart',
    JSON.stringify({
      productId: 'ID_DEL_PRODUCTO',
      quantity: 2,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer TOKEN_DE_USUARIO',
      },
    }
  );
  check(res, { 'status was 201': (r) => r.status === 201 });
}