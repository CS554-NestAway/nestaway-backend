import { houses } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getMongoID, computeDaysByCheckInAndCheckOut } from "../helper.js";
import * as validateBooking from "../validation/validateBooking.js";
export const getAllHouses = async () => {
  const houseCollection = await houses();

  return await houseCollection.find({}).toArray();
};

export const getHouseById = async (id) => {
  if (!id) throw "You must provide an id to search for";
  if (ObjectId.isValid(id) === false) throw "Invalid ID provided";

  const houseCollection = await houses();
  const house = await houseCollection.findOne({ _id: getMongoID(id) });

  if (house === null) throw "No house with that id";

  return house;
};

export const getUserById = async (id) => {
  if (!id) throw "You must provide an id to search for";
  if (ObjectId.isValid(id) === false) throw "Invalid ID provided";

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: getMongoID(id) });

  if (user === null) throw "No user with that id";

  return user;
};

export const addBookingByHouseId = async (id, bookingInfo) => {
  if (!id) throw "You must provide an id to add a booking";
  if (ObjectId.isValid(id) === false) throw "Invalid ID provided";

  const houseCollection = await houses();
  const house = await houseCollection.findOne({ _id: getMongoID(id) });

  if (house === null) throw "No house with that id";

  const { userId, checkIn, checkOut, paymentMethod } = bookingInfo;
  const user = await getUserById(userId.toString());
  validateBooking.validateCheckInAndCheckOutTime(checkIn, checkOut);
  const numbersOfDaysLiving = helper.computeDaysByCheckInAndCheckOut(checkIn, checkOut);
  const price = house.price;
  const totalPrice = price * numbersOfDaysLiving;
  const newBooking = {
    bookingId: new ObjectId(),
    userId: user._id,
    checkIn: checkIn,
    checkOut: checkOut,
    totalPrice: totalPrice,
    currency: "USD",
    paymentMethod: paymentMethod,
    createdAt: new Date(),
    status: "pending"
  }
  const bookingArray = house.bookings;
  bookingArray.push(newBooking);
  const updateInfo = await houseCollection.findOneAndUpdate(
    { _id: getMongoID(id)},
    {
      $set: {
        bookings: bookingArray
      }
    },
    { returnDocument: 'after'}
  );
  if (!updateInfo) throw "Add booking failed";
  return updateInfo;
}