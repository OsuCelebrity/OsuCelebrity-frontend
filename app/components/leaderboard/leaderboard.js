'use strict';

angular.module('osuCelebrity')

.factory('LeaderboardLink', function() {
  return function($scope, $element, $attr, ctrl) {
    ctrl.startLink();
  };
})

.factory('LeaderboardTemplateUrl', function() {
  return function(element, attr) {
    var base = 'components/leaderboard/leaderboard'; 
    if(attr.hasOwnProperty('idle'))
      base += '.idle';
    return base + '.html';
  };
})

.directive('osucelebLeaderboard', function(LeaderboardLink, LeaderboardTemplateUrl) {
  return {
    templateUrl: LeaderboardTemplateUrl,
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