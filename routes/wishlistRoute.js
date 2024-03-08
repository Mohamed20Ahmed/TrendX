const router = require("express").Router({ mergeParams: true });
const {
  addToWishlistValidator,
  deleteFromWishListValidator,
} = require("../validators/wishlistValidator");

const { protect, allowedTo } = require("../middlewares/authMiddleware");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlistController");

// Use the middleware function in a route

router.use(protect);

router
  .route("/")
  .get(allowedTo("customer"), getLoggedUserWishlist)
  .post(allowedTo("customer"), addToWishlistValidator, addProductToWishlist);

router.delete(
  "/:productId",
  allowedTo("customer"),
  deleteFromWishListValidator,
  removeProductFromWishlist
);

module.exports = router;
