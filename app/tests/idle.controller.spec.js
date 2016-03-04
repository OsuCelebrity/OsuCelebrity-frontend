'use strict';

describe('idle controller', function(){
  beforeEach(module('osuCelebrity'));

  it('should define the idle controller', inject(function($controller) {
    //spec body
    var idleCtrl = $controller('IdleController');
    expect(idleCtrl).toBeDefined();
  }));
});