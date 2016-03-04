'use strict';

describe('user info directive', function(){

  var $compile, $rootScope, element, UserInfoLink;

  beforeEach(module('osuCelebrity'));
  beforeEach(module('templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _UserInfoLink_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    UserInfoLink = _UserInfoLink_;

    element = $compile("<osuceleb-user-info></osuceleb-user-info>")($rootScope);
    $rootScope.$digest();
  }));

  it('replaces the element with the appropriate content', function() {
    expect(element.html()).toContain('<div class="userinfo-wrapper">');
  });

  it('starts the link to the controller', function() {
    var mockCtrl = jasmine.createSpyObj('LinkCtrl', ['startLink']);

    UserInfoLink(null, element, null, mockCtrl);
    expect(mockCtrl.startLink).toHaveBeenCalled();
  });

  it('should understand the idle attribute', inject(function(UserInfoTemplateUrl) {
    //Simulate passing the attribute
    var templateUrl = UserInfoTemplateUrl(null, {"idle": ""});

    expect(templateUrl).toContain('.idle.html');
  }));

});