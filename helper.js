import { ObjectId } from "mongodb";
export const throwErrorWithStatus = (status, message) => {
  throw { status: status, message: message };
};

export const getMongoID = (id) => {
  if (!id) throw "You must provide an id to search for";

  if (typeof id === "string") {
    if (!ObjectId.isValid(id)) throw "Invalid ID provided";
    return ObjectId.createFromHexString(id);
  } else if (id instanceof ObjectId) {
    return id;
  } else {
    throw "Invalid ID provided";
  }
};
