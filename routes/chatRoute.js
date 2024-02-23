const express = require("express");
const {
  getAllSupportChats,
  getSupportMessages,
} = require("../controllers/chatController");
const router = express.Router();

router.get("/support", getAllSupportChats);
router.get("/support/:suppId", getSupportMessages);

module.exports = router;
