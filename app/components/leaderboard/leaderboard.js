'use strict';

angular.module('osuCelebrity')

.directive('osucelebLeaderboard', function() {
  return {
    templateUrl: 'components/leaderboard/leaderboard.html',
    restrict: 'E',
    controller: 'LeaderboardController'
  };
})

.controller('LeaderboardController', ['$scope', '$interval', 'QueueService', 'CurrentService', 
  function($scope, $interval, Queue, Current) {

  $interval(updateQueue, 300);
  $interval(updateCurrent, 300);

  var updateQueue = function() {
    $scope.queue = Queue.query();
  };

  var updateCurrent = function() {
    $scope.current = Current.query();
  };
}]);