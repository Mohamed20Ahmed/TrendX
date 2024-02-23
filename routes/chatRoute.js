const express = require("express");
const {
  getAllSupportChats,
  getSupportMessages,
  sendSupportMessage,
  getMyShopChats,
  getShopMessages,
  sendShopMessage,
} = require("../controllers/chatController");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { sendMessageValidator } = require("../validators/chatValidator");
const router = express.Router({ mergeParams: true });
router.use(protect);

router.get("/support", allowedTo("admin"), getAllSupportChats);
router.get("/support/message", getSupportMessages);
router.post("/support/message", sendMessageValidator, sendSupportMessage);

router.get("/shop", allowedTo("seller"), getMyShopChats);
router.get("/shop/message", allowedTo("seller", "customer"), getShopMessages);
router.post(
  "/shop/message",
  allowedTo("seller", "customer"),
  sendMessageValidator,
  sendShopMessage
);

module.exports = router;
