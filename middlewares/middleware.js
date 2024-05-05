import * as hostDataFunctions from "../data/host.js";

export const checkIfHouseBelongsToHost = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "You must provide an id" });
  }

  //   if (isAdmin(req.user.role)) {
  if (isAdmin("a")) {
    next();
  }

  try {
    const house = await hostDataFunctions.getHouseById(req.params.id);
    if (house.hostId !== req.user._id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action" });
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  next();
};

export const isAdmin = (role) => {
  //   return role === "admin";
  return false;
};
