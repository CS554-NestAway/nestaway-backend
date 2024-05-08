import * as hostDataFunctions from "../data/host.js";
import firebaseApp from "../config/fbconfig.js";
import { getAuth } from "firebase-admin/auth";
import { checkIfAdmin } from "../data/admin.js";
// import { auth } from "firebase-admin";
export const checkIfHouseBelongsToHost = async (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You must be logged in to perform this action" });
  }

  // if (checkIfAdmin(req, res, next)) {
  //   console.log("admin");
  //   next();
  // } else {
  const hostId = req.user.uid;

  const houseId = req.params.id;

  const house = await hostDataFunctions.getHouseById(houseId);

  if (!house) {
    return res.status(404).json({ error: "House not found" });
  }

  if (house.hostId !== hostId) {
    return res.status(403).json({ error: "You are not authorized" });
  }

  next();
  // }
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

export const checkIfLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ error: "You must be logged in to perform this action" });
  }

  next();
};
