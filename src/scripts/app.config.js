(function() {
    'use strict';

    angular
        .module('app')
        .config(AppConfig);

    function AppConfig($routeProvider, dictProvider) {
        $routeProvider
            .when('/', { templateUrl: 'partials/words.html' })
            .when('/word/:word', { templateUrl: 'partials/single-word.html' })
            .otherwise({ redirectTo: '/' });
    }
})();
