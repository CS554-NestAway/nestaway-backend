import { Router } from "express";
import { cancel, changeDate, getBookings } from "../data/guest.js";
import {
  checkIfBookingBelongsToGuest,
  checkIfLoggedIn,
} from "../middlewares/middleware.js";

const router = Router();

router.get("/bookings", checkIfLoggedIn, async (req, res) => {
  const data = await getBookings(req.user.uid);
  return res.json(data);
});

router
  .route("/bookings/:bookingId")
  .post(checkIfBookingBelongsToGuest, async (req, res) => {
    const bookingId = req.params;
    const { checkIn, checkOut } = req.body;

    const data = await changeDate(bookingId, checkIn, checkOut);

    return res.json(data);
  })
  .delete(checkIfBookingBelongsToGuest, async (req, res) => {
    const bookingId = req.params;
    const { refund } = await cancel(bookingId);
    return res.json({ refund });
  });

export default router;
