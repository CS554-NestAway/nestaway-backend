import { ObjectId } from "mongodb";
import { getMongoID, computeDaysByCheckInAndCheckOut } from "../helper.js";
import * as validateBooking from "../validation/validateBooking.js";
import * as helper from "../helper.js";
import { houses, users } from "../config/mongoCollections.js";

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

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: getMongoID(id) });

  if (user === null) throw "No user with that id";

  return user;
};

export const addBookingByHouseId = async (id, bookingInfo) => {
  if (!id) throw "You must provide an id to add a booking";
  if (ObjectId.isValid(id) === false) throw "Invalid ID provided";

  const houseCollection = await houses();
  const house = await houseCollection.findOne({ _id: getMongoID(id) });

  if (house === null) throw "No house with that id";

  const { userId, checkIn, checkOut } = bookingInfo;
  // validateBooking.isDateValid(checkIn);
  // validateBooking.isDateValid(checkOut);
  validateBooking.validateCheckInAndCheckOutTime(checkIn, checkOut);
  await validateBooking.overlappingBooking(id, checkIn, checkOut);
  const numbersOfDaysLiving = helper.computeDaysByCheckInAndCheckOut(
    checkIn,
    checkOut
  );
  const price = house.price;
  const st = numbersOfDaysLiving * price;
  //const t = st * 0.06625;
  const sf = st * 0.142;
  const tp = st + sf + 100;
  const totalPrice = parseFloat(tp.toFixed(2));
  const newBooking = {
    bookingId: new ObjectId(),
    uid: userId,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    totalPrice: totalPrice,
    createdAt: new Date(),
    status: "pending",
  };
  const bookingArray = house.bookings ? house.bookings : [];
  bookingArray.push(newBooking);
  const updateInfo = await houseCollection.findOneAndUpdate(
    { _id: getMongoID(id) },
    {
      $set: {
        bookings: bookingArray,
      },
    },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "Add booking failed";
  return updateInfo;
};

export const getAllBookingsByUserId = async (id) => {
  const houseCollection = await houses();
  const housesArray = await houseCollection.find({ hostId: id }).toArray();
  let bookingArray = [];
  housesArray.map((house) => {
    if (house.bookings) {
      house.bookings.map((booking) => {
        bookingArray.push({
          houseId: house._id.toString(),
          booking: booking,
        });
      });
    }
  });
  bookingArray = bookingArray.filter(
    (booking) => booking.booking.status === "pending"
  );
  return bookingArray;
};

export const toggleBookingStatus = async (houseId, bookingId, status) => {
  const houseCollection = await houses();
  const house = await houseCollection.findOne({ _id: getMongoID(houseId) });
  const bookingArray = house.bookings;
  bookingArray.map((booking) => {
    if (booking.bookingId.toString() === bookingId) {
      return (booking.status = status);
    }
  });
  const updateInfo = await houseCollection.findOneAndUpdate(
    { _id: getMongoID(houseId) },
    {
      $set: {
        bookings: bookingArray,
      },
    },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "Update booking status failed";
  return updateInfo;
};
