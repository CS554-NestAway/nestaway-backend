import express from "express";
import * as hostDataFunctions from "../data/host.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const houses = await hostDataFunctions.getAllHouses();
  res.json(houses);
});

router.get("/:id", async (req, res) => {
  try {
    const house = await hostDataFunctions.getHouseById(req.params.id);
    res.json(house);
  } catch (e) {
    res.status(404).json({ error: "House not found" });
  }
});

export default router;
