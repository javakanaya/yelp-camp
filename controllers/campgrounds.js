const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
	// if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

	const campground = new Campground(req.body.campground);
	campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.owner = req.user._id;

	await campground.save();
	console.log(campground);

	req.flash("success", "Successfully made a new campground!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	if (!campground) {
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true });

	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	await campground.save();
	console.log(campground);

	// deleting from the mongo
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
	}
	req.flash("success", "Successfully updated campground!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	req.flash("success", "Succesfully deleted campground!");
	res.redirect("/campgrounds");
};
