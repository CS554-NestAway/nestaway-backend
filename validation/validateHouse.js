import enums from "../config/enums.js";
import {
  houseSchema,
  addressSchema,
  amenitiesSchema,
  featuresSchema,
  settingsSchema,
  rulesSchema,
  photosSchema,
} from "../config/schemas/houseSchema.js";
import { ObjectId } from "mongodb";
import { throwErrorWithStatus } from "../helper.js";
export const validateHouseDetailsOnCreate = (houseDetails) => {
  try {
    if (!houseDetails.hostId)
      throwErrorWithStatus(400, "You must provide a hostId");

    checkifObjectFollowsSchema(houseDetails, houseSchema);
    checkifObjectFollowsSchema(houseDetails.address, addressSchema);

    if (enums.houseType.includes(houseDetails.houseType) === false) {
      throw "Invalid house type";
    }
    if (enums.currency.includes(houseDetails.currency) === false) {
      throw "Invalid currency";
    }
    for (const amenity in houseDetails.amenities) {
      if (enums.amenities.includes(amenity) === false) {
        throw "Invalid amenity";
      }
    }
    for (const feature in houseDetails.features) {
      if (enums.features.includes(feature) === false) {
        throw "Invalid feature";
      }
    }

    checkifObjectFollowsSchema(houseDetails.amenities, amenitiesSchema);
    checkifObjectFollowsSchema(houseDetails.features, featuresSchema);
    checkifObjectFollowsSchema(houseDetails.settings, settingsSchema);
    checkifObjectFollowsSchema(houseDetails.rules, rulesSchema);
    checkifObjectFollowsSchema(houseDetails.photos, photosSchema);
    const photos = houseDetails.photos;

    if (!photos) throwErrorWithStatus(400, "You must provide a photo");

    if (!photos.main)
      throwErrorWithStatus(400, "You must provide a main photo");

    if (!photos.images) throwErrorWithStatus(400, "You must provide images");

    if (typeof photos.main !== "string")
      throwErrorWithStatus(400, "Main photo must be a string");
    if (!Array.isArray(photos.images))
      throwErrorWithStatus(400, "Images must be an array");

    if (photos.images.some((image) => !isValidImageURL(image)))
      throwErrorWithStatus(
        400,
        "Images must be valid URLS with extensions of .jpg, .jpeg, .png"
      );

    if (typeof houseDetails.address.location !== "object")
      throwErrorWithStatus(400, "Location must be an object");

    if (typeof houseDetails.address.location.type !== "string")
      throwErrorWithStatus(400, "Location type must be a string");
    if (houseDetails.address.location.type !== "Point")
      throwErrorWithStatus(400, "Location type must be a Point");

    if (!Array.isArray(houseDetails.address.location.coordinates))
      throwErrorWithStatus(400, "Coordinates must be an array");

    if (houseDetails.address.location.coordinates.length !== 2)
      throwErrorWithStatus(400, "Coordinates must have exactly two values");

    if (typeof houseDetails.address.location.coordinates[0] !== "number")
      throwErrorWithStatus(400, "Coordinates must be numbers");
    if (typeof houseDetails.address.location.coordinates[1] !== "number")
      throwErrorWithStatus(400, "Coordinates must be numbers");

    const validHouse = {
      houseType: houseDetails.houseType,
      address: houseDetails.address,
      features: houseDetails.features,
      amenities: houseDetails.amenities,
      settings: houseDetails.settings,
      rules: houseDetails.rules,
      photos: houseDetails.photos,
      title: houseDetails.title,
      description: houseDetails.description,
      isInstantBooking: houseDetails.isInstantBooking,
      price: houseDetails.price,
      currency: houseDetails.currency,
      hostId: houseDetails.hostId,
      createdAt: new Date(),

      isApproved: false,

      isDeleted: false,

      updatedAt: new Date(),
    };

    return validHouse;
  } catch (e) {
    throwErrorWithStatus(400, e);
  }
};

