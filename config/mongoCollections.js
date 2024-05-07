import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const houses = getCollectionFn("houses");
export const users = getCollectionFn("users");
export const admins = getCollectionFn("admins");
export const credits = getCollectionFn("credits");
