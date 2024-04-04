const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    sold: {
      type: Number,
      default: 0,
    },

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],

    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "seller", select: "shopName active" }).populate({
    path: "category",
    select: "name",
  });

  next();
});

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
