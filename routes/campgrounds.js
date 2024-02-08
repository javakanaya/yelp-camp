const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas");

/**
 * MODELS
 */

const Campground = require("../models/campground");
const { off } = require("../models/review");

/**
 * MIDDLEWARE
 */
// for validating camprgounds objects
const validateCampground = (req, res, next) => {
	// NOT A MONGOOSE SCHEMA, BUT A JOI SCHEMA FOR VALIDATION
	const { error } = campgroundSchema.validate(req.body);
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
router.get(
	"/",
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render("campgrounds/index", { campgrounds });
	})
);

router.get("/new", (req, res) => {
	res.render("campgrounds/new");
});

router.post(
	"/",
	validateCampground,
	catchAsync(async (req, res, next) => {
		// if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

		const campground = new Campground(req.body.campground);
		await campground.save();

		req.flash("success", "Successfully made a new campground!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate("reviews");
		if (!campground) {
			req.flash("error", "Cannot find that campground!");
			res.redirect("/campgrounds");
		}
		res.render("campgrounds/show", { campground });
	})
);

router.get(
	"/:id/edit",
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render("campgrounds/edit", { campground });
	})
);

router.put(
	"/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true });
		req.flash("success", "Successfully updated campground!");
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	"/:id",
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		req.flash("success", "Succesfully deleted campground!");
		res.redirect("/campgrounds");
	})
);

module.exports = router;
