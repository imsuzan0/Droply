const nodemailer = require("nodemailer");

const sentEmail = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let info;
  try {
    info=await transporter.sendMail({
    from:`inShare <${from}>`,
    to:to,
    subject:subject,
    text:text,
    html:html
  })
    console.log('Message sent:', info);
  } catch (error) {
    console.error('Error sending email:', error);
  throw error; 
  }
};

module.exports = sentEmail;
