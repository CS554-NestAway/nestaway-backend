import express from "express";
import * as hostDataFunctions from "../data/host.js";
import { checkIfHouseBelongsToHost } from "../middlewares/middleware.js";
import { throwErrorWithStatus } from "../helper.js";
import { validateHouseDetailsOnCreate } from "../validation/validateHouse.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.post("/hostId", async (req, res) => {});

export default router;
