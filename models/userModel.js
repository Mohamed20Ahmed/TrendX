const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 characters"],
    },

    phoneNumber: String,

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    address: {
      street: String,
      city: String,
    },

    shopName: {
      type: String,
      trim: true,
    },

    shopAddress: String,

    shopImage: String,
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
