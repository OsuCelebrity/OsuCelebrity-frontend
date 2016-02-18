'use strict';

angular.module('osuCelebrity')

.directive('osucelebUserInfo', function() {
  return {
    templateUrl: 'components/userinfo/userinfo.html',
    restrict: 'E',
    controller: 'UserInfoController'
  };
})

.controller('UserInfoController', ['$scope', '$interval', 'CurrentService', 
  function($scope, $interval, Current) {

  $scope.Math = Math;
  $interval(updateUserInfo, 100);

  var updateUserInfo = function() {
    $scope.current = Current.query(function() {
      switch($scope.current.gameMode) {
        case 0:
          $scope.modeIcon = "icon-standard";
          break;
        case 1:
          $scope.modeIcon = "icon-taiko";
          break;
        case 2:
          $scope.modeIcon = "icon-ctb";
          break;
        case 3:
          $scope.modeIcon = "icon-mania";
          break;
        default:
          $scope.modeIcon = "icon-standard";
          break;
      }
    });
  };
}]);