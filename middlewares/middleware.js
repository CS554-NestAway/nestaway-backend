import * as hostDataFunctions from "../data/host.js";
import { initializeApp } from "firebase-admin/app";

const app = initializeApp();

export const checkIfHouseBelongsToHost = async (req, res, next) => {
  // if (!req.params.id) {
  //   return res.status(400).json({ error: "You must provide an id" });
  // }
  next();
  //   if (isAdmin(req.user.role)) {
  if (isAdmin("a")) {
    next();
  }

  try {
    const house = await hostDataFunctions.getHouseById(req.params.id);
    if (house.hostId !== req.session.user._id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action" });
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  next();
};

export const isAdmin = (role) => {
  //   return role === "admin";
  return false;
};

export const validateUserToken = async (req, res, next) => {
  next();
};
