// mockear servicios externos
const axios = require('axios');

async function processPayment(paymentDetails) {
  try {
    const response = await axios.post('https://api.example.com/payments', paymentDetails);
    return response.data;
  } catch (error) {
    throw new Error('Error al procesar el pago');
  }
}

module.exports = { processPayment };