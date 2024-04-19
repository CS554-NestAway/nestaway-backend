// This file should set up the express server as shown in the lecture code
// This file should set up the express server as shown in the lecture code
import express from "express";
import "dotenv/config";
import configRoutesFunction from "./routes/index.js";
import { dbConnection } from "./config/mongoConnection.js";
import session from "express-session";

const databaseconnection = dbConnection();

const app = express();

app.use(express.json());

configRoutesFunction(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("We've now got a server!");
  console.log(
    `Your routes will be running on http://localhost:${
      process.env.PORT || 3000
    }`
  );
});
