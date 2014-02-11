/**
 *  LCBO Store Hours
 *
 *  Produces a list which which contains the hours for a store
 */
angular.module('lcboApp.directives').directive('lcboStoreHours', [function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/lcbo-store-hours.tpl.html'
    };
}]);