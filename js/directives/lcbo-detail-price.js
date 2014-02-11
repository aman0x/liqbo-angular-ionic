/**
 *  LCBO Detail Price
 *
 *  Produces a directive which contains pricing information for the item
 */
angular.module('lcboApp.directives').directive('lcboDetailPrice', [function() {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            price: '@',
            sale: '@',
            savings: '@',
            until: '@'
        },
        templateUrl: 'templates/directives/lcbo-detail-price.tpl.html'
    };
}]);