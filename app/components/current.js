'use strict';

angular.module('osuCelebrity')

.service('CurrentService', ['$resource', function($resource) {
  return $resource('http://localhost:8989/current');
}]);