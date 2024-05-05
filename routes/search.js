import express from "express";
import * as hostDataFunctions from "../data/host.js";

const router = express.Router();

router.get("/getUniqueStates", async (req, res) => {
  res.send(await hostDataFunctions.getUniqueStates());
});

export default router;

router.get("/searchByState/", async (req, res) => {
  const state = req.body.state;
  let checkIn = req.body.checkIn;
  let checkOut = req.body.checkOut;

  if (!state) {
    res.status(400).json({ error: "You must provide a state" });
    return;
  }
  if (
    new Date(checkIn) == "Invalid Date" ||
    new Date(checkOut) == "Invalid Date"
  ) {
    res.status(400).json({ error: "Invalid Date" });
    return;
  }

  checkIn = new Date(checkIn);
  checkOut = new Date(checkOut);

  if (!checkIn) {
    res.status(400).json({ error: "You must provide a check-in date" });
    return;
  }
  if (!checkOut) {
    res.status(400).json({ error: "You must provide a check-out date" });
    return;
  }
  if (checkIn > checkOut) {
    res
      .status(400)
      .json({ error: "Check-in date must be before check-out date" });
    return;
  }
  if (checkIn < new Date()) {
    res.status(400).json({ error: "Check-in date must be after today" });
    return;
  }

  const houses = await hostDataFunctions.getHouseQuery({ state: state });
  res.json(houses);
});
