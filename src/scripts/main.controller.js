(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    function MainController(dict, $location, $routeParams) {
        var vm = this;

        vm.preloadComplete = false;
        vm.worddefs = [];
        vm.newWord = '';
        vm.delWord = delWord;
        vm.errorIsVisible = false;
        vm.errorMsg = '';

        vm.define = define;
        vm.getWord = getWord;
        vm.getDefs = getDefs;
        vm.hideError = hideError;
        vm.viewSingleWord = viewSingleWord;
        vm.viewWords = viewWords;

        activate();

        // Loads a few startup definitions into the model
        function activate() {
            dict.defineMultiple(['rent', 'apartment', 'dominion', 'enterprise', 'angular', 'JavaScript'])
                .then(function(dataArr) {
                    for(var i = 0; i < dataArr.length; ++i) {
                        handleNewWord(dataArr[i]);
                    }
                    vm.preloadComplete = true;
                }, function(data) {
                    vm.errorMsg = data;
                    vm.errorIsVisible = true;
                });
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
                    handleNewWord(data);
                }, function(data) {
                    vm.errorMsg = data;
                    vm.errorIsVisible = true;
                });
        }

        function handleNewWord(data) {
            if(0 === data.definitions.length) {
                vm.errorMsg = 'No definitions found...';
                vm.errorIsVisible = true;
            }
            else {
                vm.worddefs.unshift(data);
                vm.errorIsVisible = false;
            }
        }

        // Returns the currently selected word
        function getWord() {
            return $routeParams.word;
        }

        // Returns the definitions of the selected word
        function getDefs() {
            var word = $routeParams.word;
            var worddefs = vm.worddefs.filter(function(val) { return val.word === word; });

            if(0 !== worddefs.length) return worddefs[0].definitions;

            vm.errorMsg = 'Word "' + word + '" has not yet been defined.';
            vm.errorIsVisible = true;
            viewWords();
        }

        // Hides the error message
        function hideError() {
            vm.errorIsVisible = false;
            vm.errorMsg = '';
        }

        // Shows the definitions view
        function viewSingleWord(idx) {
            $location.path('/word/' + vm.worddefs[idx].word);
        }

        // Shows the words view
        function viewWords() {
            $location.path('/');
        }
    }
})();
