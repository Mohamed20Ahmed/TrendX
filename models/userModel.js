const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
      minLength: [2, "name too short"],
      maxLength: [40, "name too long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phoneNumber: String,
    password: {
      type: String,
      required: [true, "password required"],
      minLength: [8, "password must be at least 8 characters"],
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      required: true,
    },
    shopImage: String,
    // profile: {
    //   // Common profile information for all user types
    //   firstName: String,
    //   lastName: String,
    //   address: String,
    //   phoneNumber: String,
    //   dateOfBirth: Date,
    //   // Additional fields based on user type can be added below
    //   // ...

    //   // Fields specific to the 'customer' role
    //   customerDetails: {
    //     orders: [
    //       {
    //         orderId: mongoose.Schema.Types.ObjectId,
    //         orderDate: Date,
    //         products: [
    //           {
    //             productId: mongoose.Schema.Types.ObjectId,
    //             productName: String,
    //             quantity: Number,
    //             price: Number,
    //           },
    //         ],
    //         totalAmount: Number,
    //         // Additional order details can be added here
    //         // ...
    //       },
    //     ],
    //     // Additional fields specific to customers
    //     wishList: [
    //       {
    //         productId: mongoose.Schema.Types.ObjectId,
    //         productName: String,
    //         // Additional wishlist details can be added here
    //         // ...
    //       },
    //     ],
    //   },

    //   // Fields specific to the 'seller' role
    //   sellerDetails: {
    //     products: [
    //       {
    //         productId: mongoose.Schema.Types.ObjectId,
    //         productName: String,
    //         description: String,
    //         price: Number,
    //         stockQuantity: Number,
    //         // Additional product details can be added here
    //         // ...
    //       },
    //     ],
    //     // Additional fields specific to sellers
    //     // ...
    //   },

    //   // Fields specific to the 'admin' role
    //   adminDetails: {
    //     permissions: {
    //       type: [String],
    //       default: [],
    //     },
    //     // Additional fields specific to admins
    //     // ...
    //   },
    // },
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
