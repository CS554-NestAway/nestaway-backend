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

 export const sendbookingEmail = async (recipientEmail, name) => {
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
          <p>Your Booking is confirmed. </p>
        <p>We hope you have a fantastic experience using NestAway.</p>
        <p>Happy Nesting!</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Your Booking is confirmed. We hope you have a fantastic experience using NestAway.Happy Nesting!"
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Booking Confirmed!`,
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

// Add this to the client component.
// async function sendBookingEmail(email, displayName) {
//     const response = await fetch('http://localhost:8080/sendemail/bookingconfirm', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, displayName }),
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to send email');
//     }
//   }
// 


// Add this after booking confirmation
//  await sendSignUpEmail(email.value, displayName.value);
  
