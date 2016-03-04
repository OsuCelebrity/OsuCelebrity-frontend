'use strict';

angular.module('osuCelebrity')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/idle', {
    templateUrl: 'components/idle/idle.html',
    controller: 'IdleController'
  });
}])

.controller('IdleController', ['$timeout', function($timeout) {
  
}]);