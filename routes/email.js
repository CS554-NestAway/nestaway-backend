import express from 'express';
import { sendEmail } from '../email.js'; 
import {sendbookingEmail} from '../bookingemail.js'

const router = express.Router();

router.post('/accemail', async (req, res) => {
  const { email, displayName } = req.body;
  try {
    await sendEmail(email, displayName);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'Failed to send email' });
  }
});

router.post('/bookingconfirm', async (req, res) => {    const { email, displayName  } = req.body;
    try {
      await sendbookingEmail(email, displayName );
      res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ error: 'Failed to send email' });
    }
  });

export default router;