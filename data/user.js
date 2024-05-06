import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import {
  getAuth
} from 'firebase/auth';

const createUser = async(
    id,name, email
  ) => {
    const userCollection = await users();
    const emailExits = await userCollection.findOne({email});
    if (emailExits) {
        throw "Error: email already used";
    }
    const newUser = {
        name: name,
        email: email,
        uid: id
      };
    
      const insertInfo = await userCollection.insertOne(newUser);
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw new Error("User Not Found");
    
      let userId = insertInfo.insertedId;
      let res = {};
      res = await userCollection.findOne({ _id: userId });
      res._id = res._id.toString();
      return res;
  };

  export default {createUser}
  