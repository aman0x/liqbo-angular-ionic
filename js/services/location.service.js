/**
 *  Location Service
 */
angular.module('lcboApp.services')
    .factory('LocationService', ['$q', function($q) {

        var getLocation = function() {
            var q = $q.defer();

            navigator.geolocation.getCurrentPosition(function(position) {
                q.resolve(position);
            }, function(error) {
                q.reject(error);
            });

            return q.promise;
        }

        return {
            getLocation: getLocation
        }
    }]);

