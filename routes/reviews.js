const express = require("express");
const router = express.Router({ mergeParams: true }); // so you can acces the campground id

const catchAsync = require("../utils/catchAsync");

/**
 * CONTROLLERS
 */
const reviews = require("../controllers/reviews");

/**
 * MIDDLEWARE
 */
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

/**
 * ROUTES
 */
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// the campgrounds id is need for removing the relationship
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
