'use strict';

angular.module('osuCelebrity')

.directive('osucelebLeaderboard', function() {
  return {
    templateUrl: 'components/leaderboard/leaderboard.html',
    restrict: 'E',
    controller: 'LeaderboardController',
    link: function($scope, $element, $attr, ctrl) {
      ctrl.startLink();
    }
  };
})

.controller('LeaderboardController', ['INTERVALS', '$scope', '$interval', 'QueueService', 'CurrentService', 
  function(INTERVALS, $scope, $interval, Queue, Current) {

  this.startLink = function() {
    $interval(updateQueue, INTERVALS.LEADERBOARD);
  };

  var updateQueue = function() {
    var queue = Queue.query(function() {
      $scope.queue = queue;
    });
  };
}]);