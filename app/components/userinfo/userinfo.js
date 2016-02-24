'use strict';

angular.module('osuCelebrity')

.directive('osucelebUserInfo', function() {
  return {
    templateUrl: 'components/userinfo/userinfo.html',
    restrict: 'E',
    controller: 'UserInfoController',
    link: function($scope, $element, $attr, ctrl) {
      ctrl.startLink();
    }
  };
})

.controller('UserInfoController', ['INTERVALS', '$scope', '$interval', 'CurrentService', '$resource', 
  function(INTERVALS, $scope, $interval, Current, $resource) {

  this.startLink = function() {
    $scope.Math = Math;
    $interval(updateCurrent, INTERVALS.USER_INFO);
  }

  var updateCurrent = function() {
    var current = Current.get({}, function() {
      $scope.current = current;
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