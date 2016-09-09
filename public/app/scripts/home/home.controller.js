'use strict';

angular.module('callCenterApp')

        // implement the IndexController and About Controller here
        .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'validationFactory', function($scope, menuFactory, corporateFactory, validationFactory) {

            var vm = this;
            var hasValidSetup = false;
            var validating = true;

            vm.hasValidSetup = function() {
                return hasValidSetup;
            };

            vm.isValidating = function() {
                return validating;
            };

            validationFactory.get({}, function onSuccess(response) {
                hasValidSetup = true;
                validating = false;
            }, function onError(response) {
                hasValidSetup = false;
                validating = false;
            });


        }])

;
