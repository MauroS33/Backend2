require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conexión exitosa a MongoDB Atlas'))
.catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});