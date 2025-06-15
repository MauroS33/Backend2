const nodemailer = require('nodemailer');

// Función para enviar correos electrónicos
async function sendEmail(to, subject, html) {
  try {
    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Usamos Gmail como servicio
      auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS, // Tu contraseña de correo
      },
    });

    // Configurar las opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to}: ${subject}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('No se pudo enviar el correo');
  }
}

module.exports = sendEmail;