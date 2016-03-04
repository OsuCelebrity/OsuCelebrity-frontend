'use strict';

describe('leaderboard controller', function(){
  beforeEach(module('osuCelebrity'));

  var $interval, scope, controller, mockQueueService;
  var mocks = {};

  angular.module('LeaderboardIntervalMockModule', []).factory('$interval', function(){
      $interval = jasmine.createSpy();
      mocks.$interval = $interval;
      return $interval;
  });
  beforeEach(module('LeaderboardIntervalMockModule'));

  beforeEach(inject(function($q) {
    mockQueueService = jasmine.createSpyObj('QueueService', ['query']);
    mockQueueService.query.and.callFake(function(success) {
      success({"mock": true});
    });
  }));

  beforeEach(inject(function($rootScope, $controller, _$interval_) {
      scope = $rootScope.$new();
      $interval = _$interval_;

      controller = $controller('LeaderboardController', {'$scope': scope, 'QueueService': mockQueueService});
  }));

  it('should define the leaderboard controller', inject(function() {
    expect(controller).toBeDefined();
  }));

  it('should start the update interval', inject(function(INTERVALS) {
    controller.startLink();
    expect(mocks.$interval).toHaveBeenCalledWith(jasmine.any(Function), INTERVALS.LEADERBOARD);
  }));

  it('should be making update queries', inject(function() {
    controller.updateQueue();
    
    expect(mockQueueService.query).toHaveBeenCalled();
    expect(scope.queue).toEqual(jasmine.objectContaining({"mock": true}));
  }));
});