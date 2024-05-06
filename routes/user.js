import { Router } from "express";
import session from "express-session";
import { userData } from "../data/index.js";
import { ObjectId } from "mongodb";

const router = Router();

router.post("/newuser", async (req,res) => {
    const response = req.body
    // console.log(req.body)
    // console.log("Route Hitting");
    try {
      const result = await userData.createUser(response.id, response.name, response.email)
      if(!result){
        return res.status(500).json({error: "Unable to add user in MongoDB"})
      } 
      req.session.user = {
        id: result._id,
        name: result.name,
        email: result.email,
        uid: result.uid
    };
    // console.log("User data stored in session:", req.session.user)
      return res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({error: e})
    }
  });

  export default router;