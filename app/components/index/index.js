'use strict';

angular.module('osuCelebrity')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/index', {
    templateUrl: 'components/index/index.html',
    controller: 'IndexController'
  });
}])

.controller('IndexController', ['$timeout', function($timeout) {
  $timeout(function(){
    angular.element(document).find(".bgvideo").css('opacity', '0.33');
  }, 500);
}]);