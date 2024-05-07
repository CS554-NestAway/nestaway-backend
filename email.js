import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.SMTP_SERVER_HOST,
  port: process.env.SMTP_SERVER_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendAccountCreatedEmail = async (email, displayName) => {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: 'Welcome to Your App Name',
        html: `
          <p>Hello ${displayName},</p>
          <p>Your account has been successfully created.</p>
          <p>Thanks for signing up with Your App Name!</p>
        `,
      });
      console.log('Account created email sent successfully');
    } catch (error) {
      console.error('Error sending account created email:', error);
    }
  };
  
  