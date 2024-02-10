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
	console.log(res.locals.returnTo);
	next();
};
