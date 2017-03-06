!function(){"use strict";function t(t){t.interceptors.push("requestInterceptor")}function n(t,n){t.onError({},function(){n.go("root-state.home-state")})}angular.module("APPNAME",["ui.router"]).config(t).run(n),t.$inject=["$httpProvider"],n.$inject=["$transitions","$state"]}();
!function(){"use strict";function t(t,o,e){e.otherwise("/");var n={name:"root-state",abstract:!0,component:"rootComponent"},r={name:"root-state.home-state",url:"/",views:{"content-view":"homeComponent"}};t.state(n),t.state(r),o.html5Mode(!0)}angular.module("APPNAME").config(t),t.$inject=["$stateProvider","$locationProvider","$urlRouterProvider"]}();
!function(){angular.module("APPNAME").run(["$templateCache",function(e){e.put("footer-component.tpl","<!-- footer template goes here -->"),e.put("header-component.tpl","<!-- Header template goes here -->"),e.put("home-component.tpl","<!-- homepage template goes here -->"),e.put("root-component.tpl",'<header class="site-header"><header-component></header-component></header>\r\n<main class="site-main" ui-view="content-view"></main>\r\n<footer class="site-footer"><footer-component></footer-component></footer>')}])}();
!function(){"use strict";angular.module("APPNAME").component("footerComponent",{templateUrl:"footer-component.tpl"})}();
!function(){"use strict";angular.module("APPNAME").component("headerComponent",{templateUrl:"header-component.tpl"})}();
!function(){"use strict";angular.module("APPNAME").component("homeComponent",{templateUrl:"home-component.tpl"})}();
!function(){"use strict";angular.module("APPNAME").component("rootComponent",{templateUrl:"root-component.tpl"})}();
!function(){"use strict";function t(){return{request:function(t){return t}}}angular.module("APPNAME").factory("requestInterceptor",t)}();
//# sourceMappingURL=main.js.map
