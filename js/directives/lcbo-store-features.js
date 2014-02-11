/**
 *  LCBO Store Features
 *
 *  Produces a list which contains check or x if a store has that feature
 */
angular.module('lcboApp.directives').directive('lcboStoreFeatures', [function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/lcbo-store-features.tpl.html'
    };
}]);