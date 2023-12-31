const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  userType: {
    type: String,
    required: true,
    max: 10,
  },
  serviceType: {
    type: String,
    max: 10,
  },
});

module.exports = mongoose.model("Users", userSchema);
