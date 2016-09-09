'use strict';

angular.module('callCenterApp')
    .controller('AgentController', ['sessionFactory', '$log', '$scope', '$state', function(sessionFactory, $log, $scope, $state) {

    var vm = this;

    sessionFactory.get({}, function onSuccess(response) {
        vm.configuration = response && response.configuration;
        initWorker(response.tokens.worker);
    });

    function initWorker(token) {
        /* create TaskRouter Worker */
        vm.workerJS = new Twilio.TaskRouter.Worker(token, true, vm.configuration.twilio.workerIdleActivitySid, vm.configuration.twilio.workerOfflineActivitySid);

        vm.reservation = null;
        vm.task = null;

        vm.workerJS.on('ready', function(worker) {
            $log.log('TaskRouter Worker: ready');
            vm.worker = worker;
        });

        vm.workerJS.on('reservation.created', function(reservation) {

            $log.log('TaskRouter Worker: reservation.created');
            $log.log(reservation);

            vm.reservation = reservation;
            $scope.$apply();
            vm.startReservationCounter();
        });

        vm.workerJS.on('reservation.accepted', function(reservation) {

            $log.log('TaskRouter Worker: reservation.accepted');
            $log.log(reservation);

            vm.task = reservation.task;
            vm.task.completed = false;
            vm.reservation = null;
            vm.stopReservationCounter();

            $scope.$apply();

        });

        vm.workerJS.on('reservation.timeout', function(reservation) {

            $log.log('TaskRouter Worker: reservation.timeout');
            $log.log(reservation);

            /* reset all data */
            vm.reservation = null;
            vm.task = null;
            $scope.$apply();
        });

        vm.workerJS.on('reservation.rescinded', function(reservation) {

            $log.log('TaskRouter Worker: reservation.rescinded');
            $log.log(reservation);

            /* reset all data */
            vm.reservation = null;
            vm.task = null;
            $scope.$apply();
        });

        vm.workerJS.on('reservation.canceled', function(reservation) {

            $log.log('TaskRouter Worker: reservation.cancelled');
            $log.log(reservation);

            vm.reservation = null;
            vm.task = null;
            $scope.$apply();

        });

        vm.workerJS.on('activity.update', function(worker) {

            $log.log('TaskRouter Worker: activity.update');
            $log.log(worker);

            vm.worker = worker;
            $scope.$apply();
        });

        vm.workerJS.on('token.expired', function() {

            $log.log('TaskRouter Worker: token.expired');

            vm.reservation = null;
            vm.task = null;
            $scope.$apply();

            /* the worker token expired, the agent shoud log in again, token is generated upon log in */
            $state.go('app.login');

        });
    }

    vm.acceptReservation = function (reservation) {

        $log.log('accept reservation with TaskRouter Worker JavaScript SDK');

        /* depending on the typ of taks that was created we handle the reservation differently */
        if(reservation.task.attributes.channel == 'chat'){

            reservation.accept(

                function(err, reservation) {

                    if(err) {
                        $log.error(err);
                        return;
                    }

                    $scope.$broadcast('ActivateChat', { channelSid: reservation.task.attributes.channelSid });

                });

        }

        if(reservation.task.attributes.channel == 'phone' && reservation.task.attributes.type == 'Inbound call'){

            $log.log('dequeue reservation with  callerId: ' + vm.configuration.twilio.callerId);
            reservation.dequeue(vm.configuration.twilio.callerId);

        }

        /* we accept the reservation and initiate a call to the customer's phone number */
        if(reservation.task.attributes.channel == 'phone' && reservation.task.attributes.type == 'Callback request'){

            reservation.accept(

                function(err, reservation) {

                    if(err) {
                        $log.error(err);
                        return;
                    }

                    $scope.$broadcast('CallPhoneNumber', { phoneNumber: reservation.task.attributes.phone });

                }
            );
        }
    };

    vm.complete = function (reservation) {

        if(vm.task.attributes.channel == 'chat'){
            $scope.$broadcast('DestroyChat');
        }

        vm.workerJS.update('ActivitySid', vm.configuration.twilio.workerIdleActivitySid, function(err, worker) {

            if(err) {
                $log.error(err);
                return;
            }

            vm.reservation = null;
            vm.task = null;
            $scope.$apply();

        });

    };

    vm.logout = function () {

        $http.post('/api/agents/logout')

            .then(function onSuccess(response) {

                window.location.replace('/callcenter/index.html');

            }, function onError(response) {

                $log.error(response);

            });

    };

    vm.startReservationCounter = function() {

        $log.log('start reservation counter');
        vm.reservationCounter = vm.reservation.task.age;

        vm.reservationInterval = $interval(function() {
            vm.reservationCounter++;
        }, 1000);

    };

    vm.stopReservationCounter = function() {

        if (angular.isDefined(vm.reservationInterval)) {
            $interval.cancel(vm.reservationInterval);
            vm.reservationInterval = undefined;
        }

    };



}]);
