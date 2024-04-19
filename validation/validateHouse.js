import enums from "../config/enums.js";

export const validateHouseDetailsOnCreate = (houseDetails) => {
  const schema = {
    house: {
      houseType: { type: "string", required: true },
      Address: { type: "object", required: true },
      features: { type: "object", required: true },
      amenities: { type: "object", required: true },
      settings: { type: "object", required: true },
      rules: { type: "object", required: true },
      photos: { type: "object", required: true },
      title: { type: "string", required: true, minLength: 1, maxLength: 255 },
      description: {
        type: "string",
        required: true,
        minLength: 1,
        maxLength: 1000,
      },
      isInstantBooking: { type: "boolean", required: true },
      price: { type: "number", required: true, min: 0 },
      currency: { type: "string", required: true },
      hostId: { type: "string", required: true },
      createdAt: { type: "Date", required: true },
      isApproved: { type: "boolean", required: true },
      isDeleted: { type: "boolean", required: true },
      updatedAt: { type: "Date", required: true },
    },
  };

  for (const field in schema.house) {
    const fieldSchema = schema.house[field];
    const fieldValue = houseDetails.house && houseDetails.house[field];

    if (
      fieldSchema.required &&
      (fieldValue === undefined || fieldValue === null)
    ) {
      throw new Error(`Missing required field: ${field}`);
    }

    if (fieldValue !== undefined && fieldValue !== null) {
      const fieldType = typeof fieldValue;

      if (fieldType !== fieldSchema.type) {
        throw new Error(
          `Invalid type for field ${field}. Expected ${fieldSchema.type}, but got ${fieldType}`
        );
      }

      if (fieldType === "string") {
        houseDetails.house[field] = fieldValue.trim();
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

      if (
        fieldType === "number" &&
        fieldSchema.min !== undefined &&
        fieldValue < fieldSchema.min
      ) {
        throw new Error(
          `Invalid value for field ${field}. Expected a value greater than or equal to ${fieldSchema.min}`
        );
      }
    }
  }
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

  return true;
};
