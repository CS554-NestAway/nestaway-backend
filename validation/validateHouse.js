import enums from "../config/enums.js";
import {
  houseSchema,
  addressSchema,
  amenitiesSchema,
  featuresSchema,
  settingsSchema,
  rulesSchema,
} from "../config/schemas/houseSchema.js";
export const validateHouseDetailsOnCreate = (houseDetails) => {
  const photosSchema = {
    main: { type: "string", required: true },
    images: { type: "object", required: true },
  };

  checkifObjectFollowsSchema(houseDetails.house, houseSchema);
  checkifObjectFollowsSchema(houseDetails.house.Address, addressSchema);

  if (enums.houseType.includes(houseDetails.house.houseType) === false) {
    throw new Error("Invalid house type");
  }
  if (enums.currency.includes(houseDetails.house.currency) === false) {
    throw new Error("Invalid currency");
  }
  for (const amenity in houseDetails.house.amenities) {
    if (enums.amenities.includes(amenity) === false) {
      throw new Error("Invalid amenity");
    }
  }
  for (const feature in houseDetails.house.features) {
    if (enums.features.includes(feature) === false) {
      throw new Error("Invalid feature");
    }
  }

  checkifObjectFollowsSchema(houseDetails.house.amenities, amenitiesSchema);
  checkifObjectFollowsSchema(houseDetails.house.features, featuresSchema);
  checkifObjectFollowsSchema(houseDetails.house.settings, settingsSchema);
  checkifObjectFollowsSchema(houseDetails.house.rules, rulesSchema);
  checkifObjectFollowsSchema(houseDetails.house.photos, photosSchema);

  return true;
};

const checkifObjectFollowsSchema = (object, schema) => {
  for (const field in schema) {
    const fieldSchema = schema[field];
    const fieldValue = object[field];

    if (
      fieldSchema.required &&
      (fieldValue === undefined || fieldValue === null)
    ) {
      throw new Error(`Missing required field: ${field}`);
    }

    if (fieldValue !== undefined && fieldValue !== null) {
      const fieldType = typeof fieldValue;

      if (fieldSchema.type == "Date") {
        if (isNaN(Date.parse(fieldValue))) {
          throw new Error(
            `Invalid type for field ${field}. Expected ${fieldSchema.type}, but got ${fieldType}`
          );
        }
      } else if (fieldType !== fieldSchema.type) {
        throw new Error(
          `Invalid type for field ${field}. Expected ${fieldSchema.type}, but got ${fieldType}`
        );
      }

      if (fieldType === "string") {
        object[field] = fieldValue.trim();
        if (
          fieldSchema.minLength !== undefined &&
          fieldValue.length < fieldSchema.minLength
        ) {
          throw new Error(
            `Invalid length for field ${field}. Expected a minimum length of ${fieldSchema.minLength}`
          );
        }

        if (
          fieldSchema.maxLength !== undefined &&
          fieldValue.length > fieldSchema.maxLength
        ) {
          throw new Error(
            `Invalid length for field ${field}. Expected a maximum length of ${fieldSchema.maxLength}`
          );
        }
      }

      if (fieldType === "number") {
        if (fieldSchema.min !== undefined && fieldValue < fieldSchema.min) {
          throw new Error(
            `Invalid value for field ${field}. Expected a value greater than or equal to ${fieldSchema.min}`
          );
        }
        if (fieldSchema.max !== undefined && fieldValue > fieldSchema.max) {
          throw new Error(
            `Invalid value for field ${field}. Expected a value less than or equal to ${fieldSchema.max}`
          );
        }
      }
    }
  }
};
