'use strict';

angular.module('callCenterApp')
    .constant("baseURL","http://localhost:3001/")

    .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

            this.getDishes = function(){
                return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
            };

            this.getPromotions = function(){
                return $resource(baseURL+"promotions/:id",null,  {'update':{method:'PUT' }});
            };

        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {

            var corpfac = {};

            corpfac.getLeaders = function(){
                return $resource(baseURL+"leadership/:id",null,  {'update':{method:'PUT' }});
            };

            return corpfac;
        }])
        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {

            return $resource(baseURL +"feedback/:id", null);
        }])
        .factory('loginFactory', ['$resource', 'baseURL', function($resource, baseURL) {
            return $resource(baseURL +"api/agents/login/:id", null);
        }])
        .factory('validationFactory', ['$resource', 'baseURL', function($resource,baseURL) {
            return $resource(baseURL + 'api/setup/validate', null);
        }])
        .factory('sessionFactory', ['$resource', 'baseURL', function($resource,baseURL) {
            return $resource(baseURL + 'api/agents/session', null);
        }])

;
