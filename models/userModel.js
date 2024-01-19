const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    //   firstName: {
    //     type: String,
    //     trim: true,
    //     required: [true, "name required"],
    //   },
    //   lastName: {
    //     type: String,
    //     trim: true,
    //     required: [true, "name required"],
    //   },

    //   email: {
    //     type: String,
    //     required: [true, "email required"],
    //     unique: true,
    //     lowercase: true,
    //   },
    //   phone: {
    //     type: String,
    //     required: [true, "phone required"],
    //     unique: true,
    //   },

    //   password: {
    //     type: String,
    //     required: [true, "password required"],
    //     minlength: [6, "Too short password"],
    //   },
    //   passwordChangedAt: Date,
    //   passwordResetCode: String,
    //   passwordResetExpires: Date,
    //   passwordResetVerified: Boolean,

    //   role: {
    //     type: String,
    //     enum: ["customer", "seller", "admin"],
    //     default: "customer",
    //   },

    //   active: {
    //     type: Number,
    //     default: true,
    //   },
    //   // child reference (one to many)
    //   wishlist: [
    //     {
    //       type: mongoose.Schema.ObjectId,
    //       ref: "Product",
    //     },
    //   ],
    //   addresses: [
    //     {
    //       id: { type: mongoose.Schema.Types.ObjectId },
    //       alias: String,
    //       details: String,
    //       phone: String,
    //       city: String,
    //     },
    //   ],
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   // Hashing user password
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
