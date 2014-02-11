angular.module('lcboApp.controllers')
    .controller('DrinksIndexCtrl', ['$scope', '$rootScope', 'DrinksService', 'localStorageService', '$ionicLoading', '$timeout', 'LocationService', '$location', '$anchorScroll', '$ionicModal',
        function($scope, $rootScope, DrinksService, localStorageService, $ionicLoading, $timeout, LocationService, $location, $anchorScroll, $ionicModal) {

        /**
         *  Reveals the filter panel
         *
         *  @method toggleSlide
         */
        $scope.toggleSlide = function() {
            $scope.sideMenuController.toggleLeft();
        }

        /**
         *  Clears the search bar
         *
         *  @method clearSearch
         */
        $scope.clearSearch = function() {
            $scope.query.input = '';
        }

        /**
         *  Performs the doSearch method, this function will be performed everytime
         *  the input 'query' is changed. Collects a list of the filters the user
         *  has applied and uses them in the api query.
         *
         *  @method search
         */
        $scope.search = function(page) {
            if ($scope.query.input && $scope.query.input.length > 0) {
                document.activeElement.blur();

                var filters = _.findKeys($scope.filters, true);

                $ionicLoading.show($rootScope.loadingConfig);

                DrinksService.getProducts($scope.query.input, filters)
                    .success(function(response) {
                        $scope.pager = response.pager;
                        $scope.results = response.result;
                        localStorageService.add('lastSearch', $scope.query.input);
                        localStorageService.add('lastResult', response.result);
                        $ionicLoading.show().hide();
                    })
                    .error(function(response) {
                        $rootScope.online = false;
                        $ionicLoading.show().hide();
                    });
            }
        }

        /**
         *  Loads more results when the user hits the infinite scrolling location,
         *  will only perform the function if the length of results is > 20 and < 100
         *
         *  @method loadMore
         */
        $scope.loadMore = function() {
            console.log($scope.pager);
            if ($scope.results.length <= 100 && $scope.pager.total_record_count > 20) {
                $ionicLoading.show($rootScope.loadingConfig);

                DrinksService.loadMoreProducts($scope.pager.next_page_path)
                    .success(function(response) {
                        $scope.pager = response.data.pager;
                        $scope.results = $scope.results.concat(response.data.result);
                        $ionicLoading.show().hide();
                    })
                    .error(function(response) {
                        $rootScope.online = false;
                        $ionicLoading.show().hide();
                    });
            }
        }

        /**
         *  Saves the product the user has selected to localStorage. This can
         *  then be retrieved in the detail view by reading from storage.
         *  Allows us to maintain deep links as well.
         *
         *  @method viewProduct
         *
         *  @param  {Object} item The product the user wishes to view
         */
        $scope.viewProduct = function(item) {
            localStorageService.add('lastProduct', item);
        }

        /**
         *  Open modal window
         *
         *  @method openModal
         */
        $scope.openModal = function() {
            $scope.modal.show();
        };

        /**
         *  Close modal window
         *
         *  @method closeModal
         */
        $scope.closeModal = function() {
            if ($scope.tip.selected) {
                $rootScope.showToolTips = false;
                localStorageService.add('showToolTips', false);
            }

            $rootScope.toolTips.product = false;
            $scope.modal.hide();
        };

        /**
         *  Controller initialize logic
         */
        $scope.init = function() {

            /**
             *  We force the application to create the localStorage entries in the application
             *  run configuration, if they are empty, they will default to an empty string
             *  and an empty array.
             */
            _.extend($scope, {
                results: ($rootScope.online) ? localStorageService.get('lastResult') : [],
                favorites: localStorageService.get('favoriteDrinks'),
                pager: {},
                stores: [],
                query: {
                    input: ''
                },
                tip: {
                    selected: false
                },
            });

            $scope.filters = {
                has_limited_time_offer: '',
                has_bonus_reward_miles: '',
                is_seasonal: '',
                is_vqa: '',
                is_kosher: ''
            }
        }

        $scope.init();
    }]);