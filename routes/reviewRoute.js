const router = require("express").Router({ mergeParams: true });

const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../validators/reviewValidator");
const {
  getReview_S,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/", getReview_S);

router.use(protect);

router.post("/", allowedTo("customer"), createReviewValidator, createReview);

router
  .route("/:reviewId")
  .patch(allowedTo("customer"), updateReviewValidator, updateReview)
  .delete(allowedTo("customer", "admin"), deleteReviewValidator, deleteReview);

module.exports = router;
