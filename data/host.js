import { houses } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getMongoID } from "../helper.js";
import {
  validateHouseDetailsOnCreate,
  validateHouseDetailsOnUpdate,
} from "../validation/validateHouse.js";

import { getAuth } from "firebase-admin/auth";
import { throwErrorWithStatus } from "../helper.js";
export const getAllHouses = async (projections) => {
  const houseCollection = await houses();

  return await houseCollection
    .find({ isApproved: true, isDeleted: false })
    .project(
      projections || {
        name: 1,
        title: 1,
        houseType: 1,
        address: 1,
        photos: 1,
        price: 1,
        currency: 1,
        rating: 1,
        isApproved: 1,
        isActive: 1,
        isDeleted: 1,
      }
    )
    .toArray();
};

export const getAllPendingHouses = async (projections) => {
  const houseCollection = await houses();
  const housesArray = await houseCollection
    .find({ isApproved: false, isDeleted: false })
    .toArray();

  return housesArray;
};

export const getHouseById = async (id, projections) => {
  if (!id) throw "You must provide an id to search for";
  if (ObjectId.isValid(id) === false) throw "Invalid ID provided";

  const houseCollection = await houses();
  const house = await houseCollection.findOne({ _id: getMongoID(id) });

  if (house === null) throwErrorWithStatus(404, "House not found");

  return house;
};

export const addHouse = async (houseDetails) => {
  if (!houseDetails) throw "You must provide house details";
  if (typeof houseDetails !== "object") throw "House details must be an object";

  try {
    houseDetails.createdAt = new Date();
    houseDetails.updatedAt = new Date();
    houseDetails.isDeleted = false;
    houseDetails.isActive = true;
    houseDetails.isApproved = false;

    houseDetails = validateHouseDetailsOnCreate(houseDetails);

    const houseCollection = await houses();

    const insertInfo = await houseCollection.insertOne(houseDetails);
    console.log(insertInfo.insertedId);
    if (insertInfo.insertedCount === 0)
      throwErrorWithStatus(500, "Could not add house");

    return await getHouseById(insertInfo.insertedId);
  } catch (e) {
    if (e.status) throwErrorWithStatus(e.status, e.message);
    throw e;
  }
};

export const updateHouse = async (id, houseDetails) => {
  if (!id) throw "You must provide an id to search for";

  if (!houseDetails) throw "You must provide house details";
  if (typeof houseDetails !== "object") throw "House details must be an object";

  try {
    // houseDetails.updatedAt = new Date();

    houseDetails = validateHouseDetailsOnUpdate(houseDetails);
    houseDetails.isApproved = false;
    houseDetails.isDeleted = false;
    const houseCollection = await houses();

    const updatedHouse = await houseCollection.updateOne(
      { _id: getMongoID(id) },
      { $set: houseDetails }
    );

    if (updatedHouse.modifiedCount === 0)
      throwErrorWithStatus(500, "Could not update house");
  } catch (e) {
    if (e.status) throwErrorWithStatus(e.status, e.message);
    throw e;
  }

  return await getHouseById(id);
};

export const updatePhotos = async (id, photos) => {
  try {
    id = getMongoID(id);

    const houseCollection = await houses();

    const houseDetails = await houseCollection.findOne({ _id: id });
    if (houseDetails === null) throwErrorWithStatus(404, "House not found");

    if (!photos) throwErrorWithStatus(400, "You must provide a photo");

    if (!photos.main)
      throwErrorWithStatus(400, "You must provide a main photo");

    if (!photos.images) throwErrorWithStatus(400, "You must provide images");

    if (typeof photos.main !== "string")
      throwErrorWithStatus(400, "Main photo must be a string");
    if (!Array.isArray(photos.images))
      throwErrorWithStatus(400, "Images must be an array");

    if (photos.images.some((image) => isValidImageURL(image)))
      throwErrorWithStatus(
        400,
        "Images must be valid URLS with extensions of .jpg, .jpeg, .png"
      );

    const updatedHouse = await houseCollection.updateOne(
      { _id: id },
      { $set: { photos: photos } }
    );

    if (updatedHouse.modifiedCount === 0)
      throwErrorWithStatus(500, "Could not update house");

    return await getHouseById(id);
  } catch (e) {
    if (e.status) throwErrorWithStatus(e.status, e.message);
    throw e;
  }
};

