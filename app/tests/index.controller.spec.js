'use strict';

describe('index controller', function(){

  beforeEach(module('osuCelebrity'));
  beforeEach(module('templates'));

  it('should define the index controller', inject(function($controller) {
    //spec body
    var indexCtrl = $controller('IndexController');
    expect(indexCtrl).toBeDefined();
  }));

});