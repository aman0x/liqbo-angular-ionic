/**
 *  Application Filters
 */

angular.module('lcboApp.filters')

    /**
     *  Returns URI Endcoded string
     */
    .filter('escape', [function() {
        return function(string) {
            return string.toLowerCase().replace(/ /g, '+');
        };
    }])

    /**
     *  Converts cents to dollars
     */
    .filter('centsToDollars', [function() {
        return function(num) {
            return '$' + (num / 100).toFixed(2);
        };
    }])

    /**
     *  Converts LCBO APi alcohol to percentage
     */
    .filter('alcoholPercentage', [function() {
        return function(num) {
            return (num / 100).toFixed(1) + '%';
        };
    }])

    /**
     *  Access to moment.js library
     */
    .filter('formatTime', [function() {
        return function(time, format) {
            console.log(time, format);
            return moment(time).format(format);
        };
    }])

    /**
     *  Convert unix time to human readable 12 hour time
     */
    .filter('minutesToHours', [function() {
        return function(minutes) {
            var hours = minutes / 60,
                mins = (minutes % 60),
                ampm = (minutes < 720) ? 'AM' : 'PM';

            /* If mins are less than ten, add a zero*/
            mins = (mins < 10) ? '0' + mins : mins;
            hours = (hours > 12) ? (hours - 12) : hours;

            return hours + ':' + mins + ' ' + ampm;
        };
    }]);