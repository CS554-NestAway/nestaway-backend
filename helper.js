import { ObjectId } from "mongodb";

export const getMongoID = (id) => {
  if (ObjectId.isValid(id) === false) throw "Invalid ID provided";
  if (typeof id === "string") {
    return ObjectId.createFromHexString(id);
  } else if (id instanceof ObjectId) {
    return id;
  } else {
    throw "Invalid ID provided";
  }
};