export const deleteHouse = async (id) => {
  try {
    id = getMongoID(id);

    const houseCollection = await houses();

    const house = await houseCollection().findOne({ _id: id });

    if (house === null) throwErrorWithStatus(404, "House not found");

    const deletionInfo = await houseCollection.updateOne(
      { _id: id },
      { $set: { isDeleted: true } }
    );

    if (deletionInfo.modifiedCount === 0)
      throwErrorWithStatus(500, "Could not delete house");

    return { houseId: id, deleted: true };
  } catch (e) {
    if (e.status) throwErrorWithStatus(e.status, e.message);
    throw e;
  }
};

export const getHouseQuery = async ({
  state,
  lat,
  lng,
  radius,
  checkin,
  checkout,
}) => {
  const houseCollection = await houses();
  let housesData;
  if (state != "" && state != undefined) {
    housesData = await houseCollection
      .find({ "address.state": state })
      .toArray();
  } else {
    radius = radius * 1609.34; // convert miles to meters
    housesData = await houseCollection
      .find({
        "address.location": {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: radius,
          },
        },
      })
      .project({
        title: 1,
        address: 1,
        price: 1,
        photos: 1,
      })
      .toArray();
  }

  housesData = await filterHousesByAvailability(housesData, checkin, checkout);

  return housesData;
};

export const filterHousesByAvailability = async (
  housesData,
  checkin,
  checkout
) => {
  const availableHouses = [];
  for (const house of housesData) {
    if (await isHouseAvailable(house._id, checkin, checkout)) {
      availableHouses.push(house);
    }
  }
  // console.log(availableHouses);
  return availableHouses;
};

export const isHouseAvailable = async (houseId, checkIn, checkOut) => {
  const house = await getHouseById(houseId);
  if (!house || house.isDeleted || !house.isApproved) {
    return false;
  }

  const bookings = house.bookings;
  if (!bookings) {
    return true;
  }

  for (const booking of bookings) {
    if (
      (checkIn >= booking.checkIn && checkIn <= booking.checkOut) ||
      (checkOut >= booking.checkIn && checkOut <= booking.checkOut) ||
      (checkIn <= booking.checkIn && checkOut >= booking.checkOut)
    ) {
      return false;
    }
  }

  return true;
};

export const getUniqueStates = async () => {
  const houseCollection = await houses();
  const states = await houseCollection.distinct("address.state", {
    isApproved: true,
  });

  return states;
};

export const getallhousesbyhostid = async (hostId) => {
  const houseCollection = await houses();

  const housesArray = await houseCollection.find({ hostId: hostId }).toArray();

  return housesArray;
};
export const gethousesbyhostid = async (hostId) => {
  const houseCollection = await houses();

  const housesArray = await houseCollection
    .find({ hostId: hostId, isApproved: true, isDeleted: false })
    .toArray();

  return housesArray;
};

export const toggleHouseApproveStatus = async (id) => {
  id = getMongoID(id);

  const houseCollection = await houses();

  const houseDetails = await houseCollection.findOne({
    _id: id,
  });
  if (houseDetails === null) throwErrorWithStatus(404, "House not found");

  const updatedHouse = await houseCollection.updateOne(
    { _id: id },
    { $set: { isApproved: !houseDetails.isApproved } }
  );

  if (updatedHouse.modifiedCount === 0)
    throwErrorWithStatus(500, "Could not update house");

  return await getHouseById(id);
};

