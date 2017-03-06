//This service acts as an interceptor for all $http requests
//It appends a token to every request if the token exists

(function(){
	"use strict";

	//uncomment and change APPNAME to your app name
	angular.module("APPNAME").
	factory("requestInterceptor", requestInterceptor);

	function requestInterceptor() {
		return {
			request: function(config) {

				//modify the config object as needed 
				return config;
			}
		};
	}
})();