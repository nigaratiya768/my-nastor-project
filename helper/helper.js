//write a method to get jwt token

const jwt = require("jsonwebtoken");
require("dotenv").config();

const getJWTToken = (payload) => {
  let token = jwt.sign(payload, process.env.JWTSECRET);
  return token;
};

//compare password

module.exports = { getJWTToken };
