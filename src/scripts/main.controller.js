(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    function MainController(dict) {
        var vm = this;
        vm.worddefs = [];
        vm.newWord = '';
        vm.delWord = delWord;
        vm.define = define;
        vm.errorIsVisible = false;
        vm.errorMsg = '';
        vm.hideError = hideError;

        activate();

        // Loads a few startup definitions into the model
        function activate() {
            var startupWords = ['rent', 'apartment', 'dominion', 'enterprise', 'angular', 'javascript'];
            for(var i = 0; i < startupWords.length; ++i) {
                vm.newWord = startupWords[i];
                define();
            }
        }

        // Deletes a word from the list
        function delWord(idx) {
            vm.worddefs.splice(idx, 1);
        }

        // Attempts to retrieve a definition from the Dictionary provider
        function define() {
            var newWord = vm.newWord;
            vm.newWord = '';

            dict.define(newWord)
                .then(function(data) {
                    if(0 ==data.definitions.length) {
                        vm.errorMsg = 'No definitions found for "' + newWord + '"';
                        vm.errorIsVisible = true;
                    }
                    else {
                        data.word = newWord;
                        vm.worddefs.push(data);
                        vm.errorIsVisible = false;
                    }
                }, function(data) {
                    vm.errorMsg = data;
                    vm.errorIsVisible = true;
                });
        }

        // Hides the error message
        function hideError() {
            vm.errorIsVisible = false;
            vm.errorMsg = '';
        }
    }
})();
