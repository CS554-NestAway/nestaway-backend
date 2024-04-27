export const validateCheckInAndCheckOutTime = (checkIn, checkOut) => {
    if (new Date(checkIn) < new Date()) {
        throw "Check in date must be greater than today";
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
        throw "Check out date must be greater than check in date";
    }
}