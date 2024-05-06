import express from "express";
import * as hostDataFunctions from "../data/host.js";
import { checkIfHouseBelongsToHost } from "../middlewares/middleware.js";
import { throwErrorWithStatus } from "../helper.js";
import { validateHouseDetailsOnCreate } from "../validation/validateHouse.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.get("/", async (req, res) => {
  const projections = req.query.projections
    ? JSON.parse(req.query.projections)
    : null;

  const houses = await hostDataFunctions.getAllHouses();
  res.json(houses);
});
router.post("/", async (req, res) => {
  try {
    const houseDetails = req.body;
    console.log(houseDetails);
    // houseDetails.hostId = req.session.user._id;

    houseDetails.hostId = new ObjectId("616f3b3b1f3b3b3b3b3b3b3s");
    const house = await hostDataFunctions.addHouse(houseDetails);
    res.json(house);
  } catch (e) {
    console.log(e);
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const house = await hostDataFunctions.getHouseById(req.params.id);
    res.json(house);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.put("/:id", checkIfHouseBelongsToHost, async (req, res) => {
  try {
    const houseDetails = req.body;

    houseDetails.hostId = new ObjectId("616f3b3b1f3b3b3b3b3b3b32");

    const house = await hostDataFunctions.updateHouse(
      req.params.id,
      houseDetails
    );
    res.json(house);
  } catch (e) {
    console.log(e);
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.delete("/:id", checkIfHouseBelongsToHost, async (req, res) => {
  try {
    await hostDataFunctions.deleteHouse(req.params.id);
    res.json({ message: "House deleted" });
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

export default router;
