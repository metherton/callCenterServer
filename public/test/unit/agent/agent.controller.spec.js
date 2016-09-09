'use strict';

describe('Controller: AgentController', function() {

    beforeEach(module('callCenterApp'));

    var AgentController, $httpBackend, sessionFactory, mockTwilioWorkerFactory;

    beforeEach(inject(function($controller, _$httpBackend_, _sessionFactory_) {

        $httpBackend = _$httpBackend_;
        sessionFactory = _sessionFactory_;

        mockTwilioWorkerFactory = {};

        $httpBackend.expectGET('http://localhost:3001/api/agents/session').respond({configuration: 'myconfig', tokens: {}});

        AgentController = $controller('AgentController', {
            sessionFactory: sessionFactory,
            twilioWorkerFactory: mockTwilioWorkerFactory
        });

        $httpBackend.flush();
    }));

    it('should call session api on initialization', function() {

        expect(AgentController.configuration).toBe('myconfig');
        expect(AgentController.workerJS).toBeDefined();
    });

});
