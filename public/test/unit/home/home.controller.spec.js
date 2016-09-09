'use strict';

describe('Controller: IndexController', function() {

    beforeEach(module('callCenterApp'));

    var IndexController, scope, $httpBackend;

    beforeEach(inject(function($controller, _$httpBackend_, $rootScope, menuFactory, corporateFactory) {

        $httpBackend = _$httpBackend_;

        $httpBackend.expectGET('http://localhost:3001/api/setup/validate').respond({});


        scope = $rootScope.$new();
        IndexController = $controller('IndexController', {
           $scope: scope,
           menuFactory: menuFactory,
           corporateFactory: corporateFactory
        });
        expect(IndexController.isValidating()).toBeTruthy();
        $httpBackend.flush();
    }));

    it('should validate setup', function() {
        expect(IndexController.isValidating()).toBeFalsy();
        expect(IndexController.hasValidSetup()).toBeTruthy();
    });

});
