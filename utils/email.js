const nodemailer = require('nodemailer');

// https://mailtrap.io
const sendEmail = async options => {
  // Crete transporters
  const transporter = nodemailer.createTransport({
    // Service: 'Gmail',
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD
    // }
    // Activate in gmail "less secure app" option

    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // Define email options
  const emailOptions = {
    from: 'L4wl3ss <l4wl3ss.emails@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html: ...
  };
  // Send email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
