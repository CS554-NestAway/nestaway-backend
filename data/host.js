import { houses } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getMongoID } from "../helper.js";
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
