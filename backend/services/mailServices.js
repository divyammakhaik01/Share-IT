const nodemailer = require("nodemailer");

const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASSWORD = process.env.SMTP_PASSWORD;




const sendMail = async ({ from, to, subject, text, html }) => {

  console.log(USER , "  " , PASSWORD);
  
  const transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: false,
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from :`ShareIT <${from}>`,
    to,
    subject,
    text,
    html,
  });

  
};

module.exports = sendMail;