export const toggleHouseDeleteStatus = async (id) => {
  id = getMongoID(id);

  const houseCollection = await houses();

  const houseDetails = await houseCollection.findOne({
    _id: id,
  });
  if (houseDetails === null) throwErrorWithStatus(404, "House not found");

  const updatedHouse = await houseCollection.updateOne(
    { _id: id },
    { $set: { isDeleted: !houseDetails.isDeleted } }
  );

  if (updatedHouse.modifiedCount === 0)
    throwErrorWithStatus(500, "Could not update house");

  return await getHouseById(id);
};

export const toggleHouseActiveStatus = async (id) => {
  id = getMongoID(id);

  const houseCollection = await houses();

  const houseDetails = await houseCollection.findOne({
    _id: id,
  });
  if (houseDetails === null) throwErrorWithStatus(404, "House not found");

  const updatedHouse = await houseCollection.updateOne(
    { _id: id },
    { $set: { isActive: !houseDetails.isActive } }
  );

  if (updatedHouse.modifiedCount === 0)
    throwErrorWithStatus(500, "Could not update house");

  return await getHouseById(id);
};

export const approveHouse = async (houseId) => {
  const houseCollection = await houses();

  const house = await houseCollection.findOne({ _id: getMongoID(houseId) });

  if (!house) {
    throw "House not found";
  }

  await houseCollection.updateOne(
    { _id: getMongoID(houseId) },
    { $set: { isApproved: true } }
  );

  return true;
};

export const rejectHouse = async (houseId) => {
  const houseCollection = await houses();

  const house = await houseCollection.findOne({ _id: getMongoID(houseId) });

  if (!house) {
    throw "House not found";
  }

  await houseCollection.updateOne(
    { _id: getMongoID(houseId) },
    { $set: { isDeleted: true } }
  );

  return true;
};

export const getCurrentHosting = async (houseId) => {
  const houseCollection = await houses();
  const house = await houseCollection.findOne({
    _id: getMongoID(houseId),
    isApproved: true,
    isDeleted: false,
  });
  // .project({ title: 1, photos: 1, bookings: 1 });

  if (!house) {
    throw "House not found";
  }
  if (!house.bookings) {
    return house;
  }

  const currentDate = new Date();

  house.bookings = house.bookings.filter((booking) => {
    return (
      booking.checkIn <= currentDate &&
      currentDate <= booking.checkOut &&
      booking.status == "approved"
    );
  });

  // house.bookings.map(async (booking) => {
  //   let user = await getAuth().getUser(booking.uid);
  //   booking.name = user.name;
  //   booking.email = user.email;
  // });

  return house;
};

export const getUpcomingApprovedHosting = async (houseId) => {
  const houseCollection = await houses();
  const house = await houseCollection.findOne({
    _id: getMongoID(houseId),
    isApproved: true,
    isDeleted: false,
  });
  // .project({ title: 1, photos: 1, bookings: 1 });

  if (!house) {
    throw "House not found";
  }
  if (!house.bookings) {
    return house;
  }

  const currentDate = new Date();

  house.bookings = house.bookings.filter((booking) => {
    return booking.checkIn > currentDate && booking.status == "approved";
  });

  // house.bookings.map(async (booking) => {
  //   let user = await getAuth().getUser(booking.uid);
  //   booking.name = user.name;
  //   booking.email = user.email;
  // });

  return house;
};

export const getUpcomingPendingHosting = async (houseId) => {
  const houseCollection = await houses();
  const house = await houseCollection.findOne({
    _id: getMongoID(houseId),
    isApproved: true,
    isDeleted: false,
  });
  // .project({ title: 1, photos: 1, bookings: 1 });

  if (!house) {
    throw "House not found";
  }
  if (!house.bookings) {
    return house;
  }

  const currentDate = new Date();

  house.bookings = house.bookings.filter((booking) => {
    return booking.status == "pending";
  });

  // house.bookings.map(async (booking) => {
  //   let user = await getAuth().getUser(booking.uid);
  //   booking.name = user.name;
  //   booking.email = user.email;
  // });

  return house;
};
