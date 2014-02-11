/**
 *  LCBO Detail Item
 *
 *  Produces a directive which contains a title and content for the item
 */
angular.module('lcboApp.directives').directive('lcboDetailItem', [function() {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            content: '@'
        },
        templateUrl: 'templates/directives/lcbo-detail-item.tpl.html'
    };
}]);