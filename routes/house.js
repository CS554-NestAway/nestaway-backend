import express from "express";
import * as hostDataFunctions from "../data/host.js";
import { checkIfLoggedIn } from "../middlewares/middleware.js";
import { throwErrorWithStatus } from "../helper.js";
import { validateHouseDetailsOnCreate } from "../validation/validateHouse.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.get("/hostId", checkIfLoggedIn, async (req, res) => {
  try {
    const hostId = req.user.uid;
    const houses = await hostDataFunctions.gethousesbyhostid(hostId);
    res.json(houses);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

export default router;
