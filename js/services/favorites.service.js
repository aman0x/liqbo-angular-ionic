/**
 *  Favorites Service
 */
angular.module('lcboApp.services')
    .factory('FavoritesService', ['$q', 'localStorageService', function($q, localStorageService) {

        /**
         *  Check if the item is stored in favorites
         *
         *  @method isFavorite
         *
         *  @param  {Integer} id Id of the store you wish to lookup
         *  @param  {String} type Type of object you are looking up
         *
         *  @return {Boolean}
         */
        var isFavorite = function(id, type) {
            return (_.findWhere(localStorageService.get(type), {id: parseInt(id)})) ? true : false;
        }

        /**
         *  Add / Remove selected favorite to localstorage
         *
         *  @method toggleFavorite
         *
         *  @param  {Object} object The object you wish to store in favorites
         *  @param  {Object} type The type of object you are storing
         */
        var toggleFavorite = function(object, type) {
            var item = { id: object.id, name: object.name },
                favorites = localStorageService.get(type),
                favorite = false;

            /* Are we removing or addings? Check if it exists */
            if (_.findWhere(favorites, item)) {
                /* Remove from favorites */
                favorites = _.reject(favorites, function(favorite) {
                    return favorite.id === item.id;
                });
                favorite = false;
            } else {
                /* Add to favorites */
                favorites.push(item);
                favorite = true;
            }

            /* Save the updated favorites */
            localStorageService.add(type, favorites);

            /* Retrun the status of the item */
            console.log(favorite);
            return favorite;
        }

        return {
            isFavorite: isFavorite,
            toggleFavorite: toggleFavorite
        }
    }]);

