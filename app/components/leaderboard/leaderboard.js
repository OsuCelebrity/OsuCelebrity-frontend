'use strict';

angular.module('osuCelebrity')

.factory('LeaderboardLink', function() {
  return function($scope, $element, $attr, ctrl) {
    ctrl.startLink();
  };
})

.directive('osucelebLeaderboard', function(LeaderboardLink) {
  return {
    templateUrl: 'components/leaderboard/leaderboard.html',
    restrict: 'E',
    controller: 'LeaderboardController',
    link: LeaderboardLink
  };
})

.controller('LeaderboardController', ['INTERVALS', '$scope', '$interval', 'QueueService', 
  function(INTERVALS, $scope, $interval, Queue) {

  this.startLink = function() {
    $interval(this.updateQueue, INTERVALS.LEADERBOARD);
  };

  this.updateQueue = function() {
    Queue.query(function(data) {
      $scope.queue = data;
    });
  };
}]);