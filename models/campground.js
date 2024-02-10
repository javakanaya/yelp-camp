const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

const campgroundSchema = new Schema({
	title: String,
	image: String,
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
