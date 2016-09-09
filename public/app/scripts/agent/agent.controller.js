'use strict';

angular.module('callCenterApp')
    .controller('AgentController', ['sessionFactory', function(sessionFactory) {

    var vm = this;

    sessionFactory.get({}, function onSuccess(response) {
        console.log('respon',response);
        vm.configuration = response && response.configuration;
        console.log('vmconfi',vm.configuration);
        initWorker(response.tokens.worker);
    });

    function initWorker(token) {
        /* create TaskRouter Worker */
        vm.workerJS = new Twilio.TaskRouter.Worker(token, true, vm.configuration.twilio.workerIdleActivitySid, vm.configuration.twilio.workerOfflineActivitySid);
        console.log('vmworker', vm.workerJS);
    }


//        $scope.initWorker = function(token) {


            /* create TaskRouter Worker */
        //    $scope.workerJS = new Twilio.TaskRouter.Worker(token, true, $scope.configuration.twilio.workerIdleActivitySid, $scope.configuration.twilio.workerOfflineActivitySid);
        //
        //    $scope.workerJS.on('ready', function(worker) {
        //
        //        $log.log('TaskRouter Worker: ready');
        //
        //        $scope.worker = worker;
        //
        //    });
        //
        //    $scope.workerJS.on('reservation.created', function(reservation) {
        //
        //        $log.log('TaskRouter Worker: reservation.created');
        //        $log.log(reservation);
        //
        //        $scope.reservation = reservation;
        //        $scope.$apply();
        //
        //        $scope.startReservationCounter();
        //
        //    });
        //
        //    $scope.workerJS.on('reservation.accepted', function(reservation) {
        //
        //        $log.log('TaskRouter Worker: reservation.accepted');
        //        $log.log(reservation);
        //
        //        $scope.task = reservation.task;
        //        $scope.task.completed = false;
        //        $scope.reservation = null;
        //        $scope.stopReservationCounter();
        //
        //        $scope.$apply();
        //
        //    });
        //
        //    $scope.workerJS.on('reservation.timeout', function(reservation) {
        //
        //        $log.log('TaskRouter Worker: reservation.timeout');
        //        $log.log(reservation);
        //
        //        /* reset all data */
        //        $scope.reservation = null;
        //        $scope.task = null;
        //        $scope.$apply();
        //
        //    });
        //
        //    $scope.workerJS.on('reservation.rescinded', function(reservation) {
        //
        //        $log.log('TaskRouter Worker: reservation.rescinded');
        //        $log.log(reservation);
        //
        //        /* reset all data */
        //        $scope.reservation = null;
        //        $scope.task = null;
        //        $scope.$apply();
        //
        //    });
        //
        //    $scope.workerJS.on('reservation.canceled', function(reservation) {
        //
        //        $log.log('TaskRouter Worker: reservation.cancelled');
        //        $log.log(reservation);
        //
        //        $scope.reservation = null;
        //        $scope.task = null;
        //        $scope.$apply();
        //
        //    });
        //
        //    $scope.workerJS.on('activity.update', function(worker) {
        //
        //        $log.log('TaskRouter Worker: activity.update');
        //        $log.log(worker);
        //
        //        $scope.worker = worker;
        //        $scope.$apply();
        //
        //    });
        //
        //    $scope.workerJS.on('token.expired', function() {
        //
        //        $log.log('TaskRouter Worker: token.expired');
        //
        //        $scope.reservation = null;
        //        $scope.task = null;
        //        $scope.$apply();
        //
        //        /* the worker token expired, the agent shoud log in again, token is generated upon log in */
        //        window.location.replace('/callcenter/');
        //
        //    });
        //
        //};

}]);
