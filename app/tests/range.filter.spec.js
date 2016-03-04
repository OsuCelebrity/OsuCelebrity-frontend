'use strict';

describe('range filter', function(){

  var range;

  beforeEach(module('osuCelebrity'));

  beforeEach(inject(function($filter){
    range = $filter('range');
  }));

  it('should deal with a range properly', function() {
    var output = range([1, 5]);

    //Should output between 1 and 5
    for(var i = 1; i <= 5; i++) {
      expect(output[i-1]).toBe(i);
    }
  });

});