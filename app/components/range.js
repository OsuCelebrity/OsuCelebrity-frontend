'use strict';

angular.module('osuCelebrity')

.filter('range', function(){
  return function(n) {
    var res = [];
    for (var i = n[0]; i <= n[1]; i++) {
      res.push(i);
    }
    return res;
  };
})