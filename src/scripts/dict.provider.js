(function() {
    'use strict';

    angular
        .module('app')
        .provider('dict', DictProvider);

    function DictProvider() {
        this.$get = function($http, $q, $log) {
            var dict = this;
            var promiseCache = {};
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
                    data.word = word; // Add the defined word to response object
                    deferred.resolve(data);
                }).error(function() {
                    deferred.reject('There was an error.');
                });

                return deferred.promise;
            }

            // Tries to pull word definition from cache, hits the API if not found
            var define = function(word) {
                if(promiseCache.hasOwnProperty(word)) {
                    $log.log('Word "' + word + '" retrieved from cache.');
                    return promiseCache[word];
                }

                var promise = hitApi(word);
                promiseCache[word] = promise;

                $log.log('Word "' + word + '" retrieved from API.');

                return promise;
            }

            // Tries to pull multiple word definitions from cache, hits the API if not found
            var defineMultiple = function(words) {
                var promises = [];

                for(var i = 0; i < words.length; ++i) {
                    promises.push(define(words[i]));
                }

                return $q.all(promises);
            }

            return {
                define: define,
                defineMultiple: defineMultiple
            };
        }
    }
})();
