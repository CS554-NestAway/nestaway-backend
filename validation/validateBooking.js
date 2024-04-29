export const validateCheckInAndCheckOutTime = (checkIn, checkOut) => {
    if (new Date(checkIn) < new Date()) {
        throw "Check in date must be greater than today";
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
        throw "Check out date must be greater than check in date";
    }
}

export const isDateValid = (date) => {
    let dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(date)) {
        throw `${date} is not in the valid YYYY-MM-DD format!`;
    }

    let [year, month, day] = date.split("-").map(Number);
    let isLeapYear = (year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0));

    if (month === 2) {
        if (day > 29 || (day === 29 && !isLeapYear)) {
            throw `There is no ${day} days in February ${year}!`;
        }
    } else {
        let monthHas30Days = [4, 6, 9, 11];
        if (monthHas30Days.includes(month)) {
            if (day === 31) {
                throw `Month ${month} doesn't have 31 days!`;
            }
        }
    }
};

