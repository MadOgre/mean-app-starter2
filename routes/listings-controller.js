"use strict";

let Listing = require("../models").Listing;
let Category = require("../models").Category;

module.exports = {
	getAll: (req, res, next) => {

		//retrieve all listings
		Listing.find().

		//populate their category names
		populate({
			path: "categories"
		}).exec().

		then(listings => {

			//send back the listings
			return res.json(listings);
		}).

		catch(err => {
			return next(err);
		});
	},
	getOne: (req, res, next) => {

		//find the listing by its id
		Listing.findById(req.params.id).

		//populate their category names
		populate({
			path: "categories"
		}).exec().

		then(foundListing => {

			//check if the listing exists
			if (!foundListing) {

				//if not construct the error and set the code to 404
				let error = new Error("Listing not found");
				error.code = 404;

				//then abort the chain
				return Promise.reject(error);
			} else {
				return foundListing;		
			}
		}).

		then(foundListing => {
			//otherwise send back the listing
			return res.json(foundListing);	
		}).

		catch(err => {
			return next(err);
		});
	},
	create: (req, res, next) => {

		//create new listing in memory with information from request
		let listing = new Listing(req.body);

		//set the poster email
		listing.posterEmail = req.user.email;

		//save the listing into database
		listing.save().

		then(savedListing => {

			//look up any categories whose names match the categories of the listing
			return Category.update(
				{
					_id: {$in: savedListing.categories}
				},
				{
					//push the current listing id into their listings arrays
					$addToSet: {listings: savedListing._id}
				},
				{
					//this means potentially many cateories
					multi: true
				}
			).exec().

			//return the saved listing
			then(() => savedListing);
		}).

		then(savedListing => {
			return res.json(savedListing);
		}).

		catch(err => {
			return next(err);
		});
	},
	update: (req, res, next) => {

		//find the listing by its id
		Listing.findById(req.params.id).exec().
		
		then(foundListing => {

			//check if the listing exists
			if (!foundListing) {
				//if not construct the error and set the code to 404
				let error = new Error("Listing not found");
				error.code = 404;

				//then abort the chain
				return Promise.reject(error);
			} else {
				return foundListing;
			}
		}).

		then(foundListing => {

			//find all categories mentioned in the original listing
			//remove the listing if the category isnt found in the new listing
			return Category.update(
				{
					$and: [
						{_id: {$in: foundListing.categories}},
						{_id: {$nin: req.body.categories}}
					]
				},
				{
					$pull: {listings: foundListing._id}
				},
				{
					multi: true
				}
			).exec().

			//return the original found listing
			then(() => foundListing);		
		}).

		then(foundListing => {

			//find all categories mentioned in the new listing
			//add the listing if the category isn't found in the original listing
			return Category.update(
				{
					$and: [
						{_id: {$nin: foundListing.categories}},
						{_id: {$in: req.body.categories}}
					]
				},
				{
					$addToSet: {listings: foundListing._id}
				},
				{
					multi: true
				}
			).exec().

			//return the original found listing
			then(() => foundListing);		
		}).

		then(foundListing => {

			//update the listing itself
			Object.assign(foundListing, req.body);

			//remove version tag (necessary to prevent versioning errors)
			delete foundListing.__v;

			//save the listing
			return foundListing.save();			
		}).

		then(savedListing => {

			//send back result data
			return res.json(savedListing);
		}).

		catch((err) => {
			return next(err);
		});
	},
	delete: (req, res, next) => {

		//find the listing by its id
		Listing.findById(req.params.id).

		then(foundListing => {
			//check if the listing exists
			if (!foundListing) {

				//if not construct the error and set the code to 404
				let error = new Error("Listing not found");
				error.code = 404;

				//then abort the chain
				return Promise.reject(error);
			} else {
				return foundListing;			
			}
		}).

		then(foundListing => {

			//find all categories mentioned in the listing
			//and remove the references to this listing
			return Category.update(
				{
					_id: {$in: foundListing.categories}
				},
				{
					$pull: {listings: foundListing._id}
				},
				{
					multi: true
				}
			).exec().

			//return the found listing
			then(() => foundListing);
		}).

		then(foundListing => {

			//remove the listing
			return foundListing.remove();
		}).

		then(deletedListing => {

			//send back the removed listing
			return res.json(deletedListing);
		}).

		catch(err => {
			return next(err);
		});
	}
};