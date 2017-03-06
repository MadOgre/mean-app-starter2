"use strict";

let categoriesController = require("./categories-controller");
let listingsController = require("./listings-controller");
let usersController = require("./users-controller");
let authController = require("./auth-controller");
let checkpointController = require("./checkpoint-controller");

module.exports = app => {

	app.get("/api/v1/categories", categoriesController.getAll);
	app.get("/api/v1/category/:name", categoriesController.getOne);
	app.post("/api/v1/category", checkpointController.verifyAdmin, categoriesController.create);
	app.put("/api/v1/category/:name",  checkpointController.verifyAdmin, categoriesController.update);
	app.delete("/api/v1/category/:name",  checkpointController.verifyAdmin, categoriesController.delete);

	app.get("/api/v1/listings", listingsController.getAll);
	app.get("/api/v1/listing/:id", listingsController.getOne);
	app.post("/api/v1/listing", checkpointController.verifyUser, listingsController.create);
	app.put("/api/v1/listing/:id", checkpointController.verifyOwner, listingsController.update);
	app.delete("/api/v1/listing/:id", checkpointController.verifyOwner, listingsController.delete);

	app.get("/api/v1/users", checkpointController.verifyAdmin, usersController.getAll);
	app.get("/api/v1/user/:email", checkpointController.verifyAdmin, usersController.getOne);
	app.post("/api/v1/user", checkpointController.verifyAdmin, usersController.create);
	app.put("/api/v1/user/:email", checkpointController.verifyAdmin, usersController.update);
	app.delete("/api/v1/user/:email", checkpointController.verifyAdmin, usersController.delete);

	app.post("/login", authController.login);
};