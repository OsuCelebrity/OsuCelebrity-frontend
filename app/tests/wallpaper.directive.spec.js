'use strict';

describe('wallpaper directive', function(){

  var $compile, $rootScope;

  beforeEach(module('osuCelebrity'));
  beforeEach(module('templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('replaces the element with the appropriate content', function() {
    var element = $compile("<osuceleb-wallpaper></osuceleb-wallpaper>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain('class="wallpaper-wrapper"');
  });

});