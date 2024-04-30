import express from 'express';
const router = express.Router();
import * as validation from '../validation/validateBooking.js';
import { getHouseById, getUserById, addBookingByHouseId } from '../data/booking.js';
import xss from 'xss';
router
    .route('/addBooking')
    .get(async (req, res) => {
        return res.status(200).json({status: 200});
    })
    .post(async (req, res) => {
        const newBooking = req.body;
        if (!newBooking.checkIn || !newBooking.checkOut || !newBooking.houseId || !newBooking.userId || !newBooking.paymentMethod) {
            return res.status(400).json({
                "error: you should input json like":
                {
                    'checkIn': 'String',
                    'checkOut': 'Stirng',
                    'houseId': 'String',
                    'userId': 'String',
                    'paymentMethod': 'String'
                }
            });
        }
        const checkIn = newBooking.checkIn.toString().trim();
        const checkOut = newBooking.checkOut.toString().trim();
        const houseId = newBooking.houseId.toString().trim();
        const userId = newBooking.userId.toString().trim();
        const paymentMethod = newBooking.paymentMethod.toString().trim();
        try {
            validation.validateCheckInAndCheckOutTime(checkIn, checkOut);
            await getHouseById(houseId);
            //getUserById(userId);
        } catch (e) {
            return res.status(400).json({error: e});
        }
        let updatedHouse;
        try {
            updatedHouse = await addBookingByHouseId(houseId, {userId, checkIn, checkOut, paymentMethod});
        } catch (e) {
            return res.status(400).json({error: e});
        }
        return res.status(200).json({updatedHouse: updatedHouse, success: true});
    });

export default router;