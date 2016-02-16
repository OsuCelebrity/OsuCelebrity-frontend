'use strict';

describe('osuCelebrity.version module', function() {
  beforeEach(module('osuCelebrity.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
