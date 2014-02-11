angular.module('lcboApp.controllers')
    .controller('StoresDetailCtrl', ['$scope', '$rootScope', '$stateParams', 'StoresService', 'FavoritesService', 'localStorageService', '$ionicLoading',
        function($scope, $rootScope, $stateParams, StoresService, FavoritesService, localStorageService, $ionicLoading) {

        /**
         *  Clears the search bar
         *
         *  @method clearSearch
         */
        $scope.clearSearch = function() {
            $scope.query.text = '';
        }

        /**
         *  Removes the search error
         *
         *  @method clearError
         */
        $scope.clearError = function() {
            $scope.noProducts = false;
        }

        /**
         *  Toggles search bar open / closed
         *
         *  @method searchOpenToggle
         */
        $scope.searchOpenToggle = function() {
            $scope.searchOpen = !$scope.searchOpen;
        }

        /**
         *  Toggles feature dialog open / closed
         *
         *  @method featuresOpenToggle
         */
        $scope.featuresOpenToggle = function() {
            $scope.featuresOpen = !$scope.featuresOpen;
        }

        /**
         *  Toggles hours dialog open / closed
         *
         *  @method hoursOpenToggle
         */
        $scope.hoursOpenToggle = function() {
            $scope.hoursOpen = !$scope.hoursOpen;
        }

        /**
         *  Looks up products for a specific store and then takes all those results
         *  and looks up the inventory quantity at the store. This function is limited
         *  to finding only 5 products as there are many requests being created.
         *
         *  @method productSearch
         *
         *  @return {Object} Results of the query
         */
        $scope.productSearch = function() {
            if ($scope.query.text.length > 0) {
                document.activeElement.blur();
                $ionicLoading.show($rootScope.loadingConfig);
                $scope.noProducts = false;
                StoresService.queryStoreProducts($stateParams.storeId, $scope.query.text)
                    .success(function(response) {
                        console.log(response);
                        $scope.productResults = response.result;

                        if ($scope.productResults.length <= 0) {
                            /* If there are no products, throw an error */
                            $scope.noProducts = true;
                            $ionicLoading.show().hide();
                        } else {
                            /* Roll through each result and get the inventory count */
                            _.each($scope.productResults, function(product) {
                                StoresService.getProductInventoryAtStore($stateParams.storeId, product.id).success(function(response) {
                                    product.quantity = response.result.quantity;
                                });
                            });

                            $ionicLoading.show().hide();
                        }
                    })
                    .error(function(response) {
                        $rootScope.online = false;
                        $ionicLoading.show().hide();
                    });
            }
        }

        /**
         *  Add / Remove favorite using favorites service
         *
         *  @method toggleFavorite
         *
         *  @param  {Object} store The store object
         *
         *  @return {Boolean} True / false whether store is favorite
         */
        $scope.toggleFavorite = function(store) {
            return $scope.isFavorite = FavoritesService.toggleFavorite(store, 'favoriteStores');
        }

        /**
         *  Controller init logic
         */
        $scope.init = function() {
            _.extend($scope, {
                store: {},
                isFavorite: FavoritesService.isFavorite($stateParams.storeId, 'favoriteStores'),
                query: {
                    text: ''
                },
                searchOpen: false,
                featuresOpen: false,
                hoursOpen: false,
                productResults: []
            });

            $ionicLoading.show($rootScope.loadingConfig);
            StoresService.getStoreById($stateParams.storeId)
                .success(function(response) {
                    $scope.store = response.result;
                    $ionicLoading.show().hide();
                })
                .error(function(response) {
                    $rootScope.online = false;
                    $ionicLoading.show().hide();
                });
        }

        $scope.init();
    }]);