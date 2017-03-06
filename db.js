"use strict";
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//must uncomment and change the following line to the correct database name
//mongoose.connect("mongodb://localhost/DBNAME");

mongoose.connection.on("connected", () => {
	console.log("Connection to database successful");
});

mongoose.connection.on("error", err => {
	console.error(err.message);
	process.exit();
});