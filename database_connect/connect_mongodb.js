const mongoose = require("mongoose");

const connectWithDB = () => {
  try {
    const connect = mongoose.connect("mongodb://localhost:27017/agentDB");
    console.log("database connected");
  } catch (error) {
    console.log("server error");
  }
};
module.exports = { connectWithDB };
