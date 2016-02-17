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

            // Function: hitApi
            // Description: Requests the definitions of <word> from the API
            // Returns: A promise object that will resolve when the response is received
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
                    deferred.reject('There was an error loading the data.');
                });

                return deferred.promise;
            }

            // Function: define
            // Description: Looks inside cache for word. Hits the API if not found
            // Returns: A promise object that will resolve when the response is received
            var define = function(word) {
                if(promiseCache.hasOwnProperty(word)) {
                    $log.log('Returning word "' + word + '" from cache.');
                    return promiseCache[word];
                }

                var promise = hitApi(word);
                promiseCache[word] = promise;

                $log.log('Retrieving word "' + word + '" from API.');

                return promise;
            }

            // Function: defineMultiple
            // Description: Defines multiple words (from cache or API)
            // Returns: A promise that will resolve when all responses have been received
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
