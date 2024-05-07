import { ObjectId } from "mongodb";
import { houses } from "../config/mongoCollections.js";

export const getAllBookings = async (guestId) => {
  const housesCol = await houses();

  const houses = await housesCol
    .find({
      "bookings.userId": new ObjectId(guestId),
    })
    .toArray();


  const bookings=houses.bookings.filter(b=>b.userId=guestId)
  return [bookings,houses];
};

export const getBooking = async (guestId, houseId) => {
  const housesCol = await houses();

  const theBooking = await housesCol.findOne({
    "bookings.userId": new ObjectId(guestId),
    _id: new ObjectId(houseId),
  });

  return theBooking;
};
