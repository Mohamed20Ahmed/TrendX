const express = require("express");

const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { chatSignUp, chatLogin } = require("../controllers/chatController");
const router = express.Router();

router.post("/signup", chatSignUp);
module.exports = router;
