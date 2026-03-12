const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    isActive: { type: Boolean, default: true },
    address: {
      street: { type: String },
      city: { type: String },
      zip: { type: String },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
