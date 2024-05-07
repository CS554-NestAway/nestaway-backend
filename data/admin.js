import { admins } from "../config/mongoCollections.js";

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
