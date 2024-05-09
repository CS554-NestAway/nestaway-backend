import { ObjectId } from "mongodb";
import { getMongoID, computeDaysByCheckInAndCheckOut } from "../helper.js";
import { houses, users } from "../config/mongoCollections.js";

export const getAllBookingsByUserId = async (id) => {
    const houseCollection = await houses();
    const housesArray = await houseCollection.find().toArray();
    let bookingArray = [];
    housesArray.map((house) => {
        if (house.bookings) {
            house.bookings.map((booking) => {
                bookingArray.push({
                    houseId: house._id.toString(),
                    hostId: house.hostId,
                    settings: house.settings,
                    booking: booking
                });
            })
        }
    })
    bookingArray = bookingArray.filter((booking) => booking.booking.uid === id && booking.booking.status === "approved");
    return bookingArray;
}

export const toggleBookingStatus = async (houseId, bookingId, status) => {
    const houseCollection = await houses();
    const house = await houseCollection.findOne({ _id: getMongoID(houseId) });
    const bookingArray = house.bookings;
    bookingArray.map((booking) => {
        if (booking.bookingId.toString() === bookingId) {
            return booking.status = status;
        }
    })
    const updateInfo = await houseCollection.findOneAndUpdate(
        { _id: getMongoID(houseId) },
        {
            $set: {
                bookings: bookingArray
            }
        },
        { returnDocument: 'after' }
    );
    if (!updateInfo) throw "Update booking status failed";
    return updateInfo;
};