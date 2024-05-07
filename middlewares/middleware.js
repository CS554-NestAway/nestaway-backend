import * as hostDataFunctions from "../data/host.js";
import firebaseApp from "../config/fbconfig.js";
import { getAuth } from "firebase-admin/auth";

// import { auth } from "firebase-admin";
export const checkIfHouseBelongsToHost = async (req, res, next) => {
  // if (!req.params.id) {
  //   return res.status(400).json({ error: "You must provide an id" });
  // }
  next();
  //   if (isAdmin(req.user.role)) {
  // if (isAdmin("a")) {
  //   next();
  // }

  // try {
  //   const house = await hostDataFunctions.getHouseById(req.params.id);
  //   if (house.hostId !== req.session.user._id) {
  //     return res
  //       .status(403)
  //       .json({ error: "You are not authorized to perform this action" });
  //   }
  // } catch (e) {
  //   return res.status(400).json({ error: e });
  // }

  // next();
};

export const isAdmin = (role) => {
  //   return role === "admin";
  return false;
};

export const validateUserToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    token = token.split(" ")[1];

    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (e) {
    req.user = null;
    next();
  }
};
