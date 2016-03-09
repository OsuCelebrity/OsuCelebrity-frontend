'use strict';

describe('vote service', function(){

  beforeEach(module('osuCelebrity'));

  var VoteService;
  beforeEach(inject(function(_VoteService_) {
    VoteService = _VoteService_;
  }));

  afterEach(inject(function($httpBackend){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('should be defined', function() {
    expect(!!VoteService).toBe(true);
  });

  it('should return a vote object array', inject(function(ENDPOINTS, $httpBackend) {
    expect(VoteService.query).toBeDefined();

    $httpBackend.expectGET(ENDPOINTS.VOTES).respond(
      [
        {
          "id": 2,
          "command": "!dankerino",
          "twitchUser": "tillerino",
          "voteTime": 1,
          "voteType": "UP"
        },
        {
          "id": 3,
          "command": "!nowdank",
          "twitchUser": "redback",
          "voteTime": 2,
          "voteType": "UP"
        }
      ]
    );

    var res = VoteService.query();
    $httpBackend.flush();

    expect(res.length).toBe(2);
    expect(res[0].id).toBe(2);
    expect(res[1].id).toBe(3);
  }));

});