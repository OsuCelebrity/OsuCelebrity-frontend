'use strict';

angular.module('osuCelebrity')

.directive('osucelebLeaderboard', function() {
  return {
    templateUrl: 'components/leaderboard/leaderboard.html',
    restrict: 'E',
    controller: 'LeaderboardController'
  };
})

.service('QueueService', ['$resource', function($resource) {
  return $resource('http://localhost:8989/queue');
}])

.service('CurrentService', ['$resource', function($resource) {
  return $resource('http://localhost:8989/current');
}])

.controller('LeaderboardController', ['$scope', '$interval', 'QueueService', 'CurrentService', 
  function($scope, $interval, Queue, Current) {

  $interval(updateQueue, 300);
  $interval(updateCurrent, 300);

  var updateQueue = function() {
    var queue = Queue.query(function(data) {

      for (i = 0; i < 5; i++) {
        var row = "#leaderboard tr:nth-child(" + (i + 3) + ")";

        var doc = angular.element(document);

        doc.find(row + " td:nth-child(2)").text(data[i].name);
        doc.find(row + " td:nth-child(3)").text(data[i].timeInQueue);
        doc.find(row + " td:nth-child(4)").text(data[i].votes);
        doc.find(row + " td:nth-child(1)").text(i + 1);
      }

    });
  };

  var updateCurrent = function() {
    var current = Current.query(function(data) {
      if (current.hasOwnProperty('nextPlayer')) {
        angular.element(document).find("#nextplayer-leaderboard").text(current.nextPlayer);
      } else {
        angular.element(document).find("#nextplayer-leaderboard").text("...");
      }
    });
  };
}]);