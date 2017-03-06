//This is a root component, it simply renders header and components
//and provides a placeholder for current content component

(function(){
	"use strict";
	// uncomment and change APPNAME to your app name
	angular.module("APPNAME").
	component("rootComponent", {
		templateUrl: "root-component.tpl"
	});
})();