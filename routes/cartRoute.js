const router = require("express").Router({ mergeParams: true });
const {
    addToCartValidator,
    deleteFromCartValidator,
    updateCartValidator
} = require("../validators/cartValidator");

const { protect, allowedTo } = require("../middlewares/authMiddleware");

const {
    addProductToCart,
    getCustomerCart_S,
    clearCart,
    removeSpecificCartItem,
    updateCartItemQuantity
} = require("../controllers/cartController");

// Use the middleware function in a route

router.use(protect);

router
  .route("/")
  .get(allowedTo("customer"), getCustomerCart_S)
  .post(allowedTo("customer"), addToCartValidator, addProductToCart)
  .patch(allowedTo("customer"),updateCartValidator,updateCartItemQuantity)

router.delete("/:cartId", allowedTo("customer"),clearCart)

router.delete("/item",allowedTo("customer"),deleteFromCartValidator, removeSpecificCartItem)


module.exports = router;
