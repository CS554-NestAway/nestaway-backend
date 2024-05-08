import { ObjectId } from "mongodb";
import { houses } from "../config/mongoCollections.js";
import moment from "moment";

export const getBookings = async (guestId) => {
  const housesCollection = await houses();

  const theHouses = await housesCollection
    .find({ "booking.userId": guestId })
    .toArray();

  return theHouses.map(({ _id, title, isApproved, isActive, bookings }) => ({
    houseId: _id.toString(),
    houseTitle: title,
    houseActive: isActive,
    houseApproved: isApproved,
    bookings: {
      me: bookings.filter((booking) => booking.userId === guestId),
      others: bookings.filter((booking) => booking.userId !== guestId),
    },
  }));
};

export const getBooking = async (guestId, bookingId) => {
  const housesCollection = await houses();

  const theHouse = await housesCollection.findOne({
    "booking.userId": guestId,
    "booking.bookingId": bookingId,
  });

  const { _id, title, isApproved, isActive, bookings } = theHouse;

  if (!theHouse) {
    return null;
  }
  return {
    houseId: _id.toString(),
    houseTitle: title,
    houseActive: isActive,
    houseApproved: isApproved,
    bookings: {
      me: bookings.filter((booking) => booking.userId === guestId),
      others: bookings.filter((booking) => booking.userId !== guestId),
    },
  };
};

export const changeDate = async (bookingId, checkIn, checkOut) => {
  const housesCollection = await houses();

  const theHouse = await housesCollection.findOne({
    "bookings.bookingId": bookingId,
  });
  const theBooking = theHouse.bookings.find(
    (booking) => booking.bookingId === bookingId
  );
  const newTotalPrice = theHouse.price * moment(checkOut).diff(checkIn, "days");

  const updatedHouse = await houses.findOneAndUpdate(
    {
      "bookings.bookingId": bookingId,
    },
    {
      $set: {
        "bookings.$.checkIn": checkIn,
        "bookings.$.checkOut": checkOut,
        "bookings.$.totalPrice": newTotalPrice,
      },
    },
    { returnDocument: "after" }
  );

  return {
    ...updatedHouse.bookings.find((booking) => booking.bookingId === bookingId),
    priceDiff: newTotalPrice - theBooking.totalPrice,
  };
};

export const cancel = async (bookingId) => {
  const housesCollection = await houses();

  const theHouse = await housesCollection.findOne({
    "bookings.bookingId": bookingId,
  });
  const theBooking = theHouse.bookings.find(
    (booking) => booking.bookingId === bookingId
  );

  const { cancellationDays, cancellationPercent } = theHouse.settings;
  const refund =
    moment(theBooking.checkIn).diff(moment(), "days") > cancellationDays
      ? theBooking.totalPrice
      : theBooking.totalPrice * cancellationPercent;

  const updatedHouse = await housesCollection.findOneAndUpdate(
    { "bookings.bookingId": bookingId },
    { $pull: { bookings: { bookingId } } },
    { returnDocument: "after" }
  );

  return { refund };
};
