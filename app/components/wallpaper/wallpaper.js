'use strict';

angular.module('osuCelebrity')

.directive('osucelebWallpaper', function() {
  return {
    templateUrl: 'components/wallpaper/wallpaper.html',
    restrict: 'E',
    controller: 'WallpaperController'
  };
})

.controller('WallpaperController', function($scope, $filter) {
  $scope.getWallpapers = function(videoRange, imageRange) {
    $scope.videoSources = [];
    $scope.imageSources = [];

    for(var i = videoRange[0]; i <= videoRange[1]; i++)
      $scope.videoSources.push($scope.getWallpaperVideoSource(i));

    for(var i = imageRange[0]; i <= imageRange[1]; i++)
      $scope.imageSources.push($scope.getWallpaperImageSource(i));
  };

  $scope.padFixedLength = function(n, len) {
    var num = parseInt(n, 10);
    len = parseInt(len, 10);
    if (isNaN(num) || isNaN(len)) {
      return n;
    }
    num = ''+num;
    while (num.length < len) {
      num = '0'+num;
    }
    return num;
  };

  $scope.getWallpaperVideoSource = function(number) {
    //Pad to make the number 003 or 020
    return 'img/wallpapers/webm/' + $scope.padFixedLength(number, 3) + '.webm';
  };

  $scope.getWallpaperImageSource = function(number) {
    //Pad to make the number 003 or 020
    return 'img/wallpapers/png/' + $scope.padFixedLength(number, 3) + '.png';
  };
});