'use strict';

describe('leaderboard directive', function(){

  var $compile, $rootScope, element, LeaderboardLink;

  beforeEach(module('osuCelebrity'));
  beforeEach(module('templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _LeaderboardLink_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    LeaderboardLink = _LeaderboardLink_;

    element = $compile("<osuceleb-leaderboard></osuceleb-leaderboard>")($rootScope);
    $rootScope.$digest();
  }));

  it('replaces the element with the appropriate content', function() {
    expect(element.html()).toContain('<table id="leaderboard">');
  });

  it('starts the link to the controller', function() {
    var mockCtrl = jasmine.createSpyObj('LinkCtrl', ['startLink']);

    LeaderboardLink(null, element, null, mockCtrl);
    expect(mockCtrl.startLink).toHaveBeenCalled();
  });

});