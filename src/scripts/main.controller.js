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
        vm.showError = false;
        vm.errorMsg = '';

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
                    if(0 ==data.definitions.length) {
                        vm.errorMsg = 'No definitions found for "' + newWord + '"';
                        vm.showError = true;
                    }
                    else {
                        data.word = newWord;
                        vm.worddefs.push(data);
                        vm.showError = false;
                    }
                }, function(data) {
                    vm.errorMsg = data;
                    vm.showError = true;
                });
        }
    }
})();
