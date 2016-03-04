'use strict';

angular.module('osuCelebrity')

.config(function($routeProvider) {
  $routeProvider.when('/index', {
    templateUrl: 'components/index/index.html',
    controller: 'IndexController'
  });
})

.controller('IndexController', function() {
  
});