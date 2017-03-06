(function(){angular.module('APPNAME').run(['$templateCache', function($templateCache) {$templateCache.put('footer-component.tpl','<!-- footer template goes here -->');
$templateCache.put('header-component.tpl','<!-- Header template goes here -->');
$templateCache.put('home-component.tpl','<!-- homepage template goes here -->');
$templateCache.put('root-component.tpl','<header class="site-header"><header-component></header-component></header>\r\n<main class="site-main" ui-view="content-view"></main>\r\n<footer class="site-footer"><footer-component></footer-component></footer>');}]);})();