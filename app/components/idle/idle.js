'use strict';

angular.module('osuCelebrity')

.config(function($routeProvider) {
  $routeProvider.when('/idle', {
    templateUrl: 'components/idle/idle.html',
    controller: 'IdleController'
  });
})

.controller('IdleController', function() {
  
});