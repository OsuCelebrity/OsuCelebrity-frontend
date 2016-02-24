'use strict';

angular.module('osuCelebrity')

.service('CurrentService', ['ENDPOINTS', '$resource', function(ENDPOINTS, $resource) {
  return $resource(ENDPOINTS.CURRENT);
}]);