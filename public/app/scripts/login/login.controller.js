'use strict';

angular.module('callCenterApp')
        .controller('LoginController', ['$state', 'loginFactory', '$location', '$window', function($state, loginFactory, $location, $window) {

            var vm = this;
            vm.loginDetails = {
                worker: {
                    friendlyName: "",
                    endpoint: navigator.userAgent.toLowerCase() + Math.floor((Math.random() * 1000) + 1)
                }
            };

            vm.doLogin = function() {
                loginFactory.save(vm.loginDetails, function() {
                    //$window.location.replace('http://localhost:3000/#/agent');
                        $state.go('app.agent');
           //         $location.url('/agent');
                });
                //    $http.post('/api/agents/login', { worker: $scope.worker, endpoint: endpoint })
            };
        }]);
