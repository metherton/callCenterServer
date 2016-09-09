'use strict';

describe('Controller: LoginController', function() {

    beforeEach(module('callCenterApp'));

    var LoginController, $httpBackend, mockState, loginFactory;

    beforeEach(inject(function($controller, _$httpBackend_, _loginFactory_) {

        $httpBackend = _$httpBackend_;
        loginFactory = _loginFactory_;

        mockState = {
            go: jasmine.createSpy('location')
        };

        LoginController = $controller('LoginController', {
            loginFactory: loginFactory,
            $state: mockState
        });

    }));

    it('should try to login', function() {
        $httpBackend.expectPOST('http://localhost:3001/api/agents/login').respond({});
        LoginController.doLogin();
        $httpBackend.flush();
        expect(mockState.go).toHaveBeenCalled();
    });

});
