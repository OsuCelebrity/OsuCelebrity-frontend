'use strict';

angular.module('osuCelebrity')

.factory('UserInfoLink', function() {
  return function($scope, $element, $attr, ctrl) {
    ctrl.startLink();
  };
})

.directive('osucelebUserInfo', function(UserInfoLink) {
  return {
    templateUrl: 'components/userinfo/userinfo.html',
    restrict: 'E',
    controller: 'UserInfoController',
    link: UserInfoLink
  };
})

.controller('UserInfoController', ['INTERVALS', '$scope', '$interval', 'CurrentService', 
  function(INTERVALS, $scope, $interval, Current) {

  this.startLink = function() {
    $scope.Math = Math;
    $interval(this.updateCurrent, INTERVALS.USER_INFO);
  }

  this.updateCurrent = function() {
    Current.get({}, function(data) {
      $scope.current = data;
      switch($scope.current.gameMode) {
        case 1:
          $scope.modeIcon = "icon-taiko";
          break;
        case 2:
          $scope.modeIcon = "icon-ctb";
          break;
        case 3:
          $scope.modeIcon = "icon-mania";
          break;
        case 0:
          $scope.modeIcon = "icon-standard";
          break;
        default:
          $scope.modeIcon = "icon-standard";
          break;
      }
    });
  };

  $scope.getDate = function() {
    return new Date().getTime();
  };
}]);