'use strict';

angular.module('osuCelebrity')

.service('QueueService', ['ENDPOINTS', '$resource', function(ENDPOINTS, $resource) {
  return $resource(ENDPOINTS.QUEUE);
}]);