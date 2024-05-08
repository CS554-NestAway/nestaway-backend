import express from "express";
import * as creditDataFunctions from "../data/credits.js";

import {
  checkIfLoggedIn,
  checkIfHouseBelongsToHost,
} from "../middlewares/middleware.js";

const router = express.Router();

router.get("/", checkIfLoggedIn, async (req, res) => {
  try {
    const credits = await creditDataFunctions.getCredits(req.user.uid);
    res.json(credits);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.post("/add", checkIfLoggedIn, async (req, res) => {
  try {
    const uid = req.user.uid;
    const creditsToAdd = req.body.creditsToAdd;
    const credit = await creditDataFunctions.addCredits(uid, creditsToAdd);
    res.json(credit);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.post("/deduct", checkIfLoggedIn, async (req, res) => {
  try {
    const uid = req.user.uid;
    const creditsToDeduct = req.body.creditsToDeduct;
    const credit = await creditDataFunctions.deductCredits(
      uid,
      creditsToDeduct
    );
    res.json(credit);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.post("/checkCredits", checkIfLoggedIn, async (req, res) => {
  try {
    const uid = req.user.uid;
    const creditsToCheck = req.body.creditsToCheck;
    const credit = await creditDataFunctions.checkIfUserHasEnoughCredits(
      uid,
      creditsToCheck
    );
    res.json(credit);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.post("/returnCredits", checkIfLoggedIn, async (req, res) => {
  try {
    const userId = req.body.userId;
    const creditsToAdd = req.body.creditsToAdd;
    const credit = await creditDataFunctions.addCredits(userId, creditsToAdd);
    res.json(credit);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

router.post("/deductByUserId", checkIfLoggedIn, async (req, res) => {
  try {
    const userId = req.body.userId;
    const creditsToDeduct = req.body.creditsToDeduct;
    const credit = await creditDataFunctions.deductCredits(
      userId,
      creditsToDeduct
    );
    res.json(credit);
  } catch (e) {
    if (e.status) {
      res.status(e.status).json({ error: e.message });
    } else {
      res.status(400).json({ error: e });
    }
  }
});

export default router;
