'use strict';

describe('wallpaper controller', function(){
  beforeEach(module('osuCelebrity'));

  var scope, controller;

  beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();

      controller = $controller('WallpaperController', {'$scope': scope});
  }));

  it('should define the wallpaper controller', inject(function() {
    expect(controller).toBeDefined();
  }));

  it('should pad fixed lengths', inject(function() {
    var fixedSingle = scope.padFixedLength(1, 3);
    expect(fixedSingle).toBe('001');

    var fixedDouble = scope.padFixedLength(20, 3);
    expect(fixedDouble).toBe('020');

    var fixedTriple = scope.padFixedLength(300, 3);
    expect(fixedTriple).toBe('300');
  }));

  it('should not pad NaNs', inject(function() {
    var notANumber = scope.padFixedLength('string', 3);
    expect(notANumber).toBe('string');
  }));

  it('should get an appropriate wallpaper video', inject(function() {
    var video = scope.getWallpaperVideoSource(5);
    expect(video).toBe('img/wallpapers/webm/005.webm');
  }));

  it('should get an appropriate wallpaper image', inject(function() {
    var image = scope.getWallpaperImageSource(5);
    expect(image).toBe('img/wallpapers/png/005.png');
  }));

  it('should load the wallpapers into scope', inject(function() {
    scope.getWallpapers([0,21], [0,32]);

    expect(scope.videoSources.length).toBe(22);
    expect(scope.imageSources.length).toBe(33);
  }));
});