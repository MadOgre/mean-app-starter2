"use strict";

let User = require("../models").User;
let Listing = require("../models").Listing;
let jwtSimple = require("jwt-simple");

module.exports = {
	verifyUser: (req, res, next) => {
		verifyUser(req, res, next);
	},
	verifyOwner: (req, res, next) => {
		verifyUser(req, res, checkOwnerOrAdmin);
		function checkOwnerOrAdmin(err) {
			if (err) return next(err);
			Listing.findById(req.params.id).
			then(foundListing => {
				let error;
				if (!foundListing) {
					error = new Error("Listing not found");
					error.code = 404;
					return Promise.reject(error);
				} else if (foundListing.posterEmail !== req.user.email && !req.user.admin) {
					error = new Error("User is not article owner");
					error.code = 403;
					return Promise.reject(error);
				} else {
					return next();
				}
			}).
			catch(err => {
				return next(err);
			});
		}
	},
	verifyAdmin: (req, res, next) => {
		verifyUser(req, res, checkAdmin);
		function checkAdmin(err) {
			if (err) return next(err);
			if (req.user.admin) {
				return next();
			} else {
				let error = new Error("You don't have permission to access this feature");
				error.code = 403;
				return next(error);
			}
		}
	}
};

function verifyUser(req, res, next) {
	let token = req.headers["x-access-token"];
	if (token) {
		token = jwtSimple.decode(token, require("../secret"));
	} else {
		let error = new Error("Not logged in");
		error.code = 403;
		return next(error);			
	}
	User.findById(token.user._id).
	then((foundUser) => {
		if (!foundUser || foundUser.email !== token.user.email) {
			let error = new Error("Not logged in");
			error.code = 403;
			return Promise.reject(error);
		} else {
			req.user = {
				_id: token.user._id,
				email: token.user.email,
				admin: foundUser.admin
			};
			return next();
		}
	}).
	catch(err => {
		return next(err);
	});	
}