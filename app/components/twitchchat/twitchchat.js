'use strict';

angular.module('osuCelebrity')

.directive('osucelebTwitchChat', function($window) {
  return {
    templateUrl: 'components/twitchchat/twitchchat.html',
    restrict: 'E',
    scope: true
  };
});