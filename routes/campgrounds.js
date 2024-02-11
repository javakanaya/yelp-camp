const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");

/**
 * CONTROLLERS
 */
const campgrounds = require("../controllers/campgrounds");

/**
 * MIDDLEWARE
 */
const { isLoggedIn, isCampgroundOwner, validateCampground } = require("../middleware");

/**
 * ROUTES
 */

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isCampgroundOwner, validateCampground, catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isCampgroundOwner, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isCampgroundOwner, catchAsync(campgrounds.renderEditForm));

module.exports = router;
