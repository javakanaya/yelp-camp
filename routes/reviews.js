const express = require("express");
const router = express.Router({ mergeParams: true }); // so you can acces the campground id

const catchAsync = require("../utils/catchAsync");

/**
 * MODELS
 */
const Campground = require("../models/campground");
const Review = require("../models/review");

/**
 * MIDDLEWARE
 */
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

/**
 * ROUTES
 */
router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);

		review.author = req.user._id;

		campground.reviews.push(review);

		await review.save();
		await campground.save();

		req.flash("success", "Created a new review!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	// the campgrounds id is need for removing the relationship
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;

		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);

		req.flash("success", "Succesfully deleted review!");
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
