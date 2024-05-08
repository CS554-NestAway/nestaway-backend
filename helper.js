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

export const computeDaysByCheckInAndCheckOut = (checkIn, checkOut) => {
  const differenceInTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const numberOfDays = Math.round(differenceInDays);
  return numberOfDays;
}