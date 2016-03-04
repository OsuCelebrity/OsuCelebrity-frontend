'use strict';

describe('queue service', function(){

  beforeEach(module('osuCelebrity'));

  afterEach(inject(function($httpBackend){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('should return a queue object', inject(function(ENDPOINTS, $httpBackend, QueueService) {
    var queue = new QueueService();

    $httpBackend.expectGET(ENDPOINTS.QUEUE).respond(200, JSON.stringify(
      {
        userId: 456788,
        name: "Admirable",
        timeInQueue: "14:25",
        votes: "0"
      }
    ));

    queue.$get();
    $httpBackend.flush();

    expect(queue.name).toBe('Admirable');
  }));

});