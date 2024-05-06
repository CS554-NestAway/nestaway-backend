import { houses } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getMongoID } from "../helper.js";
import { validateHouseDetailsOnCreate } from "../validation/validateHouse.js";
import { throwErrorWithStatus } from "../helper.js";
export const getAllHouses = async (projections) => {
  const houseCollection = await houses();

  return await houseCollection
    .find({})
    .project(
      projections || {
        name: 1,
        houseType: 1,
        address: 1,
        photos: 1,
        price: 1,
        currency: 1,
        rating: 1,
      }
    )
    .toArray();
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
    houseDetails.isApproved = false;
    houseDetails = new ObjectId("sdadssa");

    houseDetails = validateHouseDetailsOnCreate(houseDetails);

    const houseCollection = await houses();

    const insertInfo = await houseCollection.insertOne(houseDetails);
    if (insertInfo.insertedCount === 0)
      throwErrorWithStatus(500, "Could not add house");
  } catch (e) {
    if (e.status) throwErrorWithStatus(e.status, e.message);
    throw e;
  }

  return await this.getHouseById(insertInfo.insertedId);
};

export const updateHouse = async (id, houseDetails) => {
  if (!id) throw "You must provide an id to search for";
  if (ObjectId.isValid(id) === false) throw "Invalid ID provided";
  if (!houseDetails) throw "You must provide house details";
  if (typeof houseDetails !== "object") throw "House details must be an object";

  try {
    validateHouseDetailsOnCreate(houseDetails);

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

  return await this.getHouseById(id);
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
  if (state) {
    housesData = await houseCollection
      .find({ "address.state": state })
      .toArray();
  } else {
    radius = radius * 1609.34; // convert miles to meters
    housesData = await houseCollection
      .find({
        "address.location": {
          $near: {
            $geometry: { type: "Point", coordinates: [lat, lng] },
            $maxDistance: radius,
          },
        },
      })
      .toArray();
  }

  housesData = await filterHousesByAvailability(housesData, checkin, checkout);

  return houses;
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
  console.log(availableHouses);
  return availableHouses;
};

export const isHouseAvailable = async (houseId, startDate, endDate) => {
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
      (startDate >= booking.startDate && startDate <= booking.endDate) ||
      (endDate >= booking.startDate && endDate <= booking.endDate) ||
      (startDate <= booking.startDate && endDate >= booking.endDate)
    ) {
      return false;
    }
  }

  return true;
};
