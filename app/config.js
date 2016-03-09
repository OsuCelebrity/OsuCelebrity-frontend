'use strict';

// Declare app level module which depends on views, and components
angular.module('osuCelebrity')

.constant('ENDPOINTS', (function() {
  var API_URL = 'http://localhost:8989';
  //var API_URL = 'http://852b4ac6.ngrok.io';

  return {
    CURRENT: API_URL + '/current',
    QUEUE: API_URL + '/queue',
    VOTES: API_URL + '/votes'
  };
})())

.constant('INTERVALS', {
  LEADERBOARD: 500, 
  USER_INFO: 300
});