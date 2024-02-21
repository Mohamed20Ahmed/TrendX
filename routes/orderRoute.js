const express = require("express");

const {
  getOrder_S,
  createCashOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { updateOrderStatusValidator } = require("../validators/orderValidator");
const { protect, allowedTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/:cartId").post(allowedTo("customer"), createCashOrder);
router.get("/", allowedTo("customer", "seller", "admin"), getOrder_S);
router.patch(
  "/status/:orderId",
  allowedTo("seller"),
  updateOrderStatusValidator,
  updateOrderStatus
);

module.exports = router;
