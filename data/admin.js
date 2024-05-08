import { admins, houses } from "../config/mongoCollections.js";

export const checkIfAdmin = async (uid) => {
  if (!uid) {
    return false;
  }

  const adminCollection = await admins();

  const admin = await adminCollection.findOne({ uid: uid });

  if (!admin) {
    return false;
  }

  return true;
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
