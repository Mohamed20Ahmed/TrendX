const router = require("express").Router({ mergeParams: true });
const {
    addToCartValidator,
    deleteFromCartValidator,
} = require("../validators/cartValidator");

const { protect, allowedTo } = require("../middlewares/authMiddleware");

const {
    addProductToCart,
    getLoggedCustomerCart,
    clearCart,
    removeSpecificCartItem,
    updateCartItemQuantity
} = require("../controllers/cartController");

// Use the middleware function in a route

router.use(protect);

router
  .route("/")
  .get(allowedTo("customer"), getLoggedCustomerCart)
  .post(allowedTo("customer"), addToCartValidator, addProductToCart)
  .delete(allowedTo("customer"),clearCart)

router.delete("/:productId",allowedTo("customer"),deleteFromCartValidator, removeSpecificCartItem)


module.exports = router;
