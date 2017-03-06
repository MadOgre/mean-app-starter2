(function(){
	"use strict";

	//uncomment and change the APPNAME to your app name
	angular.module("APPNAME", ["ui.router"]).
	config(insertInterceptors).
	run(attachTransitionHooks);

	insertInterceptors.$inject = ["$httpProvider"];

	function insertInterceptors($httpProvider) {

		//insert an interceptor into all $http calls
		$httpProvider.interceptors.push("requestInterceptor");
	}

	attachTransitionHooks.$inject = ["$transitions", "$state"];

	function attachTransitionHooks($transitions, $state){
		
		//if error in transition, change to the categories state (home page)
		$transitions.onError({}, function(){
			$state.go("root-state.home-state");
		});
	}
})();