const dayjs = require("dayjs");

export const emailModificationByAddingDate = (email) => {
    const registrationEmail = email.split('@');
    const formattedDateTime = dayjs().format('YYYYMMDDHHmmss');
    return registrationEmail[0] + formattedDateTime + '@' + registrationEmail[1];
};
