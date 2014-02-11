angular.module('lcboApp', [
    'ionic',
    'lcboApp.services',
    'lcboApp.directives',
    'lcboApp.filters',
    'lcboApp.controllers',
    'google-maps',
    'LocalStorageModule'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })

        .state('tab.stores-index', {
            url: '/stores?lat&lon&storeid',
            views: {
                'stores-tab': {
                    templateUrl: 'templates/stores/index.tpl.html',
                    controller: 'StoresIndexCtrl'
                }
            }
        })

        .state('tab.stores-detail', {
            url: '/stores/:storeId',
            views: {
                'stores-tab': {
                    templateUrl: 'templates/stores/detail.tpl.html',
                    controller: 'StoresDetailCtrl'
                }
            }
        })

        .state('tab.drinks-index', {
            url: '/drinks',
            views: {
                'drinks-tab': {
                    templateUrl: 'templates/drinks/index.tpl.html',
                    controller: 'DrinksIndexCtrl'
                }
            }
        })

        .state('tab.drinks-detail', {
            url: '/drinks/:productId',
            views: {
                'drinks-tab': {
                    templateUrl: 'templates/drinks/detail.tpl.html',
                    controller: 'DrinksDetailCtrl'
                }
            }
        })

        .state('tab.about', {
            url: '/about',
            views: {
                'about-tab': {
                    templateUrl: 'templates/about.html',
                    controller: 'AboutCtrl'
                }
            }
        })

    $urlRouterProvider.otherwise('/tab/drinks');
}])

/**
 *  Setup localstorage prefix
 */
.config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('lcboApp');
}])

/**
 *  Establish localstorage on application run, if the entries don't exist, we need
 *  to create them. Load favorites into rootScope where we can carry them throughout
 *  the entire application on a global level
 */
.run(['localStorageService', '$rootScope', '$window', 'StoresService', '$interval', function(localStorageService, $rootScope, $window, StoresService, $interval) {

    /**
     *  Establish rootScope defaults
     */
    _.extend($rootScope, {
        map: {
            center: {
                latitude: 43.7000,
                longitude: -79.4000,
            },
            zoom: 16,
            options: {
                overviewMapControl: false,
                panControl: false,
                rotateControl: false,
                scaleControl: false,
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false
            },
            icons: {
                user: 'img/location.svg',
                open: 'img/beer_open.svg',
                closed: 'img/beer_closed.svg'
            },
            fill: {}
        },
        user: {},
        localStores: [],
        loadingConfig: {
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 500
        },
        showToolTips: localStorageService.get('showToolTips'),
        toolTips: {
            search: true,
            product: true
        },
        hasInternet: false
    });

    /**
     *  Establish localstorage defaults
     */
    if (!localStorageService.get('favoriteDrinks')) { localStorageService.add('favoriteDrinks', []) };
    if (!localStorageService.get('favoriteStores')) { localStorageService.add('favoriteStores', []) };
    if (!localStorageService.get('lastSearch')) { localStorageService.add('lastSearch', '') };
    if (!localStorageService.get('lastResult')) { localStorageService.add('lastResult', []) };
    if (!localStorageService.get('lastStores')) {
        localStorageService.add('lastStores', []);
        $rootScope.localStores = localStorageService.get('lastStores');
    }
    if (!localStorageService.get('lastMapLocation')) {
        var defaultLocation = {
            latitude: 43.7000,
            longitude: -79.4000
        };

        localStorageService.add('lastMapLocation', defaultLocation);
        $rootScope.map.center = defaultLocation;
    }

    $rootScope.online = navigator.onLine;

    $window.addEventListener('offline', function () {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);

    $window.addEventListener('online', function () {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);

    /**
     *  Double check the browser is able to make a connection as mobile
     *  doesn't seem to properly use navigator.onLine
     */
    StoresService.checkConnection()
        .success(function(response) {
            $rootScope.online = true;
        })
        .error(function(response) {
            $rootScope.online = false;
        });

    $rootScope.$watch('online', function(val) {
        var objTimer = null;
        console.log(val);
        if (!val) {
            objTimer = $interval(function() {
                console.log('checking for connection');
                StoresService.checkConnection().success(function(response) {
                    $rootScope.online = true;
                    $interval.cancel(objTimer);
                }).error(function() {
                    objTimer;
                });
            }, 5000);
        } else {
            console.log('connected to internet');
            $interval.cancel(objTimer);
        }
    });

    console.log($rootScope.map);
}]);

/**
 *  Init Modules
 */
angular.module('lcboApp.directives', []);
angular.module('lcboApp.filters', []);
angular.module('lcboApp.services', []);
angular.module('lcboApp.controllers', []);

/**
 *  Underscore mixin for finding the keys where values are true
 */
_.mixin({
    findKeys: function(obj, search, context) {
        var result = [],
        isFunction = _.isFunction(search);

        _.each(obj, function (value, key) {
            var match = isFunction ? search.call(context, value, key, obj) : (value === search);
            if (match) {
                result.push(key);
            }
        });

    return result;
    }
});