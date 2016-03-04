'use strict';

angular.module('osuCelebrity')

.directive('osucelebWallpaper', function() {
  return {
    templateUrl: 'components/wallpaper/wallpaper.html',
    restrict: 'E'
  };
});