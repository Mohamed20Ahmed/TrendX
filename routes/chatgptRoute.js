const router = require("express").Router({ mergeParams: true });

// const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { chatgpt } = require("../controllers/chatgptController");

// router.use(protect, allowedTo("customer"));

router.get("/", chatgpt);

module.exports = router;
