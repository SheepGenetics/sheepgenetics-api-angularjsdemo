'use strict';

angular.module('SheepGenetics', ['SheepGenetics.filters', 'SheepGenetics.services', 'SheepGenetics.directives', 'SheepGenetics.controllers', 'ngRoute']).

//
//	ROUTES
//

  		config(['$routeProvider', function ($routeProvider) {

  		    //$routeProvider.when('/home', {templateUrl: 'media/views/home.html', controller: 'Home'});

  		    //	dataset selection
  		    $routeProvider.when('/datasets', { templateUrl: 'media/views/datasets.html', controller: 'Datasets' });
  		    $routeProvider.when('/:datasetId/:datasetTitle', { templateUrl: 'media/views/analyses.html', controller: 'Analyses' });
  		    $routeProvider.when('/:datasetId/:datasetTitle/:analysisId/findanimal/:animalId', { templateUrl: 'media/views/findanimal.html', controller: 'FindAnimal' });
  		    $routeProvider.when('/:datasetId/:datasetTitle/:analysisId/:analysisTitle', { templateUrl: 'media/views/search.html', controller: 'Search' });
  		    $routeProvider.when('/:datasetId/:datasetTitle/:analysisId/:analysisTitle/findanimal', { templateUrl: 'media/views/findanimal.html', controller: 'FindAnimal' });
  		    //	default route
  		    $routeProvider.otherwise({ redirectTo: '/datasets' });
  		} ]);

angular.module('SheepGeneticsMatesel', ['SheepGenetics.filters', 'SheepGenetics.services', 'SheepGenetics.directives', 'SheepGenetics.controllers', 'ngRoute', 'ngDraggable', 'ngSanitize', 'ui.bootstrap', 'blockingClick', 'googlechart']).

        //
        //	ROUTES
        //

        config(['$routeProvider', function($routeProvider)
        {
            $routeProvider.when('/', {templateUrl: 'media/views/matesel.html', controller: 'Matesel'});

            //	default route
            $routeProvider.otherwise({redirectTo: '/Tools'});
        }]);


        angular.module('SheepGeneticsDashboard', ['SheepGenetics.filters', 'SheepGenetics.services', 'SheepGenetics.directives', 'SheepGenetics.controllers', 'ngRoute', , 'ui.bootstrap','googlechart']).

        //
        //	ROUTES
        //

        config(['$routeProvider', function($routeProvider)
        {
            $routeProvider.when('/', {templateUrl: 'media/views/charts.html', controller: 'Charts'});

            //	default route
            $routeProvider.otherwise({redirectTo: '/Tools'});
        } ]);

        angular.module('SheepGeneticsMyDetails', ['SheepGenetics.filters', 'SheepGenetics.services', 'SheepGenetics.directives', 'SheepGenetics.controllers', 'ngRoute', , 'ui.bootstrap', 'googlechart']).

        //
        //	ROUTES
        //

        config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', { templateUrl: 'media/views/mydetails.html', controller: 'MyDetails' });

            //	default route
            $routeProvider.otherwise({ redirectTo: '/Tools' });
        } ]);

        angular.module('SheepGeneticsMyUpdates', ['SheepGenetics.filters', 'SheepGenetics.services', 'SheepGenetics.directives', 'SheepGenetics.controllers', 'ngRoute', , 'ui.bootstrap', 'googlechart']).

        //
        //	ROUTES
        //

        config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', { templateUrl: 'media/views/myupdates.html', controller: 'MyUpdates' });

            //	default route
            $routeProvider.otherwise({ redirectTo: '/Tools' });
        } ]);

        angular.module('SheepGeneticsAdmin', ['SheepGenetics.filters', 'SheepGenetics.services', 'SheepGenetics.directives', 'SheepGenetics.controllers', 'ngRoute', , 'ui.bootstrap', 'googlechart']).

        //
        //	ROUTES
        //

        config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', { templateUrl: 'media/views/admin.html', controller: 'Admin' });

            //	default route
            $routeProvider.otherwise({ redirectTo: '/Tools' });
        } ]);




  		
