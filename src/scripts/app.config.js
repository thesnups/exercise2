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

        dictProvider.API_KEY = '5rrntZBYlimshv64X1LExFGk9Enep1rW8pyjsnlKIep0iNSo34';
    }
})();
