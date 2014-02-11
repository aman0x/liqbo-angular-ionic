/**
 *  Stores: Request Service
 */
angular.module('lcboApp.services')
    .factory('StoresService', ['$http', 'escapeFilter', '$ionicLoading', '$rootScope',
        function($http, escapeFilter, $ionicLoading, $rootScope) {

        $http.defaults.useXDomain = true;

        /**
         *  Gets a list of stores using a coordinates parameter
         *
         *  @method getStoresByLocation
         *
         *  @param  {Object} coords Latitude and Longitude of the lookup origin
         *
         *  @return {Object} $http promise object
         */
        var getStoresByLocation = function() {
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/stores.js',
                params: {
                    callback: 'JSON_CALLBACK',
                    per_page: 10,
                    lat: $rootScope.user.latitude,
                    lon: $rootScope.user.longitude
                }
            });
        }

        var checkConnection = function() {
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/products.js',
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
        }

        /**
         *  Finds a stores details by passing the id of the store
         *
         *  @method getStoreById
         *
         *  @param  {Integer} id The id of the store you wish to retrieve
         *
         *  @return {Object} $http promise object
         */
        var getStoreById = function(id) {
            console.log(id);
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/stores/' + id + '.js',
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
        }

        /**
         *  Query stores with a full text search and params selected by the user
         *
         *  @method queryStores
         *
         *  @param  {String} query The string you wish to search for
         *  @param  {Object} params Object of the params you wish to pass to the API
         *
         *  @return {Object} $http promise object
         */
        var queryStores = function(query, params) {
            console.log(query, params);
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/stores.js',
                params: {
                    callback: 'JSON_CALLBACK',
                    per_page: 10,
                    where: params.join(','),
                    lat: $rootScope.user.latitude,
                    lon: $rootScope.user.longitude,
                    q: escapeFilter(query)
                }
            });
        }

        /**
         *  Retrieves inventory data for a product at a specified store
         *
         *  @method getProductInventoryAtStore
         *
         *  @param  {Integer} store Id of the store
         *  @param  {Integer} product Id of the product
         *
         *  @return {Object} $http promise object
         */
        var getProductInventoryAtStore = function(store, product) {
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/stores/' + store + '/products/' + product + '/inventory.js',
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
        }

        /**
         *  Query products at a store with full text search
         *
         *  @method queryStoreProducts
         *
         *  @param  {Integer} id Id of the store
         *  @param  {String} query Query string
         *
         *  @return {Object} $http promise object
         */
        var queryStoreProducts = function(id, query) {
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/stores/' + id + '/products.js',
                params: {
                    per_page: 5,
                    callback: 'JSON_CALLBACK',
                    q: escapeFilter(query)
                }
            });
        }

        return {
            getStoresByLocation: getStoresByLocation,
            getStoreById: getStoreById,
            queryStores: queryStores,
            queryStoreProducts: queryStoreProducts,
            getProductInventoryAtStore: getProductInventoryAtStore,
            checkConnection: checkConnection
        }
    }]);
