import express from "express";
import * as hostDataFunctions from "../data/host.js";
import {
  checkIfLoggedIn,
  checkIfBookingBelongsToGuest,
  checkIfHouseBelongsToHost,
} from "../middlewares/middleware.js";
import { throwErrorWithStatus } from "../helper.js";
import { validateHouseDetailsOnCreate } from "../validation/validateHouse.js";
import { ObjectId } from "mongodb";
import { checkIfAdmin } from "../data/admin.js";

import { getAuth } from "firebase-admin/auth";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projections = req.query.projections
      ? JSON.parse(req.query.projections)
      : null;

    const houses = await hostDataFunctions.getAllHouses();
    res.json(houses);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});
router.post("/", checkIfLoggedIn, async (req, res) => {
  try {
    const houseDetails = req.body;
    // console.log(houseDetails);
    houseDetails.hostId = req.user.uid;
    houseDetails.hostName = req.user.name;
    houseDetails.hostImage = req.user.picture;
    houseDetails.hostEmail = req.user.email;

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
router.get("/getHosting", checkIfLoggedIn, async (req, res) => {
  try {
    const houses = await hostDataFunctions.gethousesbyhostid(req.user.uid);
    let current = [];
    let upcomingApproved = [];
    let upcomingPending = [];
    for (let i = 0; i < houses.length; i++) {
      let currenthosting = await hostDataFunctions.getCurrentHosting(
        houses[i]._id
      );
      if (currenthosting.bookings.length > 0) {
        current.push(currenthosting);
      }
      let upcominghosting = await hostDataFunctions.getUpcomingApprovedHosting(
        houses[i]._id
      );

      if (upcominghosting.bookings.length > 0) {
        upcomingApproved.push(upcominghosting);
      }

      let upcomingPendinghosting =
        await hostDataFunctions.getUpcomingPendingHosting(houses[i]._id);

      if (upcomingPendinghosting.bookings.length > 0) {
        upcomingPending.push(upcomingPendinghosting);
      }
    }
    res.json({
      current: current,
      upcomingApproved: upcomingApproved,
      pending: upcomingPending,
    });
  } catch (e) {
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

router.put(
  "/:id",
  checkIfLoggedIn,
  checkIfBookingBelongsToGuest,
  async (req, res) => {
    try {
      const houseDetails = req.body;

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
  }
);

router.delete(
  "/:id",
  checkIfLoggedIn,
  checkIfBookingBelongsToGuest,
  async (req, res) => {
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
  }
);

router.get(":id/toggleActive", checkIfHouseBelongsToHost, async (req, res) => {
  try {
    const house = await hostDataFunctions.toggleHouseActiveStatus(
      req.params.id
    );
    res.json(house);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});
router.get(":id/approve", checkIfAdmin, async (req, res) => {
  try {
    const house = await hostDataFunctions.approveHouse(req.params.id);
    res.json(house);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.get(":id/reject", checkIfAdmin, async (req, res) => {
  try {
    const house = await hostDataFunctions.rejectHouse(req.params.id);
    res.json(house);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

export default router;
