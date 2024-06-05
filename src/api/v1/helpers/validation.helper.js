const moment = require("moment");

const isSame = (
    firstValue,
    secondValue,
    errorMessage = `First Value must be same as Second Value`
) => {
    if (firstValue != secondValue) {
        throw new Error(errorMessage);
    }
    return true;
};

const isDifferent = (
    firstValue,
    secondValue,
    errorMessage = `First Value must be different from Second Value`
) => {
    if (firstValue == secondValue) {
        throw new Error(errorMessage);
    }
    return true;
};

const isPastDeadline = (
    targetTime,
    errorMessage = "The deadline has passed."
) => {
    if (moment().isAfter(moment(targetTime))) {
        throw new Error(errorMessage);
    }
    return true;
};

const emailRule = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email || !regex.test(email)) {
        throw new Error(`Email is invalid`);
    }
    return true;
};

/**
 * Check in DB that the field must not duplicate
 *
 * @param {*} fieldName
 * @param {*} model
 * @param {*} value
 * @returns
 */
const duplicateRule = async (fieldName, model, value) => {
    const query = {};
    query[fieldName] = value;
    if (await model.findOne(query).exec()) {
        throw new Error(`${fieldName} already exists`);
    }
    return true;
};

/**
 * At least one lowercase alphabet i.e. [a-z]
 * At least one uppercase alphabet i.e. [A-Z]
 * At least one Numeric digit i.e. [0-9]
 * At least one special character i.e. [‘@’, ‘$’, ‘.’, ‘#’, ‘!’, ‘%’, ‘*’, ‘?’, ‘&’, ‘^’]
 * Also, the total length must be in the range [8-15]
 */
const passwordRule = (password) => {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    if (!password || !regex.test(password)) {
        throw new Error("Password is invalid.");
    }
    return true;
};

/**
 * Username consists of alphanumeric characters (a-zA-Z0-9), lowercase, or uppercase.
 * Username allowed of the dot (.), underscore (_), and hyphen (-).
 * The dot (.), underscore (_), or hyphen (-) must not be the first or last character.
 * The dot (.), underscore (_), or hyphen (-) does not appear consecutively, e.g., java..regex
 * The number of characters must be between 5 to 20.
 */
const usernameRule = (username) => {
    const regex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    if (!username || !regex.test(username)) {
        throw new Error(`Username is invalid.`);
    }
    return true;
};

const requiredRule = (value, fieldName) => {
    if (value === null || value === undefined || value.trim() === "") {
        throw new Error(`${fieldName} is required`);
    }
    return true;
};

const minLengthString = (value, minLength, fieldName) => {
    if (value.length <= minLength) {
        throw new Error(`${fieldName} must longer than or equal ${minLength}`);
    }
    return true;
};

const maxLengthString = (value, maxLength, fieldName) => {
    if (value.length >= maxLength) {
        throw new Error(`${fieldName} must shorter than or equal ${maxLength}`);
    }
    return true;
};

const minNumber = (value, min, fieldName) => {
    if (value >= min) {
        throw new Error(`${fieldName} must larger than or equal ${min}`);
    }
    return true;
};

const maxNumber = (value, max, fieldName) => {
    if (value <= max) {
        throw new Error(`${fieldName} must less than or equal ${max}`);
    }
    return true;
};

module.exports = {
    isSame,
    isPastDeadline,
    duplicateRule,
    emailRule,
    passwordRule,
    usernameRule,
    requiredRule,
    minLengthString,
    maxLengthString,
    minNumber,
    maxNumber,
    isDifferent,
};
