(function() {
    'use strict';

    angular
        .module('app')
        .config(AppConfig);

    function AppConfig(dictProvider) {
        dictProvider.API_KEY = '5rrntZBYlimshv64X1LExFGk9Enep1rW8pyjsnlKIep0iNSo34';
    }
})();
