const express = require("express");
const { getAllSupportChats } = require("../controllers/chatController");
const router = express.Router();

router.get("/support", getAllSupportChats);
module.exports = router;
