const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    email: { type: String, required: true },
    gender: { type: String, required: false },
    prabhag: { type: String, required: false },
    wardId: { type: String, required: false },
    type: { type: String, required: true },
    id: { type: String, required: true },
  },
  { collection: "registers" }
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;
