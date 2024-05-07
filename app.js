// This file should set up the express server as shown in the lecture code
// This file should set up the express server as shown in the lecture code
import express from "express";
import "dotenv/config";
import configRoutesFunction from "./routes/index.js";
import { dbConnection } from "./config/mongoConnection.js";
import cors from "cors";
import session from "express-session";

const databaseconnection = dbConnection();

const app = express();

app.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // use `secure: true` only if you're on HTTPS
  })
);

configRoutesFunction(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("We've now got a server!");
  console.log(
    `Your routes will be running on http://localhost:${
      process.env.PORT || 3000
    }`
  );
});
