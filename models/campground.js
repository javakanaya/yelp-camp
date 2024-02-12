const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

// https://res.cloudinary.com/drum2urp1/image/upload/w_300/v1707751801/YelpCamp/x6ulvjvz3mpthxu721wx.jpg

const imageSchema = new Schema({
	url: String,
	filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload/", "/upload/w_200/");
});
const campgroundSchema = new Schema({
	title: String,
	images: [imageSchema],
	price: Number,
	description: String,
	location: String,
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

// To delete associated reviews to the campground, the delete route is triggering the "findOneAndDelete"
campgroundSchema.post("findOneAndDelete", async function (deletedCampground) {
	if (deletedCampground) {
		await Review.deleteMany({
			_id: {
				$in: deletedCampground.reviews,
			},
		});
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);
