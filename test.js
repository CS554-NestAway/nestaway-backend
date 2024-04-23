import { validateHouseDetailsOnCreate } from "./validation/validateHouse.js";

const houseObject = {
  house: {
    houseType: "Home",
    Address: {
      country: "United States",
      country_code: "us",
      state: "New Jersey",
      county: "Hudson County",
      city: "Jersey City",
      postcode: "07307",
      street: "Ogden Avenue",
      housenumber: "382",
      lon: -74.04142075510204,
      lat: 40.74674712244898,
      state_code: "NJ",
      result_type: "building",
      formatted:
        "382 Ogden Avenue, Jersey City, NJ 07307, United States of America",
      address_line1: "382 Ogden Avenue",
      address_line2: "Jersey City, NJ 07307, United States of America",
    },
    features: {
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
    },
    amenities: {
      wifi: true,
      tv: true,
      ac: true,
      kitchen: true,
      parking: true,
      pool: false,
      gym: false,
      hotTub: false,
      fireplace: false,
      washer: true,
      dryer: true,
      heating: true,
      smokeDetector: true,
      carbonMonoxideDetector: true,
      firstAidKit: true,
      fireExtinguisher: true,
    },
    settings: {
      cancellationDays: 7,
      cancellationPercent: 50,
      changeDays: 7,
    },
    rules: {
      checkIn: 15,
      checkOut: 11,
      smoking: false,
      pets: false,
    },
    photos: {
      main: "https://images.unsplash.com/photo-1562886974-6d4f3e3b1d0b",
      images: [
        "https://images.unsplash.com/photo-1562886974-6d4f3e3b1d0b",
        "https://images.unsplash.com/photo-1562886974-6d4f3e3b1d0b",
        "https://images.unsplash.com/photo-1562886974-6d4f3e3b1d0b",
        "https://images.unsplash.com/photo-1562886974-6d4f3e3b1d0b",
        "https://images.unsplash.com/photo-1562886974-6d4f3e3b1d0b",
      ],
    },
    title: "Beautiful 2 Bedroom Apartment in Jersey City",
    description:
      "This beautiful 2 bedroom apartment is located in the heart of Jersey City. It is a 10 minute walk to the PATH train which takes you to Manhattan in 15 minutes. The apartment is fully furnished and has all the amenities you need for a comfortable stay.",
    isInstantBooking: true,
    price: 150,
    currency: "USD",
    createdAt: new Date(),
    isApproved: true,
    isDeleted: false,
    updatedAt: new Date(),
    hostId: "60f9b2f8b3b2a4e1f8f3e1c7",
  },
};

validateHouseDetailsOnCreate(houseObject);
