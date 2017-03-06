"use strict";

module.exports = function() {

	let promise = new Promise(resolve => {
		
		//any code that should run after the database is connected and before
		//the app starts should go here

		resolve();		
	});
	return promise;
};