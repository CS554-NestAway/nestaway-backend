import express from "express";
import "dotenv/config";
import configRoutesFunction from "./routes/index.js";
import { dbConnection } from "./config/mongoConnection.js";

import cors from "cors";
import firebaseConfig from "./config/fbconfig.js";
import { validateUserToken } from "./middlewares/middleware.js";
import { initializeApp } from "firebase-admin/app";
const firebaseApp = initializeApp(firebaseConfig);
// import fbconfig from "./FirebaseConfig.js";
const databaseconnection = dbConnection();
const app = express();

app.use((req, res, next) => {
  const currentDatetime = new Date();
  const formattedDate = `${currentDatetime.getFullYear()}-${
    currentDatetime.getMonth() + 1
  }-${currentDatetime.getDate()} ${currentDatetime.getHours()}:${currentDatetime.getMinutes()}:${currentDatetime.getSeconds()}`;
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  console.log(`[${formattedDate}] ${method}:${url} ${status}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://18.188.142.70:168",
      "http://18.188.142.70",
      process.env.VITE_BASE_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "requestcount", "Authorization"],
  })
);
app.use(validateUserToken);

configRoutesFunction(app);

app.listen(process.env.PORT || 8080, () => {
  console.log("We've now got a server!");
  console.log(
    `Your routes will be running on http://localhost:${
      process.env.PORT || 8080
    }`
  );
});
