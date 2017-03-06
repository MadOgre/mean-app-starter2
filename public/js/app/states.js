(function(){
	"use strict";
	
	// uncomment and change APPNAME to your app name
	angular.module("APPNAME").
	config(setStates);

	setStates.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
		
	function setStates($stateProvider, $locationProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/");
		var rootState = {
			name: "root-state",
			abstract: true,
			component: "rootComponent",
		};
		var homeState = {
			name: "root-state.home-state",
			url: "/",
			views: {
				"content-view": "homeComponent"
			}
		};
		$stateProvider.state(rootState);
		$stateProvider.state(homeState);
		$locationProvider.html5Mode(true);
	};
})();