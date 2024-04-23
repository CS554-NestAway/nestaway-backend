import enums from "../config/enums.js";
import {
  houseSchema,
  addressSchema,
  amenitiesSchema,
  featuresSchema,
  settingsSchema,
  rulesSchema,
} from "../config/schemas/houseSchema.js";

import { throwErrorWithStatus } from "../helper.js";
export const validateHouseDetailsOnCreate = (houseDetails) => {
  try {
    const photosSchema = {
      main: { type: "string", required: true },
      images: { type: "object", required: true },
    };

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

    if (photos.images.some((image) => isValidImageURL(image)))
      throwErrorWithStatus(
        400,
        "Images must be valid URLS with extensions of .jpg, .jpeg, .png"
      );

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
  if (!/.(jpeg|jpg|png)$/i.test(url.pathname)) {
    return false;
  }

  return true;
};
