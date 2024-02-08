const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: "thishouldbeabettersecret!",
		resave: false,
		saveUninitialized: true,
		// options for the cookie
		cookie: {
			httpOnly: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // for a week
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	})
);
app.use(flash());


/**
 * MIDDLEWARE
 */
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

/**
 * ROUTES
 */
app.get("/", (req, res) => {
	res.render("home");
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

/**
 * all : get, post, delete, put, ...
 * if no route machtes, it calls this
 */
app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = err.message = "Oh No, Something WFent Wrong!";
	res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
	console.log("Serving on port 3000");
});
