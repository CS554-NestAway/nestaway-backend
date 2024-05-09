import hostRoutes from "./host.js";
import searchRoutes from "./search.js";
import creditRoutes from "./credits.js";
import bookingRoutes from "./booking.js";
import houseRoutes from "./house.js";
import emailRoutes from "./email.js";
import tripRoutes from "./trip.js";

let constructorMethod;
try {
  constructorMethod = (app) => {
    app.use("/sendemail", emailRoutes);
    app.use("/host", hostRoutes);
    app.use("/search", searchRoutes);
    app.use("/house", houseRoutes);
    app.use("/credits", creditRoutes);
    app.use("/booking", bookingRoutes);
    app.use("/trip", tripRoutes);
    app.use("*", (req, res) => {
      return res.status(404).json({ error: "Not found" });
    });
  };
} catch (e) {
  app.use(res.status(400).json({ error: e.message }));
}
export default constructorMethod;
