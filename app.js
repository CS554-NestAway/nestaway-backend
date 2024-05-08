import express from "express";
import "dotenv/config";
import configRoutesFunction from "./routes/index.js";
import { dbConnection } from "./config/mongoConnection.js";
import session from "express-session";
// import * as t from "./test.js";
import cors from "cors";
import firebaseConfig from "./config/fbconfig.js";
import { validateUserToken } from "./middlewares/middleware.js";
import { initializeApp } from "firebase-admin/app";
const firebaseApp = initializeApp(firebaseConfig);
// import fbconfig from "./FirebaseConfig.js";
const databaseconnection = dbConnection();
const app = express();

app.use(
  session({
    name: "AuthSession",
    secret: "This is a secret",
    saveUninitialized: false,
    resave: false,
    maxAge: 86400000,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.VITE_BASE_URL],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
