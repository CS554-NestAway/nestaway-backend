// This file will import both route files and export the constructor method as shown in the lecture code

/*
    - When the route is /events use the routes defined in the events.js routing file
    - When the route is /attendees use the routes defined in attendee.js routing file
    - All other enpoints should respond with a 404 as shown in the lecture code
*/

import hostRoutes from "./host.js";
import searchRoutes from "./search.js";
import creditRoutes from "./credits.js";
import houseRoutes from "./house.js";
import guestRoutes from "./guest.js";

let constructorMethod;
try {
  constructorMethod = (app) => {
    app.use("/host", hostRoutes);
    app.use("/search", searchRoutes);
    app.use("/house", houseRoutes);
    app.use("/credits", creditRoutes);
  app.use("/guest", guestRoutes);
    app.use("*", (req, res) => {
      return res.status(404).json({ error: "Not found" });
    });
  };
} catch (e) {
  app.use(res.status(400).json({ error: e.message }));
}
export default constructorMethod;
