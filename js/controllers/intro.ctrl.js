angular.module('lcboApp.controllers')
    .controller('IntroCtrl', ['$scope', '$rootScope', 'localStorageService',
        function($scope, $rootScope, localStorageService) {

        /**
         *  Controller init logic
         */
        $scope.init = function() {
            console.log('hello world');
        }

        $scope.init();
    }]);