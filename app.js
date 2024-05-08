import express from "express";
import "dotenv/config";
import configRoutesFunction from "./routes/index.js";
import { dbConnection } from "./config/mongoConnection.js";
import session from "express-session";
import cors from "cors";
import firebaseConfig from "./config/fbconfig.js";
import { initializeApp } from "firebase/app";

const databaseconnection = dbConnection();
const app = express();
const fbapp = initializeApp(firebaseConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

configRoutesFunction(app);

app.listen(process.env.PORT || 8080, () => {
  console.log("We've now got a server!");
  console.log(
    `Your routes will be running on http://localhost:${
      process.env.PORT || 8080
    }`
  );
});
