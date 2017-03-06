"use strict";

let User = require("../models").User;

module.exports = {
	getAll: (req, res, next) => {
		User.find({}, {password: 0}).
		then(foundUsers => {
			return res.json(foundUsers);
		}).
		catch(err => {
			return next(err);
		});
	},
	getOne: (req, res, next) => {
		User.findOne({email: req.params.email}, {password: 0}).
		then(foundUser => {
			if (!foundUser) {
				let error = new Error("User not found");
				error.code = 404;
				return Promise.reject(error);
			} else {
				return res.json(foundUser);
			}
		}).
		catch(err => {
			return next(err);
		});
	},
	create: (req, res, next) => {
		let user = new User(req.body);
		user.save().
		then(savedUser => {
			const user = {
				email: savedUser.email,
				admin: savedUser.admin
			};
			return res.json(user);
		}).
		catch(err => {

			//if conflict with existing email, create a human readable error message to be handled
			if (err.code === 11000) {
				err.humanReadableError = "This email is already taken";
			} 
			return next(err);
		});
	},
	update: (req, res, next) => {

		//find the user in the database
		User.findOne({email: req.params.email}).

		then(foundUser => {
			if (!foundUser) {

				//if not found, construct an error object and attach 404 code
				let error = new Error("User not found");
				error.code = 404;

				//then abort the chain
				return Promise.reject(error);
			} else {

				//update the found user object
				Object.assign(foundUser, req.body);

				//delete the version tag (necessary to prevent versioning errors)
				delete foundUser.__v;

				//save changes to the database
				return foundUser.save();
			}
		}).
		then(savedUser => {
			const user = {
				email: savedUser.email,
				admin: savedUser.admin
			};
			//send back the saved user
			return res.json(user);
		}).
		catch(err => {

			//in case the user email is conflicting, attach a human readable error to be handled
			if (err.code === 11000) {
				err.humanReadableError = "User with this email already exists";
			}
			return next(err);
		});		
	},
	delete: (req, res, next) => {
		
		//find the user by email
		User.findOne({email: req.params.email}).

		then(foundUser => {
			//check if the user exists
			if (!foundUser) {

				//if not construct the error and set the code to 404
				let error = new Error("User not found");
				error.code = 404;

				//then abort the chain
				return Promise.reject(error);
			} else {
				return foundUser;			
			}
		}).

		then(foundUser => {

			//remove the user
			return foundUser.remove();
		}).

		then(deletedUser => {

			const user = {
				email: deletedUser.email,
				admin: deletedUser.admin
			};
			//send back the removed user
			return res.json(user);
		}).

		catch(err => {
			return next(err);
		});
	}
};