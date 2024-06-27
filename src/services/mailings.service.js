const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const { GMAIL_SERVICE, GMAIL_PORT, GMAIL_AUTH_USER, GMAIL_AUTH_KEY, JWT_PRIVATE_KEY } = require('../config/environment.config');

const transporter = nodemailer.createTransport({
  service: GMAIL_SERVICE,
  port: GMAIL_PORT,
  auth: {
    user: GMAIL_AUTH_USER,
    pass: GMAIL_AUTH_KEY
  }
});

class MailingsService {

  async sendRegisterEmail(destinationEmail) {
    const info = await transporter.sendMail({
      from: GMAIL_AUTH_USER,
      to: destinationEmail,
      subject: 'Registration Email',
      html: `
        <h1>Welcome to the app 👋</h1>
        <p>🥳 You have successfully registered! 👌</p>
      `
    });
    return info;
  }

  async sendPurchaseEmail(destinationEmail, ticket) {

    const info = await transporter.sendMail({
      from: GMAIL_AUTH_USER,
      to: destinationEmail,
      subject: 'Purchase Email',
      html: `
        <h1>Thanks for your purchase 👋</h1>
        <p>🥳 You have successfully purchased the following products: 👌</p>
        <br/>
        <p>Ticket Code: ${ticket.code}</p>
        <p>Purchase Date: ${ticket.purchase_datetime}</p>
        <p>Total Amount: $${ticket.amount}</p>
        `
    })
  }

  async sendPasswordResetEmail(user, destinationEmail, token) {

    const passwordResetToken = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '1h' })

    const info = await transporter.sendMail({
      from: GMAIL_AUTH_USER,
      to: destinationEmail,
      subject: 'Password Reset Email',
      html: `
        <h1>Password Reset Email</h1>
        <p>Click on the link below to reset your password:</p>
        <a href="http://localhost:8080/api/sessions/changePassword/${token}">Reset Password</a>
      `
    })
  }

  async sendDeletedInactiveUserEmail(destinationEmail) {
    const info = await transporter.sendMail({
      from: GMAIL_AUTH_USER,
      to: destinationEmail,
      subject: 'Deleted Account',
      html: `
        <h1>Hi, we have bad news for you! 😢</h1>
        <p> You account has been deleted due to inactivity.</p>
        <p>Please, register again to reactivate your account.</p>
      `
    });
    return info;
  }

  async sendDeletedProduct(destinationEmail) {
    const info = await transporter.sendMail({
      from: GMAIL_AUTH_USER,
      to: destinationEmail,
      subject: 'Deleted Product',
      html: `
        <h1>Info Message!</h1>
        <p> A product you created was deleted by an '@admin' user.</p>
      `
    });
    return info;
  }
}

module.exports = MailingsService;