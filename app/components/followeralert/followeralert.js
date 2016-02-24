'use strict';

angular.module('osuCelebrity')

.directive('osucelebFollowerAlert', function() {
  return {
    templateUrl: 'components/followeralert/followeralert.html',
    restrict: 'E'
  };
});