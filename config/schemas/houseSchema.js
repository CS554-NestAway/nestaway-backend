export const houseSchema = {
  houseType: { type: "string", required: true },
  address: { type: "object", required: true },
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
  price: { type: "number", required: true, min: 0 },
  currency: { type: "string", required: true },
  createdAt: { type: "Date", required: false },
  isApproved: { type: "boolean", required: true },
  isDeleted: { type: "boolean", required: true },
  updatedAt: { type: "Date", required: false },
};

export const addressSchema = {
  country: { type: "string", required: true },
  country_code: { type: "string", required: true },
  state: { type: "string", required: true },
  county: { type: "string", required: true },
  city: { type: "string", required: true },
  postcode: { type: "string", required: true },
  street: { type: "string", required: true },
  housenumber: { type: "string", required: true },
  location: { type: "object", required: true },
  state_code: { type: "string", required: true },
  result_type: { type: "string", required: true },
  formatted: { type: "string", required: true },
  address_line1: { type: "string", required: true },
  address_line2: { type: "string", required: false },
};
export const amenitiesSchema = {
  wifi: { type: "boolean", required: true },
  tv: { type: "boolean", required: true },
  ac: { type: "boolean", required: true },

  kitchen: { type: "boolean", required: true },
  parking: { type: "boolean", required: true },
  pool: { type: "boolean", required: true },
  gym: { type: "boolean", required: true },
  hotTub: { type: "boolean", required: true },
  fireplace: { type: "boolean", required: true },
  washer: { type: "boolean", required: true },
  dryer: { type: "boolean", required: true },
  heating: { type: "boolean", required: true },
  smokeDetector: { type: "boolean", required: true },
  carbonMonoxideDetector: { type: "boolean", required: true },
  firstAidKit: { type: "boolean", required: true },
  fireExtinguisher: { type: "boolean", required: true },
};
export const featuresSchema = {
  maxGuests: { type: "number", required: true, min: 1 },
  bedrooms: { type: "number", required: true, min: 1 },
  beds: { type: "number", required: true, min: 1 },
  bathrooms: { type: "number", required: true, min: 1 },
};

export const settingsSchema = {
  cancellationDays: { type: "number", required: true, min: 1 },
  cancellationPercent: { type: "number", required: true, min: 1, max: 100 },
  changeDays: { type: "number", required: true, min: 1 },
};

export const rulesSchema = {
  checkIn: { type: "number", required: true, min: 0, max: 23 },
  checkOut: { type: "number", required: true, min: 0, max: 23 },
  smoking: { type: "boolean", required: true },
  pets: { type: "boolean", required: true },
};
export const photosSchema = {
  main: { type: "string", required: true },
  images: { type: "object", required: true },
};
