const mongoose = require("mongoose");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("Database connected");
});

// get random element from given array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	await Review.deleteMany({});
	for (let i = 0; i < 200; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			owner: "65c6e587026f1d513ef7dd7f",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: "https://res.cloudinary.com/drum2urp1/image/upload/v1707754627/YelpCamp/agbcgw5mmxawdumqktys.jpg",
					filename: "YelpCamp/agbcgw5mmxawdumqktys",
				},
				{
					url: "https://res.cloudinary.com/drum2urp1/image/upload/v1707754628/YelpCamp/yvyiaqvca734crhhu3jl.jpg",
					filename: "YelpCamp/yvyiaqvca734crhhu3jl",
				},
			],
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dignissim justo nec nisi consequat, vitae commodo ante malesuada. Mauris vitae risus ut felis hendrerit tincidunt sed at justo. Nullam id risus ut ante sodales pharetra a quis libero. Fusce lobortis erat eget massa fringilla, quis commodo turpis commodo. Integer consequat purus ac ligula lacinia, id sodales sem gravida. Sed eu quam vitae eros vestibulum feugiat. Donec lobortis semper nisi vel fermentum. Vivamus vitae justo vitae metus vehicula auctor. Vivamus et tincidunt eros, eu luctus nisl. Maecenas nec eleifend turpis. Sed lacinia luctus lectus sit amet aliquam. Ut vel magna eleifend, tempor ipsum id, porta eros. Sed et tempor dui. Cras a velit sed leo cursus ullamcorper. Suspendisse potenti. ",
			price,
			geometry: {
				type: "Point",
				coordinates: [cities[random1000].longitude, cities[random1000].latitude],
			},
		});
		await camp.save();
	}
};

seedDB().then(() => {
	console.log("Seedding successful");
	mongoose.connection.close();
	console.log("Database connection closed");
});
