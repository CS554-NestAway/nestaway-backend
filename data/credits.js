import { credits } from "../config/mongoCollections.js";

export const addCredits = async (uid, creditsToAdd) => {
  if (!uid) {
    throw "uid is required";
  }

  if (!creditsToAdd) {
    throw "creditsToAdd is required";
  }

  if (typeof creditsToAdd !== "number") {
    throw "creditsToAdd should be a number";
  }

  const creditCollection = await credits();

  const credit = await creditCollection.findOne({ uid: uid });

  if (!credit) {
    await creditCollection.insertOne({ uid: uid, credits: creditsToAdd });
  } else {
    await creditCollection.updateOne(
      { uid: uid },
      { $inc: { credits: creditsToAdd } }
    );
  }

  return true;
};

export const deductCredits = async (uid, creditsToDeduct) => {
  if (!uid) {
    throw "uid is required";
  }

  if (!creditsToDeduct) {
    throw "creditsToDeduct is required";
  }

  if (typeof creditsToDeduct !== "number") {
    throw "creditsToDeduct should be a number";
  }

  const creditCollection = await credits();

  const credit = await creditCollection.findOne({ uid: uid });

  if (!credit) {
    throw "User not found";
  }

  if (credit.credits < creditsToDeduct) {
    throw "Insufficient credits";
  }

  await creditCollection.updateOne(
    { uid: uid },
    { $inc: { credits: -creditsToDeduct } }
  );

  return true;
};

export const getCredits = async (uid) => {
  if (!uid) {
    throw "uid is required";
  }

  const creditCollection = await credits();

  const credit = await creditCollection.findOne({ uid: uid });

  if (!credit) {
    return 0;
  }
  return credit.credits;
};

export const checkIfUserHasEnoughCredits = async (uid, creditsToCheck) => {
  if (!uid) {
    throw "uid is required";
  }

  if (!creditsToCheck) {
    throw "creditsToCheck is required";
  }

  if (typeof creditsToCheck !== "number") {
    throw "creditsToCheck should be a number";
  }

  const creditCollection = await credits();

  const credit = await creditCollection.findOne({ uid: uid });

  if (!credit) {
    return false;
  }

  if (credit.credits < creditsToCheck) {
    return false;
  }

  return true;
};
