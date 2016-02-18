(function() {
    'use strict';

    angular
        .module('app')
        .directive('ngEnter', ngEnterDirective);

    // Directive: ngEnter
    // Description: Evaluates an expression when the user presses return with the
    //  ng-enter element focused. Similar to ng-click, ng-dblclick, etc.
    // Credit: https://gist.github.com/EpokK/5884263
    function ngEnterDirective() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    }
})();
