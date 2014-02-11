angular.module('lcboApp.controllers')
    .controller('DrinksDetailCtrl', ['$scope', 'DrinksService', 'localStorageService', 'FavoritesService', '$stateParams', '$rootScope', '$ionicLoading', 'LocationService', '$location',
        function($scope, DrinksService, localStorageService, FavoritesService, $stateParams, $rootScope, $ionicLoading, LocationService, $location) {

        /**
         *  Retrieves the product data from the API
         *
         *  @method getProductInfo
         *
         *  @param  {Integer} id Id of the product
         */
        var getProductInfo = function(id) {
            $ionicLoading.show($rootScope.loadingConfig);
            DrinksService.getProduct(id)
                .success(function(data) {
                    $scope.product = data.result;
                    $ionicLoading.show().hide();
                })
                .error(function(response) {
                    $rootScope.online = false;
                    $ionicLoading.show().hide();
                });
        }

        $scope.clearError = function() {
            $scope.noLocation = false;
        }

        /**
         *  Forwards user to the map page with the specified store id
         *
         *  @method findLocation
         *
         *  @param  {Integer} id The id of the store
         */
        $scope.findLocation = function(id) {
            $location.search('storeid', id).path('/tab/stores');
        }

        /**
         *  Find the product local to the user, uses geolocation (device GPS) to find the
         *  users location, then finds stores closest to them via API
         *
         *  @method findLocally
         *
         *  @param  {Object} item The object you wish to find locally
         */
        $scope.findLocally = function(item) {
            $scope.noLocation = false;

            var locationSuccess = function(response) {
                console.log(response.coords);
                $ionicLoading.show($rootScope.loadingConfig);
                DrinksService.findLocally(item.id, response.coords)
                    .success(function(data) {
                        console.log(data);
                        $scope.stores = data.result;
                        $ionicLoading.show().hide();
                    })
                    .error(function(response) {
                        $rootScope.online = false;
                        $ionicLoading.show().hide();
                    });
            }

            var locationError = function(response) {
                $scope.noLocation = true;
            }

            LocationService.getLocation().then(locationSuccess, locationError);
        }

        /**
         *  Add / Remove selected favorite to localstorage
         *
         *  @method toggleFavorite
         *
         *  @param  {Object} item The product you wish to add to the users favorites
         */
        $scope.toggleFavorite = function(product) {
            return $scope.isFavorite = FavoritesService.toggleFavorite(product, 'favoriteDrinks');
        }

        /**
         *  Controller initialize logic
         */
        $scope.init = function() {
            _.extend($scope, {
                product: {},
                isFavorite: FavoritesService.isFavorite($stateParams.productId, 'favoriteDrinks'),
                noLocation: false
            });

            /* Retrieve product details -- either from localStorage or API */
            if (localStorageService.get('lastProduct').id === parseInt($stateParams.productId)) {
                $scope.product = localStorageService.get('lastProduct');
            } else {
                getProductInfo($stateParams.productId);
            }
        }

        $scope.init();
    }]);