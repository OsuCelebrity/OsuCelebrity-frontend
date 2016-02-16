'use strict';

// Declare app level module which depends on views, and components
angular.module('osuCelebrity', [
  'ngRoute',
  'osuCelebrity.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/index'});
}]);
