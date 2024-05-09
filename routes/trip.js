import express from 'express';
const router = express.Router();
import { getAllBookingsByUserId, toggleBookingStatus } from '../data/trip.js';
import {
    checkIfLoggedIn,
    checkIfHouseBelongsToHost,
} from "../middlewares/middleware.js";

router.get('/', checkIfLoggedIn, async (req, res) => {
    try {
        const bookingArray = await getAllBookingsByUserId(req.user.uid);
        return res.status(200).json({ data: bookingArray });
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});

router.post('/toggleStatus', checkIfLoggedIn, async (req, res) => {
    try {
        const { houseId, bookingId, status } = req.body;
        const updatedBooking = await toggleBookingStatus(houseId, bookingId, status);
        return res.status(200).json({ updatedBooking: updatedBooking, success: true });
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});

export default router;