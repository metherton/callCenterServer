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


}]);
