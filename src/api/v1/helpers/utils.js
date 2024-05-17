const { emailRule } = require("./validation.helper");

const getEmailOrUsername = (value) => {
    return !!emailRule(value) ? { email: value } : { username: value };
};

module.exports = {
    getEmailOrUsername,
};
