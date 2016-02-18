(function() {
    'use strict';

    angular
        .module('app')
        .provider('dict', DictProvider);

    function DictProvider() {
        this.$get = function($http, $q, $log) {
            var dict = this;
            var promiseCache = {};
            var baseUrl = 'http://api.pearson.com/v2/dictionaries/entries';

            var isArray = function(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }

            // Function: hitApi
            // Description: Requests the definitions of <word> from the API
            // Returns: A promise object that will resolve when the response is received
            var hitApi = function(word) {
                var deferred = $q.defer();

                $http({
                    method: 'get',
                    url: baseUrl,
                    params: {
                        headword: word
                    },
                    responseType: 'json'
                }).success(function(data) {
                    if(200 != data.status) {
                        deferred.reject('There was an error loading the data.');
                    }
                    else if(0 == data.count) {
                        deferred.reject('No definitions found for "' + word + '".');
                    }

                    // Extract definitions from API response
                    var definitions = [];

                    for(var i = 0; i < data.results.length; ++i) {
                        var result = data.results[i];
                        if(result.hasOwnProperty("senses") && isArray(result.senses) && 0 !== result.senses.length) {
                            var sense = result.senses[0];

                            if(sense.hasOwnProperty("definition")) {
                                var def = sense.definition;

                                // definition property returned from API could be an array of strings or a single string
                                if(isArray(def)) {
                                    for(var j = 0; j < def.length; ++j) {
                                        definitions.push(def[j]);
                                    }
                                }
                                else {
                                    definitions.push(def);
                                }
                            }
                        }
                    }

                    // Remove duplicate definitions (they interfere with ng-repeat)
                    var seen = {};
                    definitions = definitions.filter(function(def) {
                        return seen.hasOwnProperty(def) ? false : (seen[def] = true);
                    });

                    // Return the result object
                    if(0 !== definitions.length) deferred.resolve({ word: word, definitions: definitions });
                    else deferred.reject('No definitions found for "' + word + '".');
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

                $log.log('Retrieving word "' + word + '" from API.');
                var promise = hitApi(word);

                // Cache the promise if it returns successfully
                promise.then(function(data) {
                    promiseCache[word] = promise;
                });

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
