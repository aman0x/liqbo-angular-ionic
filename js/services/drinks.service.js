/**
 *  Drinks Service
 */
angular.module('lcboApp.services')
    .factory('DrinksService', ['$http', 'escapeFilter', function($http, escapeFilter) {

        /**
         *  Retrieves products for the query parameters passed to $http
         *
         *  @method getProducts
         *
         *  @param  {String} query Query String
         *  @param  {Array} filters List of filters to apply to the search
         *  @param  {Integer} page Page you wish to retrieve
         *
         *  @return {Object} $http promise object
         */
        var getProducts = function(query, filters) {
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/products.js',
                params: {
                    callback: 'JSON_CALLBACK',
                    per_page: 10,
                    q: escapeFilter(query),
                    where: filters.join(',')
                }
            });
        }

        /**
         *  Gets details of a single product
         *
         *  @method getProduct
         *
         *  @param  {Integer} id Id of the product
         *
         *  @return {Object} $http promise object
         */
        var getProduct = function(id) {
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/products/' + id + '.js',
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
        }

        /**
         *  Find the specified product locally
         *
         *  @method findLocally
         *
         *  @param  {Integer} id Id of the product
         *  @param  {Object} location Coordinates object
         *
         *  @return {Object} $http promise object
         */
        var findLocally = function(id, location) {
            console.log(id, location);
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com/products/' + id + '/stores.js',
                params: {
                    lat: location.latitude,
                    lon: location.longitude,
                    per_page: 5,
                    callback: 'JSON_CALLBACK'
                }
            });
        }

        /**
         *  Used by lazy loader to load additional products
         *
         *  @method loadMoreProducts
         *
         *  @param  {String} next_page_path The next_page_path created by the pager response
         *
         *  @return {Object} $http promise object
         */
        var loadMoreProducts = function(next_page_path) {
            return $http({
                method: 'JSONP',
                url: 'http://lcboapi.com' + next_page_path,
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
        }

        return {
            getProducts: getProducts,
            getProduct: getProduct,
            loadMoreProducts: loadMoreProducts,
            findLocally: findLocally
        }
    }]);
