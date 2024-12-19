const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerificationEmail = async (to, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:3000/api/users/verify-email?token=${token}`;

  const mailOptions = {
    from: `"IronProgress" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verificación de Email",
    html: `<p>Hola,</p>
           <p>Por favor verifica tu correo haciendo clic en el siguiente enlace:</p>
           <a href="${verificationLink}">Verificar Email</a>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;

