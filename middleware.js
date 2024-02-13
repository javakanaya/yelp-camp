const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");
const { ObjectId } = require("mongodb");

const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
	// req.user is from the session thanks to passport
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be signed in ");
		return res.redirect("/login");
	}
	next();
};

module.exports.storeReturnTo = (req, res, next) => {
	if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
	next();
};

// for validating camprgounds objects
module.exports.validateCampground = (req, res, next) => {
	// NOT A MONGOOSE SCHEMA, BUT A JOI SCHEMA FOR VALIDATION
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((errorList) => errorList.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isCampgroundOwner = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);

	if (!campground.owner.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	// NOT A MONGOOSE SCHEMA, BUT A JOI SCHEMA FOR VALIDATION
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((errorList) => errorList.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

const isValidObjectId = (id) => {
	return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};

module.exports.validateObjectId = (req, res, next) => {
	const { id } = req.params; // Assuming the id is in the URL parameters

	if (!isValidObjectId(id)) {
		req.flash("error", "Invalid Campground ID");
		return res.redirect(`/campgrounds`);
	}

	// ObjectId format is valid, continue with the next middleware
	next();
};
