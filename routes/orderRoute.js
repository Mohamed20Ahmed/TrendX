const express = require("express");

const {
  getOrder_S,
  createCashOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const {
  updateOrderStatusValidator,
  validateCartId,
} = require("../validators/orderValidator");
const { protect, allowedTo } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route("/:cartId")
  .post(allowedTo("customer"), validateCartId, createCashOrder);

router.get("/", allowedTo("customer", "seller", "admin"), getOrder_S);
router.patch(
  "/status/:orderId",
  allowedTo("seller"),
  updateOrderStatusValidator,
  updateOrderStatus
);

module.exports = router;
