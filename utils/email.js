import nodemailer from 'nodemailer';

class Email {
  constructor(user, url, role) {
    if (role === 'user') {
      this.to = user.user_email;
    } else if (role === 'dealership') {
      this.to = user.dealership_email;
      this.firstName = user.dealership_name;
    }
    this.url = url;
    this.from = `Sheikh Abdul Nishar <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // For DEVELOPMENT
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject) {
    // 1) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: JSON.stringify({
        firstName: this?.firstName,
        url: this.url,
        subject,
      }),
    };

    // 2) Create a transport and send email
    this.newTransport().sendMail(mailOptions, function (err) {
      if (err) {
        console.log('Error Occured while sending mail');
      } else {
        console.log('Email sent successfully');
      }
    });
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Your password reset token (valid only for 10 minutes)'
    );
  }
}

export default Email;
