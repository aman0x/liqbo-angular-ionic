/**
 *  LCBO Hours of Operation
 *
 *  Produces a human readable version of the stores hours of operation
 */
angular.module('lcboApp.directives').directive('lcboHoursOperation', [function() {
    return {
        restrict: 'E',
        scope: {
            day: '@',
            open: '@',
            close: '@'
        },
        templateUrl: 'templates/directives/lcbo-hours-operation.tpl.html'
    };
}]);