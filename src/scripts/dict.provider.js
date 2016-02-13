(function() {
    'use strict';

    angular
        .module('app')
        .provider('dict', DictProvider);

    function DictProvider() {
        var dict = this;
        var baseUrl = 'https://montanaflynn-dictionary.p.mashape.com/define';

        this.$get = function($http, $q) {
            return {
                define: function(word) {
                    var deferred = $q.defer();

                    $http({
                        method: 'GET',
                        url: baseUrl + '?word=' + word,
                        headers: {
                            'X-Mashape-Key': dict.API_KEY
                        }
                    }).success(function(data) {
                        deferred.resolve(data);
                    }).error(function() {
                        deferred.reject('There was an error.');
                    });

                    return deferred.promise;
                }
            };
        }
    }
})();