const checkifObjectFollowsSchema = (object, schema) => {
  for (const field in schema) {
    const fieldSchema = schema[field];
    const fieldValue = object[field];

    if (
      fieldSchema.required &&
      (fieldValue === undefined || fieldValue === null)
    ) {
      throw `Missing required field: ${field}`;
    }

    if (fieldValue !== undefined && fieldValue !== null) {
      const fieldType = typeof fieldValue;

      if (fieldSchema.type == "Date") {
        if (isNaN(Date.parse(fieldValue))) {
          throw `Invalid type for field ${field}. Expected ${fieldSchema.type}, but got ${fieldType}`;
        }
      } else if (fieldType !== fieldSchema.type) {
        throw `Invalid type for field ${field}. Expected ${fieldSchema.type}, but got ${fieldType}`;
      }

      if (fieldType === "string") {
        object[field] = fieldValue.trim();
        if (
          fieldSchema.minLength !== undefined &&
          fieldValue.length < fieldSchema.minLength
        ) {
          throw `Invalid length for field ${field}. Expected a minimum length of ${fieldSchema.minLength}`;
        }

        if (
          fieldSchema.maxLength !== undefined &&
          fieldValue.length > fieldSchema.maxLength
        ) {
          throw `Invalid length for field ${field}. Expected a maximum length of ${fieldSchema.maxLength}`;
        }
      }

      if (fieldType === "number") {
        if (fieldSchema.min !== undefined && fieldValue < fieldSchema.min) {
          throw `Invalid value for field ${field}. Expected a value greater than or equal to ${fieldSchema.min}`;
        }
        if (fieldSchema.max !== undefined && fieldValue > fieldSchema.max) {
          throw `Invalid value for field ${field}. Expected a value less than or equal to ${fieldSchema.max}`;
        }
      }
    }
  }
};

export const isValidImageURL = (ImageUrl) => {
  const url = new URL(ImageUrl);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return false;
  }
  if (url.host === "") {
    return false;
  }
  if (!/.(jpeg|jpg|png|webp)$/i.test(url.pathname)) {
    return false;
  }

  return true;
};

export const validateHouseDetailsOnUpdate = (houseDetails) => {
  try {
    houseDetails.isApproved = false;
    houseDetails.updatedAt = new Date();
    houseDetails.isDeleted = false;
    checkifObjectFollowsSchema(houseDetails, houseSchema);
    checkifObjectFollowsSchema(houseDetails.address, addressSchema);

    if (enums.houseType.includes(houseDetails.houseType) === false) {
      throw "Invalid house type";
    }
    if (enums.currency.includes(houseDetails.currency) === false) {
      throw "Invalid currency";
    }
    for (const amenity in houseDetails.amenities) {
      if (enums.amenities.includes(amenity) === false) {
        throw "Invalid amenity";
      }
    }
    for (const feature in houseDetails.features) {
      if (enums.features.includes(feature) === false) {
        throw "Invalid feature";
      }
    }

    checkifObjectFollowsSchema(houseDetails.amenities, amenitiesSchema);
    checkifObjectFollowsSchema(houseDetails.features, featuresSchema);
    checkifObjectFollowsSchema(houseDetails.settings, settingsSchema);
    checkifObjectFollowsSchema(houseDetails.rules, rulesSchema);
    checkifObjectFollowsSchema(houseDetails.photos, photosSchema);
    const photos = houseDetails.photos;

    if (!photos) throwErrorWithStatus(400, "You must provide a photo");

    if (!photos.main)
      throwErrorWithStatus(400, "You must provide a main photo");

    if (!photos.images) throwErrorWithStatus(400, "You must provide images");

    if (typeof photos.main !== "string")
      throwErrorWithStatus(400, "Main photo must be a string");
    if (!Array.isArray(photos.images))
      throwErrorWithStatus(400, "Images must be an array");

    if (photos.images.some((image) => !isValidImageURL(image)))
      throwErrorWithStatus(
        400,
        "Images must be valid URLS with extensions of .jpg, .jpeg, .png"
      );

    if (typeof houseDetails.address.location !== "object")
      throwErrorWithStatus(400, "Location must be an object");

    if (typeof houseDetails.address.location.type !== "string")
      throwErrorWithStatus(400, "Location type must be a string");
    if (houseDetails.address.location.type !== "Point")
      throwErrorWithStatus(400, "Location type must be a Point");

    if (!Array.isArray(houseDetails.address.location.coordinates))
      throwErrorWithStatus(400, "Coordinates must be an array");

    if (houseDetails.address.location.coordinates.length !== 2)
      throwErrorWithStatus(400, "Coordinates must have exactly two values");

    if (typeof houseDetails.address.location.coordinates[0] !== "number")
      throwErrorWithStatus(400, "Coordinates must be numbers");
    if (typeof houseDetails.address.location.coordinates[1] !== "number")
      throwErrorWithStatus(400, "Coordinates must be numbers");

    const validHouse = {
      houseType: houseDetails.houseType,
      address: houseDetails.address,
      features: houseDetails.features,
      amenities: houseDetails.amenities,
      settings: houseDetails.settings,
      rules: houseDetails.rules,
      photos: houseDetails.photos,
      title: houseDetails.title,
      description: houseDetails.description,
      isInstantBooking: houseDetails.isInstantBooking,
      price: houseDetails.price,
      updatedAt: new Date(),
      isApproved: false,
      currency: houseDetails.currency,
    };

    return validHouse;
  } catch (e) {
    throwErrorWithStatus(400, e);
  }
};
