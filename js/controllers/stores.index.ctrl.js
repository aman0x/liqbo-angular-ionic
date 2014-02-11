angular.module('lcboApp.controllers')
    .controller('StoresIndexCtrl', ['LocationService', 'StoresService', '$scope', '$stateParams', '$ionicLoading', '$rootScope', '$state', 'localStorageService', '$log', '$ionicModal',
        function(LocationService, StoresService, $scope, $stateParams, $ionicLoading, $rootScope, $state, localStorageService, $log, $ionicModal) {

        /**
         *  Toggles the side panel on the stores page
         *
         *  @method toggleSlide
         */
        $scope.toggleSlide = function() {
            $scope.sideMenuController.toggleLeft();
        }

        /**
         *  Processes error messages to be displayed to client
         *
         *  @method revealError
         *
         *  @param  {String} error String of the error message
         */
        var revealError = function(error) {
            $log.error(error);

            $scope.error = {
                reveal: true,
                message: error
            }

            $ionicLoading.show().hide();
        }

        /**
         *  Clears the search bar
         *
         *  @method clearSearch
         */
        $scope.clearSearch = function() {
            $scope.query.text = '';
        }

        /**
         *  Take the user to the detail page of the selected store
         *
         *  @method viewStoreDetails
         *
         *  @param  {Integer} id Id of the store
         */
        $scope.viewStoreDetails = function(id) {
            console.log(id);
            $state.go()('/tab/stores/' + id);
        }


        /**
         *  Hides errors when function is run
         *
         *  @method hideError
         */
        $scope.hideError = function() {
            $scope.error.reveal = false;
        }

        /**
         *  Finds stores based on the coordinates passed to the function
         *
         *  @method findStores
         *
         *  @param  {Object} coords Latitude and Longitude of the users location
         */
        $scope.findStores = function() {
            $ionicLoading.show($rootScope.loadingConfig);

            StoresService.getStoresByLocation()
                .success(function(data) {
                    if (data.result.length <= 0) {
                        revealError('No search results found');
                    } else {
                        $rootScope.map.center = {
                            latitude: $rootScope.user.latitude,
                            longitude: $rootScope.user.longitude
                        }

                        $scope.drawMarkersOnMap(data.result);
                    }
                })
                .error(function(response) {
                    $rootScope.online = false;
                    $ionicLoading.show().hide();
                });
        }

        /**
         *  Performs a full text query of stores
         *
         *  @method storeSearch
         */
        $scope.storeSearch = function() {
            $ionicLoading.show($rootScope.loadingConfig);
            $scope.sideMenuController.close();

            var queryStores = function() {
                var filters = _.findKeys($scope.filters, true);

                StoresService.queryStores($scope.query.text, filters)
                    .success(function(data) {
                        console.log(data);

                        if (data.result.length <= 0) {
                            revealError('No search results found');
                        } else {
                            $rootScope.map.center = {
                                latitude: data.result[0].latitude,
                                longitude: data.result[0].longitude
                            }

                            $scope.drawMarkersOnMap(data.result);
                        }
                    })
                    .error(function(response) {
                        $rootScope.online = false;
                        $ionicLoading.show().hide();
                    });
            }

            $scope.findUsersLocation(queryStores);
        }

        /**
         *  Finds a specific store by using the id of the the location, then
         *  passes it off to the marker drawing function. The markers need to be
         *  in an array format, so we pass the single result as an array
         *
         *  @method findStoreById
         *
         *  @param  {Integer} id Id of the specific store
         */
        $scope.findStoreById = function(id) {
            $ionicLoading.show($rootScope.loadingConfig);

            /* If the side menu isn't open it causes an error, so check it exists before closing it */
            if ($scope.sideMenuController) $scope.sideMenuController.close();

            StoresService.getStoreById(id)
                .success(function(data) {
                    console.log(data);

                    if (data.error) {
                        revealError(data.message);
                    } else {
                        $rootScope.map.center = {
                            latitude: data.result.latitude,
                            longitude: data.result.longitude
                        }

                        $scope.drawMarkersOnMap(data.result);
                    }
                })
                .error(function(response) {
                    $rootScope.online = false;
                    $ionicLoading.show().hide();
                });
        }

        /**
         *  This function is responsible for attaching events and details to each map
         *  marker and for rending them onto the map. It will also save the locations
         *  to localStorage.
         *
         *  @method drawMarkersOnMap
         *
         *  @param  {Object} locations Array of locations
         */
        $scope.drawMarkersOnMap = function(locations) {
            if (!_.isEmpty(locations)) {
                var locationArray = [];

                var template = {
                    onClicked: function() {
                        /* Have to resort to location.href as $location.path() isn't working */
                        location.href = '#/tab/stores/' + this.coords.id;
                    },
                    icon: 'img/beer_open.svg'
                };

                if (locations.length) {
                    /* Attach onclick function and icon details to each map marker */
                    _.each(locations, function(place) {
                        _.extend(place, template);
                        locationArray.push(place);
                    });
                } else {
                    console.log(locations);
                    _.extend(locations, template);
                    locationArray.push(locations);
                }

                /* load the locations into the rootScope and save them to localStorage */
                $rootScope.localStores = locationArray;
                localStorageService.add('lastMapLocation', $rootScope.map.center);
                localStorageService.add('lastStores', locations);
            } else {
                $rootScope.map.center = $rootScope.user;
                $rootScope.localStores = [];
            }

            return $ionicLoading.show().hide();
        }

        /**
         *  Finds the users location and sets their position as a marker, then fires
         *  any callback function that is passed to it.
         *
         *  @method getLocalStores
         */
        $scope.findUsersLocation = function(callback) {
            $ionicLoading.show($rootScope.loadingConfig);

            var locationSuccess = function(response) {
                $rootScope.user = response.coords;

                if (callback) callback();
            }

            var locationError = function(response) {
                $scope.error = {
                    reveal: true,
                    message: 'Unable to aquire location'
                }
            }

            LocationService.getLocation().then(locationSuccess, locationError);
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

            $rootScope.toolTips.search = false;
            $scope.modal.hide();
        };

        /**
         *  Controller init logic
         */
        $scope.init = function() {

            /**
             *  Establish map defaults
             *
             *  @type {Object}
             */
            _.extend($scope, {
                query: {
                    text: ''
                },
                error: {
                    reveal: false,
                    message: ''
                },
                tip: {
                    selected: false
                },
                filters: {},
                favorites: localStorageService.get('favoriteStores')
            });

            console.log(localStorageService.get('lastStores'));

            /**
             *  Determine the way the user is entering the page
             */
            if ($rootScope.online) {
                if ($stateParams.storeid) {
                    /* load the specific store the user has requested */
                    $ionicLoading.show($rootScope.loadingConfig);
                    $scope.findStoreById($stateParams.storeid);
                } else if (localStorageService.get('lastStores').length > 0) {
                    /* load the users last viewed locations */
                    var locations = localStorageService.get('lastStores');
                    console.log(locations.length);
                    $rootScope.map.center = localStorageService.get('lastMapLocation');
                    $scope.drawMarkersOnMap(localStorageService.get('lastStores'));
                    return;
                } else {
                    /* otherwise default to showing them their location and surrounding stores */
                    $ionicLoading.show($rootScope.loadingConfig);
                    return $scope.findUsersLocation($scope.findStores);
                }
            }
        }

        $scope.init();
    }]);