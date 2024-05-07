import { ObjectId } from "mongodb";
import { houses } from "../config/mongoCollections.js";

export const getAllBookings = async (guestId) => {
  const housesCol = await houses();

  const bookings = await housesCol
    .find({
      "bookings.userId": new ObjectId(guestId),
    })
    .toArray();

  return bookings;
};

export const getBooking = async (guestId, houseId) => {
  const housesCol = await houses();

  const theBooking = await housesCol.findOne({
    "bookings.userId": new ObjectId(guestId),
    _id: new ObjectId(houseId),
  });

  return theBooking;
};
