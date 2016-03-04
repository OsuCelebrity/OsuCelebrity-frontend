'use strict';

describe('current service', function(){

  beforeEach(module('osuCelebrity'));

  afterEach(inject(function($httpBackend){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it('should return a current object', inject(function(ENDPOINTS, $httpBackend, CurrentService) {
    var current = new CurrentService();

    $httpBackend.expectGET(ENDPOINTS.CURRENT).respond(200, JSON.stringify({
      accuracy: 98.27983093261719,
      beatmap: "Petit Rabbit's - Takarabako no Jet Coaster [Jet Coaster]",
      country: "CA",
      gameMode: 0,
      health: 0.9847166666666667,
      id: 3687489,
      level: 101.208,
      name: "ChronoTrig",
      nextPlayer: "uyghti",
      playCount: 104387,
      playingFor: "0:06",
      pp: 7580.73,
      queueSize: 7,
      rank: 175,
      source: "auto",
      votes: [ ]
    }));

    current.$get();
    $httpBackend.flush();

    expect(current.name).toBe('ChronoTrig');
  }));

});