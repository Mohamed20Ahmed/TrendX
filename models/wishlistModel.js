
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
wishlist: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
  customer: {
    type: mongoose.Schema.ObjectId,
      ref: 'User'
  }
})

wishlistSchema.virtual("wishlists", {
    ref: "Wishlist",
    foreignField: "wishlist",
    localField: "_id",
  });
  
  const wishlistModel = mongoose.model("Wishlist", wishlistSchema);
  module.exports = wishlistModel;