'use strict';

angular.module('osuCelebrity')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/index', {
    templateUrl: 'components/index/index.html',
    controller: 'IndexController'
  });
}])

.controller('IndexController', [function() {

}]);