'use strict';

angular.module('osuCelebrity')

.service('VoteService', ['ENDPOINTS', '$resource', function(ENDPOINTS, $resource) {
  return $resource(ENDPOINTS.VOTES);
}]);