'use strict';

/* Directives */


angular.module('SheepGenetics.directives', [])

    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])


    .directive('pagination', function() {
        return {
            restrict: 'E',
            scope: {
                totalPages: '=',
                currentPage: '=',
                onSelectPage: '&'
            },
            templateUrl: 'media/views/_pagination.html',
            replace: true,
            link: function(scope) {
                scope.$watch('totalPages', function(value) {
                    scope.pages = [];
                    for(var i=1;i<=value;i++) {
                        scope.pages.push(i);
                    }
                    if ( scope.currentPage > value ) {
                        scope.selectPage(value);
                    }
                });
                scope.noPrevious = function() {
                    return scope.currentPage === 1;
                };
                scope.noNext = function() {
                    return scope.currentPage === scope.totalPages;
                };
                scope.isActive = function(page) {
                    return scope.currentPage === page;
                };

                scope.selectPage = function(page) {
                    if ( ! scope.isActive(page) ) {
                        scope.currentPage = page;
                        scope.onSelectPage({ page: page });
                    }
                };

                scope.selectPrevious = function() {
                    if ( !scope.noPrevious() ) {
                        scope.selectPage(scope.currentPage-1);
                    }
                };
                scope.selectNext = function() {
                    if ( !scope.noNext() ) {
                        scope.selectPage(scope.currentPage+1);
                    }
                };
            }
        };
    })

   
