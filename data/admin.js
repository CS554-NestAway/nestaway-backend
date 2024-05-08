import { admins, houses } from "../config/mongoCollections.js";

export const checkIfAdmin = async (req, res, next) => {
  if (!req.user.uid) {
    return false;
  }

  const adminCollection = await admins();

  const admin = await adminCollection.findOne({ uid: req.user.uid });

  if (!admin) {
    return res.status(403).json({ error: "You are not authorized" });
  }
  req.user.admin = true;
  next();
};

export const checkAdmin = async (req, res, next) => {
  if (!req.user.uid) {
    return { isAdmin: false };
  }

  const adminCollection = await admins();

  const admin = await adminCollection.findOne({ uid: req.user.uid });

  if (!admin) {
    return { isAdmin: false };
  }
  return { isAdmin: true };
};

export const getPendingHouses = async () => {
  const houseCollection = await houses();
  const housesArray = await houseCollection
    .find({ isApproved: false })
    .project({
      name: 1,
      address: 1,
      hostId: 1,
      isApproved: 1,
    })
    .toArray();

  return housesArray;
};

export const approveHouse = async (houseId) => {
  const houseCollection = await houses();

  const house = await houseCollection.findOne({ _id: getMongoID(houseId) });

  if (!house) {
    throw "House not found";
  }

  await houseCollection.updateOne(
    { _id: getMongoID(houseId) },
    { $set: { isApproved: true } }
  );

  return true;
};

export const rejectHouse = async (houseId) => {
  const houseCollection = await houses();

  const house = await houseCollection.findOne({ _id: getMongoID(houseId) });

  if (!house) {
    throw "House not found";
  }

  await houseCollection.updateOne(
    { _id: getMongoID(houseId) },
    { $set: { isDeleted: true } }
  );

  return true;
};
