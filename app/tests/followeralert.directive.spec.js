'use strict';

describe('follower alert directive', function(){

  var $compile, $rootScope;

  beforeEach(module('osuCelebrity'));
  beforeEach(module('templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('replaces the element with the appropriate content', function() {
    var element = $compile("<osuceleb-follower-alert></osuceleb-follower-alert>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain("has followed!");
  });

});