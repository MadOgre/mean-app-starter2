"use strict";

let Category = require("../models").Category;
let Listing = require("../models").Listing;

const uncategorizedId = require("../config").uncategorizedId;

module.exports = {
	getAll: (req, res, next) => {

		//get all categories
		Category.find().exec().

		then((categories) =>{

			//then return them
			return res.json(categories);
		}).

		catch(err => {
			return next(err);
		});
	},

	getOne: (req, res, next) => {

		//get the category by name
		Category.findOne({name: req.params.name}).

		//populate all listing data for the category
		populate('listings').exec().

		then(foundCategory => {

			//check if category exists
			if (!foundCategory) {

				//if not construct the error and set the code to 404
				let error = new Error("Category not found");
				error.code = 404;

				//then abort the chain
				return Promise.reject(error);
			} else {
				return foundCategory;
			}
		}).

		then(foundCategory => {

			//else send back the category with all listings
			return res.json(foundCategory);
		}).
		
		catch(err => {
			return next(err);
		});		
	},

	create: (req, res, next) => {

		//create new category in memory
		let category = new Category(req.body);

		//attempt to save
		category.save().
		then(foundCategory => {

			//if successful send the category object back
			return res.json(foundCategory);
		}).
		catch(err => {

			//if conflict with existing category, create a human readable error message to be handled
			if (err.code === 11000) {
				err.humanReadableError = "Category with this name already exists";
			} 
			return next(err);
		});		
	},

	update: (req, res, next) => {

		//if the change is requested for the 'uncategorized' category throw error
		if (req.params.name.toLowerCase() === "uncategorized") {
			return next(new Error("This category cannot be changed"));
		}

		//find the category in the database
		Category.findOne({name: req.params.name}).

		then(foundCategory => {
			if (!foundCategory) {

				//if not found, construct an error object and attach 404 code
				let error = new Error("Category not found");
				error.code = 404;

				//then abort the chain
				return Promise.reject(error);
			} else {

				//update the found category object
				Object.assign(foundCategory, req.body);

				//delete the version tag (necessary to prevent versioning errors)
				delete foundCategory.__v;

				//save changes to the database
				return foundCategory.save();
			}
		}).
		then(savedCategory => {

			//send back the saved category
			return res.json(savedCategory);
		}).
		catch(err => {

			//in case the category name is conflicting, attach a human readable error to be handled
			if (err.code === 11000) {
				err.humanReadableError = "Category with this name already exists";
			}
			return next(err);
		});
	},

	delete: (req, res, next) => {

		//category to be deleted
		let categoryToDelete = {};
		
		//locate the category to be deleted
		Category.findOne({name: req.params.name}).

		then(foundCategory => {
			
			//check if category exists
			if (!foundCategory) {

				//if not construct the error object
				let error = new Error("Category not found");
				error.code = 404;

				//and abort the chain
				return Promise.reject(error);
			} else {
				categoryToDelete = foundCategory;

				//update all listings in the found category to delete it
				//from their lists of categories
				return Listing.update(
					{
						categories: categoryToDelete._id
					},
					{
						$pull: {categories: categoryToDelete._id}
					},
					{
						multi: true
					}
				).exec();
			}
		}).
		then(() => {

			//update all listing which have no categories (orphaned)
			//and add the 'uncategorized' category to them
			return Listing.update(
				{
					categories: {
						$eq: []
					}
				},
				{
					$addToSet: {categories: uncategorizedId}
				},
				{
					multi: true
				}
			).exec();
		}).
		then(() => {
			return Listing.find({categories: uncategorizedId}, {_id: 1}).exec();
		}).
		then(foundListings => {
			return foundListings.map(function(listing){
				return listing._id;
			});
		}).
		then(listingIds => {

			//update the 'uncategorized' category and push all the
			//uncategorized listings into it
			return Category.update(
				{
					_id: uncategorizedId
				},
				{
					$addToSet: {
						listings: {
							$each: listingIds
						}
					}
				}
			).exec();
		}).
		then(() => {
			return categoryToDelete.remove();
		}).
		then(deletedCategory => {
			return res.json(deletedCategory);
		}).
		catch(err => {
			console.log(err);
			return next(err);
		});
	}

};