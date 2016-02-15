(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    function MainController(dict) {
        var vm = this;
        vm.worddefs = [];
        vm.newWord = '';
        vm.define = define;

        activate();

        function activate() {
            var startupWords = ['rent', 'apartment', 'dominion', 'enterprise', 'angular', 'javascript'];
            for(var i = 0; i < startupWords.length; ++i) {
                vm.newWord = startupWords[i];
                define();
            }
        }

        function define() {
            var newWord = vm.newWord;
            vm.newWord = '';
            
            dict.define(newWord)
                .then(function(data) {
                    data.word = newWord;
                    vm.worddefs.push(data);
                }, function(data) {
                    alert(data);
                });
        }
    }
})();
