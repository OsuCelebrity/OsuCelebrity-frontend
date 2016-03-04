'use strict';

describe('userinfo controller', function(){
  beforeEach(module('osuCelebrity'));

  var $interval, scope, controller, mockCurrentService;
  var mocks = {};

  angular.module('UserInfoIntervalMockModule', []).factory('$interval', function(){
      $interval = jasmine.createSpy();
      mocks.$interval = $interval;
      return $interval;
  });
  beforeEach(module('UserInfoIntervalMockModule'));

  beforeEach(inject(function($q) {
    mockCurrentService = jasmine.createSpyObj('CurrentService', ['get']);
    mockCurrentService.get.and.callFake(function(data, success) {
      success({"mock": true});
    });
  }));

  beforeEach(inject(function($rootScope, $controller, _$interval_) {
      scope = $rootScope.$new();
      $interval = _$interval_;

      controller = $controller('UserInfoController', {'$scope': scope, 'CurrentService': mockCurrentService});
  }));

  it('should define the user info controller', inject(function() {
    expect(controller).toBeDefined();
  }));

  it('should start the update interval', inject(function(INTERVALS) {
    controller.startLink();
    expect(mocks.$interval).toHaveBeenCalledWith(jasmine.any(Function), INTERVALS.USER_INFO);
  }));

  it('should be making update queries', function() {
    controller.updateCurrent();
    
    expect(mockCurrentService.get).toHaveBeenCalled();
    expect(scope.current).toEqual(jasmine.objectContaining({"mock": true}));
  });

  it('should be changing the mode icon', function() {
    var returnMode = 0;

    mockCurrentService.get.and.callFake(function(data, success) {
      success({"mock": true, "gameMode": returnMode});
    });

    //Standard
    controller.updateCurrent();
    expect(scope.modeIcon).toEqual("icon-standard");

    //Taiko
    returnMode = 1;
    controller.updateCurrent();
    expect(scope.modeIcon).toEqual("icon-taiko");

    //CtB
    returnMode = 2;
    controller.updateCurrent();
    expect(scope.modeIcon).toEqual("icon-ctb");

    //Mania
    returnMode = 3;
    controller.updateCurrent();
    expect(scope.modeIcon).toEqual("icon-mania");
  });
});