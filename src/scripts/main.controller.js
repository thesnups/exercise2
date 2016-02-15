(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    function MainController(dict) {
        var vm = this;
        vm.words = {};
        vm.define = define;

        activate();

        function activate() {
            var startupWords = ['rent', 'apartment', 'dominion', 'enterprise', 'angular', 'javascript'];
            for(var i = 0; i < startupWords.length; ++i) {
                define(startupWords[i])
            }
        }

        function define(word) {
            dict.define(word)
                .then(function(data) {
                    vm.words[word] = data;
                }, function(data) {
                    alert(data);
                });
        }
    }
})();
