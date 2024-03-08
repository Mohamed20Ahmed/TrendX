
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
wishlist: [{ product:
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
   } ],
  customer: {
    type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
  }
  
})

wishlistSchema.pre(/^find/, function (next) {
this.populate({
    path: 'wishlist.product',
    select: 'title description price imageCover'}
    );next() })

wishlistSchema.virtual("wishlists", {
    ref: "Wishlist",
    foreignField: "wishlist",
    localField: "_id",
  });
  
  const wishlistModel = mongoose.model("Wishlist", wishlistSchema);
  module.exports = wishlistModel;