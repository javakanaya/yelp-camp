const express = require("express");
const router = express.Router({ mergeParams: true }); // so you can acces the campground id

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");

/**
 * MODELS
 */
const Campground = require("../models/campground");
const Review = require("../models/review");

/**
 * MIDDLEWARE
 */
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((errorList) => errorList.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

/**
 * ROUTES
 */
router.post(
	"/",
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);

		campground.reviews.push(review);

		await review.save();
		await campground.save();

		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	// the campgrounds id is need for removing the relationship
	"/:reviewId",
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;

		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);

		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
