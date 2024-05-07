import { createTransport } from 'nodemailer';
import AWS from 'aws-sdk';

// Configure AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION, // Specify your AWS SES region
});

// Create SES transporter using AWS SDK
const transporter = createTransport({
  SES: new AWS.SES({ apiVersion: '2010-12-01' }),
});

export const sendAccountCreatedEmail = async (email, displayName) => {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL_ADDRESS, // Specify your sender email address verified in SES
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
