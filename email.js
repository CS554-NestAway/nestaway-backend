import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import "dotenv/config";

const SES_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_SES_REGION,
};

const sesClient = new SESClient(SES_CONFIG);

export const sendEmail = async (recipientEmail, name) => {
  let params = {
    Source: process.env.AWS_SES_SENDER,
    Destination: {
      ToAddresses: [
        recipientEmail
      ],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<p>Hey ${name}!</p>
          <p>We are thrilled to welcome you to NestAway! Your account has been successfully created, and we're excited to have you join our community.</p>
          <p>Here are a few things you can do with your new account:</p>
          <ul>
          <li>Explore our wide range of properties and services.</li>
          <li>Customize your preferences to tailor your experience.</li>
          <li>Access exclusive offers, promotions, and updates.</li>
          <li>Host your property and earn extra income.</li>
          <li>Book a property for your next stay or vacation.</li>
          </ul>
        <p>We hope you have a fantastic experience using NestAway.</p>
        <p>Happy Nesting!</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "We are thrilled to welcome you to NestAway! Your account has been successfully created, and we're excited to have you join our community.We hope you have a fantastic experience using NestAway.Happy Nesting!"
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Welcome to Nestaway!`,
      }
    },
  };

  try {
    const sendEmailCommand = new SendEmailCommand(params);
    const res = await sesClient.send(sendEmailCommand);
    console.log('Email has been sent!', res);
  } catch (error) {
    console.error(error);
  }
}


