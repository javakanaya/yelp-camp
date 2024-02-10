const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");

/**
 * MODELS
 */
const Campground = require("../models/campground");

/**
 * MIDDLEWARE
 */
const { isLoggedIn, isCampgroundOwner, validateCampground } = require("../middleware");

/**
 * ROUTES
 */
router.get(
	"/",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

router.post(
	"/",
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

		const campground = new Campground(req.body.campground);
		campground.owner = req.user._id;

		await campground.save();

		req.flash("success", "Successfully made a new campground!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id)
			// populating the owner of the campground
			.populate("owner")
			// populating the reviews of the campground, and the author of each review.
			.populate({
				path: "reviews",
				populate: {
					path: "author",
				},
			});
		if (!campground) {
			req.flash("error", "Cannot find that campground!");
			res.redirect("/campgrounds");
		}
		res.render("campgrounds/show", { campground });
	})
);

router.get(
	"/:id/edit",
	isLoggedIn,
	isCampgroundOwner,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		if (!campground) {
			req.flash("error", "Cannot find that campground!");
			return res.redirect("/campgrounds");
		}
		res.render("campgrounds/edit", { campground });
	})
);

router.put(
	"/:id",
	isLoggedIn,
	isCampgroundOwner,
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true });
		if (!campground) {
			req.flash("error", "Cannot find that campground!");
			return res.redirect("/campgrounds");
		}
		req.flash("success", "Successfully updated campground!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:id",
	isLoggedIn,
	isCampgroundOwner,
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		req.flash("success", "Succesfully deleted campground!");
		res.redirect("/campgrounds");
	})
);

module.exports = router;
