(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    function MainController(dict, $location, $routeParams) {
        var vm = this;

        // All words view
        vm.preloadComplete = false;
        vm.definitionLoading = false;
        vm.worddefs = [];
        vm.newWord = '';
        vm.delWord = delWord;
        vm.errorIsVisible = false;
        vm.errorMsg = '';

        vm.showError = showError;
        vm.hideError = hideError;
        vm.viewSingleWord = viewSingleWord;
        vm.defineBtnClicked = defineBtnClicked;
        

        // Single word view
        vm.selectedWord;
        vm.selectedDefs;
        vm.viewWords = viewWords;

        activate();

        // Function: activate
        // Description: Loads a few startup definitions into the model
        function activate() {
            dict.defineMultiple(['rent', 'dominion', 'enterprise', 'angular']) // TODO: handle preloading of undefined words
                .then(function(dataArr) {
                    for(var i = 0; i < dataArr.length; ++i) {
                        handleNewWord(dataArr[i]);
                    }
                    vm.preloadComplete = true;
                }, function(data) {
                    showError(data);
                    vm.preloadComplete = true;
                });
        }

        // Function: delWord
        // Description: Deletes a word from the model
        function delWord(idx) {
            vm.worddefs.splice(idx, 1);
        }

        // Function: defineBtnClicked
        // Description: Retrieves a definition from the Dictionary provider and adds it 
        //  to the model. Displays an error message on failure
        function defineBtnClicked(newWord) {
            vm.definitionLoading = true;

            dict.define(vm.newWord)
                .then(function(data) {
                    handleNewWord(data);
                    vm.newWord = '';
                    vm.definitionLoading = false;
                }, function(data) {
                    showError(data);
                    vm.definitionLoading = false;
                });
        }

        // Function: handleNewWord
        // Description: Adds a word and it's definitions to the model or displays an error
        //  message if no definitions were found for the word
        function handleNewWord(data) {
            vm.worddefs.unshift(data);
            hideError();
        }

        // Function: getWord
        // Description: Returns the currently selected word for the single word view
        function getWord() {
            return $routeParams.word;
        }

        // Function: showError
        // Description: Displays an error message
        function showError(errorMsg) {
            vm.errorMsg = errorMsg;
            vm.errorIsVisible = true;
        }

        // Function: hideError
        // Description: Hides the error message
        function hideError() {
            vm.errorIsVisible = false;
            vm.errorMsg = '';
        }

        // Function: viewSingleWord
        // Description: Shows the definitions view
        function viewSingleWord(idx) {
            vm.selectedWord = vm.worddefs[idx].word;
            var worddefs = vm.worddefs.filter(function(val) { return val.word === vm.selectedWord; });
            vm.selectedDefs = worddefs[0].definitions;

            // Set the route
            $location.path('/word/' + vm.worddefs[idx].word);
        }

        // Function: viewWords
        // Description: Shows the words view
        function viewWords() {
            $location.path('/');
        }
    }
})();
