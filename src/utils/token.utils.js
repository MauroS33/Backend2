const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Función para generar un token de restablecimiento de contraseña
function generateResetToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Función para enviar un correo de restablecimiento de contraseña
async function sendResetEmail(email, resetLink) {
  // Configurar el transporte de correo
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Usamos Gmail como servicio
    auth: {
      user: process.env.EMAIL_USER, // Tu correo electrónico
      pass: process.env.EMAIL_PASS, // Tu contraseña de correo
    },
  });

  // Configurar el contenido del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Restablecimiento de Contraseña',
    html: `
      <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste restablecer tu contraseña, ignora este correo.</p>
    `,
  };

  // Enviar el correo
  await transporter.sendMail(mailOptions);
}

module.exports = {
  generateResetToken,
  sendResetEmail,
};