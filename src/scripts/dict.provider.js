(function() {
    'use strict';

    angular
        .module('app')
        .provider('dict', DictProvider);

    function DictProvider() {
        this.$get = function($http, $q, $log) {
            var dict = this;
            var wordCache = {};
            var baseUrl = 'https://montanaflynn-dictionary.p.mashape.com/define';

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

            var define = function(word) {
                if(wordCache.hasOwnProperty(word)) {
                    $log.log('Word "' + word + '" retrieved from cache.');
                    return wordCache[word];
                }

                var newWord = hitApi(word);
                wordCache[word] = newWord;

                $log.log('Word "' + word + '" retrieved from API.');

                return newWord;
            }

            return {
                define: define
            };
        }
    }
})();
