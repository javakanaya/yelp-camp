/**
 * Wrap other middleware or route handler functions, 
 * ensuring that any errors thrown by these functions 
 * are properly forwarded to the Express error handling middleware.
 * 
 * 
 * bassicly this is a try catch block
 * 
 * @param {*} func 
 * @returns 
 */

module.exports = (func) => {
	return (req, res, next) => {
		func(req, res, next).catch(next);
	};
};
