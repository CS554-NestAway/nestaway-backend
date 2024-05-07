import { Router } from "express";
import * as guests from "../data/guest.js";

const router = Router();

const staticUser = { _id: "6621fca003f8cbabbabc287e" };
const staticHouseId = { houseId: "623b2b26a7e568c82047c037" };

router.get("/bookings", async (req, res) => {
  const user = staticUser || req.session.user;

  const houses = await guests.getAllBookings(user._id);
  res.json(houses);
});

router.get("/bookings/:houseId", async (req, res) => {
  const user = staticUser || req.session.user;
  const { houseId } = staticHouseId || req.params;

  try {
    const house = await guests.getBooking(user._id, houseId);
    res.json(house);
  } catch (e) {
    res.json({ error: e.message ?? e });
  }
});

export default router;
