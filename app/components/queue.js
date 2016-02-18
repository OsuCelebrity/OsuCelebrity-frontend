'use strict';

angular.module('osuCelebrity')

.service('QueueService', ['$resource', function($resource) {
  return $resource('http://localhost:8989/queue');
}]);