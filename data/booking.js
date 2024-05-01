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

    const { userId, checkIn, checkOut, paymentMethod } = bookingInfo;
    //const user = await getUserById(userId.toString());
    validateBooking.isDateValid(checkIn);
    validateBooking.isDateValid(checkOut);
    validateBooking.validateCheckInAndCheckOutTime(checkIn, checkOut);
    await validateBooking.overlappingBooking(id, checkIn, checkOut);
    const numbersOfDaysLiving = helper.computeDaysByCheckInAndCheckOut(checkIn, checkOut);
    const price = house.price;
    const st = numbersOfDaysLiving * price;
    const t = st * 0.06625;
    const sf = st * 0.142;
    const tp = st + t + sf;
    const totalPrice = parseFloat(tp.toFixed(2));
    const newBooking = {
        bookingId: new ObjectId(),
        userId: userId,
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
        { _id: getMongoID(id) },
        {
            $set: {
                bookings: bookingArray
            }
        },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw "Add booking failed";
    return updateInfo;
}