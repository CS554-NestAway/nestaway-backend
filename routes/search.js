import express from "express";
import * as hostDataFunctions from "../data/host.js";

const router = express.Router();

router.get("/getUniqueStates", async (req, res) => {
  res.send(await hostDataFunctions.getUniqueStates());
});

export default router;

router.post("/", async (req, res) => {
  try {
    let state = req.body.state;
    let lat = req.body.lat;
    let lng = req.body.lng;

    let radius = req.body.radius;
    if (!radius) {
      radius = 10;
    }
    let checkIn = req.body.checkIn;
    let checkOut = req.body.checkOut;

    if (lat || lng) {
      if (!lat || !lng) {
        res
          .status(400)
          .json({ error: "You must provide a latitude and longitude" });
        return;
      }
    }
    if (checkIn || checkOut) {
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
    }
    if (!state && !lat && !lng && !checkIn && !checkOut) {
      lat = 37.7749;
      lng = 80.4194;
      radius = 10000000;
    }

    const houses = await hostDataFunctions.getHouseQuery({
      state: state,
      checkin: checkIn,
      checkout: checkOut,
      lat: lat,
      lng: lng,
      radius: radius,
    });
    res.json(houses);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

// router.post("/searchByLatLng/", async (req, res) => {
//   const lat = req.body.lat;
//   const lng = req.body.lng;
//   let checkIn = req.body.checkIn;
//   let checkOut = req.body.checkOut;
//   let radius = req.body.radius;

//   if (!radius) {
//     radius = 10;
//   }

//   if (checkIn) {
//     if (
//       new Date(checkIn) == "Invalid Date" ||
//       new Date(checkOut) == "Invalid Date"
//     ) {
//       res.status(400).json({ error: "Invalid Date" });
//       return;
//     }

//     checkIn = new Date(checkIn);
//     checkOut = new Date(checkOut);

//     if (!checkIn) {
//       res.status(400).json({ error: "You must provide a check-in date" });
//       return;
//     }
//     if (!checkOut) {
//       res.status(400).json({ error: "You must provide a check-out date" });
//       return;
//     }
//     if (checkIn > checkOut) {
//       res
//         .status(400)
//         .json({ error: "Check-in date must be before check-out date" });
//       return;
//     }
//     if (checkIn < new Date()) {
//       res.status(400).json({ error: "Check-in date must be after today" });
//       return;
//     }
//   }

//   const houses = await hostDataFunctions.getHouseQuery({
//     lat: lat,
//     lng: lng,
//     radius: radius,
//     checkin: checkIn,
//     checkout: checkOut,
//   });
//   res.json(houses);
// });
