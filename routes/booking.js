import express from 'express';
const router = express.Router();
import * as validation from '../validation/validateBooking.js';
import { getHouseById, getUserById, addBookingByHouseId, getAllBookingsByUserId, toggleBookingStatus } from '../data/booking.js';
import {
    checkIfLoggedIn,
    checkIfHouseBelongsToHost,
} from "../middlewares/middleware.js";

router.post('/addBooking', checkIfLoggedIn, async (req, res) => {
    const newBooking = req.body;
    if (!newBooking.checkIn || !newBooking.checkOut || !newBooking.houseId || !newBooking.userId) {
        return res.status(400).json({
            "error: you should input json like":
            {
                'checkIn': 'String',
                'checkOut': 'Stirng',
                'houseId': 'String',
                'uid': 'String'
            }
        });
    }
    const checkIn = newBooking.checkIn.toString().trim();
    const checkOut = newBooking.checkOut.toString().trim();
    const houseId = newBooking.houseId.toString().trim();
    const userId = newBooking.userId.toString().trim();

    try {
        validation.validateCheckInAndCheckOutTime(checkIn, checkOut);
        await getHouseById(houseId);
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    let updatedHouse;
    try {
        updatedHouse = await addBookingByHouseId(houseId, { userId, checkIn, checkOut });
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    return res.status(200).json({ updatedHouse: updatedHouse, success: true });
});

router.get('/bookings', checkIfLoggedIn, async (req, res) => {
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