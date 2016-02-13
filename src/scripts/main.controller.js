(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    function MainController($scope, dict) {
        dict.define('rent')
            .then(function(data) {
                $scope.test = data;
            }, function(data) {
                alert(data);
            });
    }
})();
