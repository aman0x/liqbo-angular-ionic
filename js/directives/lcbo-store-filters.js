/**
 *  LCBO Stores Filters
 *
 *  Produces a directive which contains all the filters available for store searches
 */
angular.module('lcboApp.directives').directive('lcboStoreFilters', [function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/lcbo-store-filters.tpl.html',
        link: function($scope, elem, attrs) {

            $scope.storeFilters = [
                {
                    filter: 'has_wheelchair_accessability',
                    title: 'Wheelchair Access'
                },
                {
                    filter: 'has_bilingual_services',
                    title: 'Bilingual Services'
                },
                {
                    filter: 'has_product_consultant',
                    title: 'Product Consultant'
                },
                {
                    filter: 'has_tasting_bar',
                    title: 'Tasting Bar'
                },
                {
                    filter: 'has_beer_cold_room',
                    title: 'Cold Beer Room'
                },
                {
                    filter: 'has_special_occasion_permits',
                    title: 'Special Occasion Permits'
                },
                {
                    filter: 'has_vintages_corner',
                    title: 'Vintages Corner'
                },
                {
                    filter: 'has_parking',
                    title: 'Parking'
                },
                {
                    filter: 'has_transit_access',
                    title: 'Transit Access'
                }
            ]
        }
    };
}]);