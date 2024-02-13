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
const { isLoggedIn, isCampgroundOwner, validateCampground, validateObjectId } = require("../middleware");

// for enctype: form/multipart, adding the file data to request.body
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

/**
 * ROUTES
 */

router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
	.route("/:id")
	.get(validateObjectId, catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isCampgroundOwner, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isCampgroundOwner, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", validateObjectId, isLoggedIn, isCampgroundOwner, catchAsync(campgrounds.renderEditForm));

module.exports = router;
