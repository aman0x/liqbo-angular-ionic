/**
 *  LCBO Store Search Inventory
 *
 *  Produces a form which the user can use to search store inventory
 *  with a maximum of 5 results
 */
angular.module('lcboApp.directives').directive('lcboStoreSearchInventory', [function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/lcbo-store-search-inventory.tpl.html'
    };
}]);