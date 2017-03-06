"use strict";

let jwtSimple = require("jwt-simple");

let User = require("../models").User;

module.exports = {
	login: (req, res, next) => {
		let user = {};
		if (!req.body.email || !req.body.password) {
			return next(badLogin());
		}
		User.findOne({email: req.body.email.toLowerCase()}).
		then(foundUser => {
			if (!foundUser) {
				return Promise.reject(badLogin());
			}
			user._id = foundUser._id;
			user.email = foundUser.email;
			user.admin = foundUser.admin;
			return foundUser.verifyPassword(req.body.password);
		}).
		then(isVerified => {
			if (isVerified) {
				return res.json({
					token: jwtSimple.encode({
						user: user
					}, require("../secret")),
					email: user.email,
					admin: user.admin
				});
			} else {
				return Promise.reject(badLogin());		
			}
		}).
		catch(err => {
			return next(err);
		});		
	}
};

function badLogin() {
	let error = new Error("Invalid Credentials");
	error.code = 403;
	return error;
}