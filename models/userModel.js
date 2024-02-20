const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },

    slug: {
      type: String,
      lowercase: true,
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

    address: String,

    shopName: {
      type: String,
      trim: true,
    },
    shopImage: String,
  },
  { timestamps: true }
);

const setShopImageUrl = (doc) => {
  if (doc.shopImage) {
    const shopImageUrL = `${process.env.BASE_URL}/shops/${doc.shopImage}`;
    doc.shopImage = shopImageUrL;
  }
};

userSchema.post("init", (doc) => {
  setShopImageUrl(doc);
});

userSchema.post("save", (doc) => {
  setShopImageUrl(doc);
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
