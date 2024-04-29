import express from 'express';
const router = express.Router();
import * as validation from '../validation/validateBooking.js';
import { getHouseById, getUserById, addBookingByHouseId } from '../data/booking';
import xss from 'xss';
router
    .route('/addBooking')
    .post(async (req, res) => {
        const newBooking = xss(req.body);
        if (!newBooking.checkIn || !newBooking.checkOut || !newBooking.houseId || !newBooking.userId) {
            return res.status(400).json({
                "error: you should input json like":
                {
                    'checkIn': 'String',
                    'checkOut': 'Stirng',
                    'houseId': 'String',
                    'userId': 'String',
                }
            });
        }
        const checkIn = newBooking.checkIn.toString().trim();
        const checkOut = newBooking.checkOut.toString().trim();
        const houseId = newBooking.houseId.toString().trim();
        const userId = newBooking.userId.toString().trim();
        try {
            validation.validateCheckInAndCheckOutTime(checkIn, checkOut);
            getHouseById(houseId);
            //getUserById(userId);
        } catch (e) {
            return res.status(400).json({error: e});
        }
        let updatedHouse;
        try {
            updatedHouse = addBookingByHouseId(houseId, {userId, checkIn, checkOut});
        } catch (e) {
            return res.status(400).json({error: e});
        }
        return res.status(200).json(updatedHouse);
    });