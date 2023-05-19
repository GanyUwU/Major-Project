var md5 = require("md5");

const encryptPassword = (password) => {
  return md5(password);
};

module.exports = encryptPassword;
