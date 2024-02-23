const express = require("express");
const {
  getAllSupportChats,
  getSupportMessages,
  sendSupportMessage,
  getMyShopChats,
} = require("../controllers/chatController");
const { protect, allowedTo } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });
router.use(protect);

router.get("/support", getAllSupportChats);
router.get("/support/:supportId", getSupportMessages);
router.post("/support", sendSupportMessage);

router.get("/shop", allowedTo("seller"), getMyShopChats);
router.get(
  "/shop/:shopId",
  allowedTo("seller", "customer"),
  getSupportMessages
);
router.post("/shop", sendSupportMessage);

module.exports = router;
