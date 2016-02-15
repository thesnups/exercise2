(function() {
    'use strict';

    angular
        .module('app')
        .provider('dict', DictProvider);

    function DictProvider() {
        this.$get = function($http, $q, $log) {
            var dict = this;
            var defCache = {};
            var baseUrl = 'https://montanaflynn-dictionary.p.mashape.com/define';

            // Requests the definitions of <word> from the API
            var hitApi = function(word) {
                var deferred = $q.defer();

                $http({
                    method: 'get',
                    url: baseUrl,
                    params: {
                        word: word
                    },
                    headers: {
                        'X-Mashape-Key': dict.API_KEY
                    },
                    responseType: 'json'
                }).success(function(data) {
                    deferred.resolve(data);
                }).error(function() {
                    deferred.reject('There was an error.');
                });

                return deferred.promise;
            }

            // Tries to pull word definition from cache, hits the API if not found
            var define = function(word) {
                if(defCache.hasOwnProperty(word)) {
                    $log.log('Word "' + word + '" retrieved from cache.');
                    return defCache[word];
                }

                var newWord = hitApi(word);
                defCache[word] = newWord;

                $log.log('Word "' + word + '" retrieved from API.');

                return newWord;
            }

            return {
                define: define
            };
        }
    }
})();
