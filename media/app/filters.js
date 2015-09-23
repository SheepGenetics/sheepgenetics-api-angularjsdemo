'use strict';

/* Filters */

angular.module('SheepGenetics.filters', []).

    filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }])

    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i=1; i<=total; i++)
                input.push(i);
            return input;
        };
    })

    .filter('paginationLinks', function() {
        return function(input, totalPages, currentPage) {
            totalPages = parseInt(totalPages);
            var result = [];
            for(var x = Math.max(1, currentPage - 5); x <= Math.min(currentPage + 5, totalPages); x++)
                result.push(x);
            return result;
        };
    });

