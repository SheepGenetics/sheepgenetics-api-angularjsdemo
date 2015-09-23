'use strict';

//	BREEDER LOCATION
//	YEAR

//	SHEEP ID? 5047921997970033

angular.module('SheepGenetics.controllers', [])


//
//	#/datasets
//


    .controller('Datasets', ['$scope', '$routeParams', 'API', function ($scope, $routeParams, API) {

        $scope.findanimalid = '';
        $scope.foundanimals = [];

        API.datasets().then(function (data) {
            $scope.datasets = data;
        });

        $scope.FindAnimal = function (anId) {
            API.findanimal(anId).then(function (data) {
                $scope.foundanimals = data;
            });
        }

    } ])

//
//	#/dataset/:datasetId
//

    .controller('Analyses', ['$scope', '$routeParams', 'API', function ($scope, $routeParams, API) {

        $scope.loadCount = 1;

        var datasetId = $routeParams.datasetId;

        //	load all datasets
        API.datasets().then(function (data) {
            for (var i = 0; i < data.length; i++)
                if (data[i].id == datasetId)
                    $scope.dataset = data[i];
        });

        //	load analyses for dataset
        API.analyses(datasetId).then(function (data) {
            $scope.analyses = data;
        });

    } ])

//
//	#/search/:datasetId/:analysisId
//




    .controller('Search', ['$scope', '$routeParams', 'filterFilter', 'API', function ($scope, $routeParams, filterFilter, API) {

        var datasetId = $routeParams.datasetId;
        var analysisId = $routeParams.analysisId;

        $scope.loadCount = 0;

        //
        //  LOAD DATA
        //

        //	load all datasets
        API.datasets().then(function (data) {
            for (var i = 0; i < data.length; i++)
                if (data[i].id == datasetId)
                    $scope.dataset = data[i];
            $scope.loadCount++;
        });

        //	load all analysis
        API.analyses(datasetId).then(function (data) {
            for (var i = 0; i < data.length; i++)
                if (data[i].id == analysisId)
                    $scope.analysis = data[i];
            $scope.loadCount++;
        });

        //	strings
        $scope.any = '- Any -';

        //	load asbvs
        $scope.asbvs = [];
        API.asbvs(datasetId, analysisId).then(function (data) {
            $scope.asbvs = data;
            $scope.loadCount++;
        });

        //  load breeds
        $scope.breeds = [];
        API.breeds(datasetId, analysisId).then(function (data) {
            $scope.breeds = data;
            $scope.loadCount++;
        });

        //  load sexes
        $scope.sex = null;
        $scope.sexes = [];
        API.sexes(datasetId, analysisId).then(function (data) {
            $scope.sexes = data;
            $scope.loadCount++;
        });

        //  load sirestatus 
        $scope.sirestatus = null;
        $scope.sirestatuses = [];
        API.sirestatuses(datasetId, analysisId).then(function (data) {
            $scope.sirestatuses = data;
            $scope.loadCount++;
        });

        //  load woolgroup
        $scope.woolgroup = null;
        $scope.woolgroups = [];
        API.woolgroups(datasetId, analysisId).then(function (data) {
            $scope.woolgroups = data;
            $scope.loadCount++;
        });

        //  load dropyears
        $scope.dropyear = null;
        $scope.dropyears = [];
        API.dropyears(datasetId, analysisId).then(function (data) {
            $scope.dropyears = data;
            $scope.loadCount++;
        });

        //  load breeder locations
        $scope.breederregion = null;
        $scope.breederlocations = [];
        API.breederlocations(datasetId, analysisId).then(function (data) {
            $scope.breederlocations = data;
            $scope.loadCount++;
        });


        //
        //  FILTERS
        //

        //	prepare id's
        $scope.ids = [
            { id: 0, value: '' }
        ];
        $scope.addNewId = function () {
            var index = $scope.ids.length + 1;
            $scope.ids.push({ id: index, value: '' });
        };

        //	other filters
        $scope.sirestudname = null;
        $scope.sirestudid = null;
        $scope.studnameflock = null;
        $scope.progenyminimum = null;
        $scope.withcurrentdropprogeny = false;
        $scope.usedinmorethanoneflock = false;
        $scope.sheepcrcsire = false;
        $scope.merinosuperiorsire = false;

        //
        //  SEARCH RESULTS
        //

        //  prepare pagination
        $scope.querycount = 0;
        $scope.currentPage = 1;
        $scope.resultsPerPage = 10;
        $scope.totalPages = 1;

        //	filter update
        $scope.Filter = function () {

            //  perform query
            API.querycount(datasetId, analysisId, getParams()).then(function (data) {
                $scope.querycount = data.count;
                $scope.totalPages = Math.ceil(data.count / $scope.resultsPerPage)
            });

        }

        //	prepare parameters
        $scope.Search = function () {

            //	perform searuch
            API.query(datasetId, analysisId, getParams()).then(function (data) {
                $scope.query = data;
                $scope.totalPages = Math.ceil(data.count / $scope.resultsPerPage)
            });

        }

        //  prepare selected friends
        $scope.selectedBreeds = function () {
            return filterFilter($scope.breeds, { checked: true });
        }

        //  get parameters
        function getParams() {

            var params = {};

            //  prepare breeds

            if ($scope.selectedBreeds().length) {
                params.BreedId = [];
                var breeds = $scope.selectedBreeds();
                for (var i = 0; i < breeds.length; i++)
                    params.BreedId.push(breeds[i].id);
            }

            //	prepare general params
            if ($scope.sex) params.Sex = $scope.sex.id;

            if ($scope.dropyears) params.BirthYear = $scope.dropyears.id;
            if ($scope.breederlocations) params.BreederLocation = $scope.breederlocations.id;

            //  prepare asbvs
            /*
            var asbvs = $scope.asbvs["$$v"]; // not sure why I need to access via $$v
            for (var i = 0; i < asbvs.length; i++) {
            var asbv = asbvs[i];
            if (typeof(asbv.filter_min) !== 'undefined' && asbv.filter_min != '')
            params[asbv.id + '_min'] = asbv.filter_min;
            if (typeof(asbv.filter_max) !== 'undefined' && asbv.filter_max != '')
            params[asbv.id + '_max'] = asbv.filter_max;
            }
            */

            //  pagination
            params.Limit = $scope.resultsPerPage;
            params.Offset = ($scope.currentPage - 1) * $scope.resultsPerPage;

            return params;

        }



    }
])

.controller('FindAnimal', ['$scope', '$routeParams', 'filterFilter', 'API', function ($scope, $routeParams, filterFilter, API) {

    var datasetId = $routeParams.datasetId;
    var analysisId = $routeParams.analysisId;

    $scope.loadCount = 0;

    //
    //  LOAD DATA
    //

    //	load all datasets
    API.datasets().then(function (data) {
        for (var i = 0; i < data.length; i++)
            if (data[i].id == datasetId)
                $scope.dataset = data[i];
        $scope.loadCount++;
    });

    //	load all analysis
    API.analyses(datasetId).then(function (data) {
        for (var i = 0; i < data.length; i++)
            if (data[i].id == analysisId)
                $scope.analysis = data[i];
        $scope.loadCount++;
    });

    //	strings
    $scope.animalid = $routeParams.animalId;

    //	load asbvs
    $scope.asbvs = [];
    API.asbvs(datasetId, analysisId).then(function (data) {
        $scope.asbvs = data;
        $scope.loadCount++;
    });



    //
    //  FILTERS
    //


    //
    //  SEARCH RESULTS
    //

    //  prepare pagination
    $scope.querycount = 0;
    $scope.currentPage = 1;
    $scope.resultsPerPage = 10;
    $scope.totalPages = 1;

    //	filter update
    $scope.Filter = function () {

        //  perform query
        API.querycount(datasetId, analysisId, getParams()).then(function (data) {
            $scope.querycount = data.count;
            $scope.totalPages = Math.ceil(data.count / $scope.resultsPerPage)
        });

    }

    //	prepare parameters
    $scope.Search = function () {

        //	perform searuch
        API.query(datasetId, analysisId, getParams()).then(function (data) {
            $scope.querycount = data.count;
            $scope.query = data;
            $scope.totalPages = Math.ceil(data.count / $scope.resultsPerPage)
        });

    }

    //  prepare selected friends
    $scope.selectedBreeds = function () {
        return filterFilter($scope.breeds, { checked: true });
    }

    //  get parameters
    function getParams() {

        var params = {};
        params.AnimalId_like = $scope.animalid;

        return params;

    }



}
])

    .controller('Matesel', ['$scope', '$routeParams', 'filterFilter', 'API', '$window', '$modal', '$interval', '$timeout', '$sce', function ($scope, $routeParams, filterFilter, API, $window, $modal, $interval, $timeout, $sce) {

        var $controller = this;
        $scope.datasetId = -1;
        $scope.analysisId = -1;

        $scope.loadCount = 0;
        $scope.TermsAndConditionsAccepted = false;
        $scope.TermsAndConditions = "Please wait...";
        //
        //  LOAD DATA
        //



        // animal lists available for analysis for this flock
        $scope.sirelists = [];
        $scope.damlists = [];
        $scope.extpedilists = [];
        $scope.grouplists = [];
        $scope.datasets = [];
        $scope.analyses = [];
        $scope.savedSearches = [];
        $scope.sexes = [];
        $scope.mateselfiles = [];

        $scope.frontierchart = {};
        $scope.frontierchart.type = 'ScatterChart';
        $scope.frontierchart.options = { title: 'Matesel frontier',
            width: '600',
            height: '600',
            series: {
                0: { lineWidth: 1, pointSize: 2 },
                1: { pointSize: 2 }
            }
        };
        var male = {};
        var female = {};

        male.sex = 'M';
        male.description = 'Sires';

        female.sex = 'F';
        female.description = 'Dams';

        $scope.sexes[0] = male;
        $scope.sexes[1] = female;

        $scope.balancestrategies = [{ id: 0, description: "Weighting on coancestry" },
                                     { id: 1, description: "Hard constraint on coancestry" },
                                     { id: 2, description: "Soft constraint on coancestry" },
                                     { id: 3, description: "Hard constraint on target degrees" },
                                     { id: 4, description: "Soft constraint on target degrees" },
                                     { id: 5, description: "Project to target degrees line" },
                                     { id: 6, description: "Projection plus deviation penalty"}];

        $scope.mateselcontroltypes = [];
        var incmean = {};
        var decmean = {};
        var incvariation = {};
        var decvariation = {};
        var incVarAboutOptimum = {};
        var decVarAboutOptimum = {};
        var setMinValueAtBoundary = {};
        var setMaxValueAtBoundary = {};
        var targetBimodality = {};

        incmean.id = 1;
        incmean.description = "Increase Mean";
        decmean.id = 2;
        decmean.description = "Decrease Mean";
        incvariation.id = 3;
        incvariation.description = "Increase Variation";
        decvariation.id = 4;
        decvariation.description = "Decrease Variation";
        incVarAboutOptimum.id = 5;
        incVarAboutOptimum.description = "Increase variation about optimum";
        decVarAboutOptimum.id = 6;
        decVarAboutOptimum.description = "Decrease variation about optimum";
        setMinValueAtBoundary.id = 7;
        setMinValueAtBoundary.description = "Set minimum value at boundary";
        setMaxValueAtBoundary.id = 8;
        setMaxValueAtBoundary.description = "Set maximum value at boundary";
        targetBimodality.id = 9;
        targetBimodality.description = "Target Bimodality";

        $scope.mateselcontroltypes[0] = incmean;
        $scope.mateselcontroltypes[1] = decmean;
        $scope.mateselcontroltypes[2] = incvariation;
        $scope.mateselcontroltypes[3] = decvariation;
        $scope.mateselcontroltypes[4] = incVarAboutOptimum;
        $scope.mateselcontroltypes[5] = decVarAboutOptimum;
        $scope.mateselcontroltypes[6] = setMinValueAtBoundary;
        $scope.mateselcontroltypes[7] = setMaxValueAtBoundary;
        $scope.mateselcontroltypes[8] = targetBimodality

        $scope.customColumns = [];
        $scope.customColumns.push("custom_column1");
        $scope.customColumns.push("custom_column2");
        $scope.customColumns.push("custom_column3");
        $scope.customColumns.push("custom_column4");
        $scope.customColumns.push("custom_column5");
        $scope.customColumns.push("custom_column6");
        $scope.customColumns.push("custom_column7");
        $scope.customColumns.push("custom_column8");
        $scope.customColumns.push("custom_column9");

        $scope.selectedCustomColumn = null;

        $scope.selectedFemaleGroupList = null;
        $scope.selectedMaleGroupList = null;
        $scope.selectedNewGroupSex = null;


        // load local file into variable for presentation as list
        $scope.newListName = '';
        $scope.newListContents = '';
        $scope.listCreationErrors = '';
        $scope.newAnimalList = [];


        $scope.mateseltemplate = null;
        $scope.mateseltemplates = [];


        //  load matesel runs for this user
        $scope.mateselrun = null;
        $scope.mateselruns = [];
        $scope.mateselparams = [];
        $scope.mateseltraits = [];
        $scope.mateselRunConsole = [];
        $scope.mateselRunSummary = [];
        $scope.mateselRunMatings = [];
        $scope.mateselRunIni = [];
        $scope.mateselmalegroups = [];
        $scope.mateselfemalegroups = [];
        $scope.mateselSireSummary = [];

        $scope.newmateselrunname = "";
        $scope.mateselFinishedCount = 0;

        API.TermsAndConditionsAccepted().then(function (data) {
            if (data.Accepted == "Y") {
                $scope.TermsAndConditionsAccepted = true;
            }
            else {
                $scope.TermsAndConditionsAccepted = false;
            }
        });
        API.TermsAndConditions().then(function (data) {
            $scope.TermsAndConditions = data.html;
        });

        $scope.declineTermsAndConditions = function () {
            // eh, not sure what to do here
        };

        $scope.acceptTermsAndConditions = function () {
            API.AcceptTermsAndConditions().then(function (data) {
                $scope.TermsAndConditionsAccepted = "Y";
            });
        };

        $scope.datasetsloading = true;
        API.datasets().then(function (data) {
            $scope.datasets = data;
            $scope.datasetsloading = false;
        });

        //        $scope.$watch('dataset', function (newValue, oldValue) {
        //            if (newValue == null) return;
        //            $scope.datasetId = newValue.id;
        //            $scope.loadAnalyses();
        //        });

        //	load all analysis

        $scope.loadAnalyses = function () {
            $scope.mateselrun = null;
            $scope.analysesloading = true;
            var p = API.analyses($scope.datasetId);
            p.then(function (data) {
                $scope.analyses = data;
                $scope.analysesloading = false;
            });
            return p;
        };

        //        $scope.$watch('analysis', function (newValue, oldValue) {
        //            if (newValue == null) return;
        //            $scope.analysisId = newValue.id;
        //            $scope.loadMatesel();

        //        });

        $scope.loadMatesel = function () {
            $scope.listsloading = true;
            API.lists($scope.datasetId, $scope.analysisId).then(function (data) {
                $scope.sirelists = data;
                $scope.damlists = data;
                $scope.extpedilists = data;
                $scope.grouplists = data;
                $scope.listsloading = false;
            });
            API.savedLists($scope.datasetId, $scope.analysisId).then(function (data) {
                $scope.savedSearches = data;
            });
            API.asbvs($scope.datasetId, $scope.analysisId).then(function (data) {
                $scope.asbvs = data;
                $scope.loadCount++;
                API.mateseltemplates($scope.datasetId, $scope.analysisId).then(function (data) {
                    $scope.mateseltemplates = data;
                    $scope.loadCount++;
                });
                $scope.ReloadMateselRuns();

            });
        };

        // timed interval on a loaded $scope.mateselrun
        $scope.showRunning = function () {
            if ($scope.mateselrun) {
                if ($scope.mateselrun.status == 'INIT' || $scope.mateselrun.status == 'FINISHED' || $scope.mateselrun.status == 'FAILED') {
                    return false;
                }
                return true;
            }
            return false;
        }

        var stop;
        $scope.refreshMateselRunStatus = function () {
            // don't load if matesel is null
            if (angular.isDefined(stop)) return;

            stop = $interval(function () {
                API.mateselrun($scope.datasetId, $scope.analysisId, $scope.mateselrun.id).then(function (data) {
                    $scope.mateselrun = data;
                });
                if ($scope.mateselFinishedCount < 3) {

                    $scope.loadConsole();
                    $scope.drawFrontierChart();
                    if ($scope.mateselrun.status == 'FINISHED' || $scope.mateselrun.status == 'FAILED') {
                        $scope.mateselFinishedCount = $scope.mateselFinishedCount + 1;
                        $scope.loadSummary();
                        $scope.loadSireSummary();
                    }
                    else {
                        $scope.mateselFinishedCount = 0;
                    }
                }
            }, 5000);
        };

        $scope.stopRefreshMateselRunStatus = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };

        $scope.$on('$destroy', function () {
            // Make sure that the interval is destroyed too
            $scope.stopRefreshMateselRunStatus();
        });


        //        $scope.selectedSireList = null;
        //        $scope.selectedDamList = null;
        //        $scope.selectedExtPediList = null;



        $scope.fileNameChanged = function (filename) {
            var file = document.getElementById("listFileName");
            $scope.$apply(function () { $scope.newListFileName = file.files[0]; });

        }

        //        $scope.previewInputFile = function () {
        //                $scope.LoadNewListContents($scope.newListFileName);

        //        }

        $scope.fileLoadProgress = 0;
        $scope.fileLoadProgressMax = 0;
        $scope.fileLoadProgressUpdate = function (progress, total) {
            $scope.fileLoadProgress = progress;
            $scope.fileLoadProgressMax = total;
        }

        $scope.reloadListFromFile = function () {
            $scope.LoadNewListContents($scope.newListName);

        }

        $scope.listPreviewing = false;
        $scope.lastAnimalRead = '';
        $scope.LoadNewListContents = function (aNewListName) {
            $scope.listPreviewing = true;
            // load this slightly deferred so screen shows it is loading a file
            API.getFileData($scope.newListFileName, $scope).then(function (data) {
                var animals = [];
                var returnedResult = [];
                animals = data.split(/\r?\n/);
                for (var i = 0; i < animals.length; i++) {
                    $scope.fileLoadProgressUpdate(i, animals.length);
                    var animalLine = animals[i].split(',');
                    if (animalLine[0].length >= 16) {
                        var newAnimal = {};
                        newAnimal.id = animalLine[0].substring(0, 16);
                        if (animalLine.length > 1) newAnimal.CustomColumn1 = animalLine[1];
                        if (animalLine.length > 2) newAnimal.CustomColumn2 = animalLine[2];
                        if (animalLine.length > 3) newAnimal.CustomColumn3 = animalLine[3];
                        if (animalLine.length > 4) newAnimal.CustomColumn4 = animalLine[4];
                        if (animalLine.length > 5) newAnimal.CustomColumn5 = animalLine[5];
                        if (animalLine.length > 6) newAnimal.CustomColumn6 = animalLine[6];
                        if (animalLine.length > 7) newAnimal.CustomColumn7 = animalLine[7];
                        if (animalLine.length > 8) newAnimal.CustomColumn8 = animalLine[8];
                        if (animalLine.length > 9) newAnimal.CustomColumn9 = animalLine[9];

                        returnedResult.push(newAnimal);
                        $scope.lastAnimalRead = newAnimal[i];
                    }
                }
                // empty list based on name
                $scope.editlist = {};
                $scope.editlist.label = aNewListName;
                $scope.editlist.animals = returnedResult;
                $scope.listPreviewing = false;
            });
        }

        $scope.listFailedMessage = '';
        $scope.listFailedDetails = [];

        $scope.invalidListName = function (listname) {
            if (($scope.datasetId < 0) || ($scope.analysisId < 0)) {
                $scope.listFailedMessage = "Dataset and analysis must be selected";
                return false;
            }
            if (listname.length > 0) {
                for (var i = 0; i < $scope.grouplists.length; i++) {
                    if (listname == $scope.grouplists[i].label) {
                        $scope.listFailedMessage = "List with that name exists";
                        return true;

                    }
                }
                $scope.listFailedMessage = "";
                return false;
            }
            $scope.listFailedMessage = "List name cannot be blank";
            return true;

        };

        $scope.deleteAnimalList = function (aList) {
            var p = API.deleteList($scope.datasetId, $scope.analysisId, $scope.editlist.id);
            p.then(function (data) {
                $scope.listErrorMessage = "List deleted";
                $scope.loadMatesel();
            });
        };

        $scope.CreateList = function (aNewListName) {

            $scope.listCreatedMessage = "Creating list " + aNewListName + " with " + $scope.editlist.animals.length + " animals";
            $scope.editlist.label = aNewListName;
            // create list, then start shoving animals into it
            var theseAnimals = '';
            for (var i = 0; i < $scope.editlist.animals.length; i++) {
                if (!$scope.editlist.animals[i].Deleted) {
                    theseAnimals = theseAnimals + $scope.editlist.animals[i].id;
                    if (i < ($scope.editlist.animals.length - 1)) theseAnimals = theseAnimals + ',';
                }
            }
            var p = API.createList($scope.datasetId, $scope.analysisId, $scope.editlist.label, theseAnimals);
            p.then(function (data) {
                $scope.listCreatedMessage = 'List created ' + data.id + data.label;
                var animals = $scope.editlist.animals;
                $scope.editlist = data[0];
                $scope.editlist.animals = animals;
                $scope.grouplists.push(data[0]);
                var updated = [];
                var removed = '';
                var added = [];
                for (var i = 0; i < $scope.editlist.animals.length; i++) {
                    $scope.fileLoadProgressUpdate(i, $scope.editlist.animals.length);
                    if (!$scope.editlist.animals[i].Deleted) {

                        var params = {};
                        if ($scope.editlist.animals[i].MinUse) params.MinUse = $scope.editlist.animals[i].MinUse;
                        if ($scope.editlist.animals[i].MaxUse) params.MaxUse = $scope.editlist.animals[i].MaxUse;
                        if ($scope.editlist.animals[i].AbsMinUse) params.AbsMinUse = $scope.editlist.animals[i].AbsMinUse;
                        if ($scope.editlist.animals[i].CustomColumn1) params.CustomColumn1 = $scope.editlist.animals[i].CustomColumn1;
                        if ($scope.editlist.animals[i].CustomColumn2) params.CustomColumn2 = $scope.editlist.animals[i].CustomColumn2;
                        if ($scope.editlist.animals[i].CustomColumn3) params.CustomColumn3 = $scope.editlist.animals[i].CustomColumn3;
                        if ($scope.editlist.animals[i].CustomColumn4) params.CustomColumn4 = $scope.editlist.animals[i].CustomColumn4;
                        if ($scope.editlist.animals[i].CustomColumn5) params.CustomColumn5 = $scope.editlist.animals[i].CustomColumn5;
                        if ($scope.editlist.animals[i].CustomColumn6) params.CustomColumn6 = $scope.editlist.animals[i].CustomColumn6;
                        if ($scope.editlist.animals[i].CustomColumn7) params.CustomColumn7 = $scope.editlist.animals[i].CustomColumn7;
                        if ($scope.editlist.animals[i].CustomColumn8) params.CustomColumn8 = $scope.editlist.animals[i].CustomColumn8;
                        if ($scope.editlist.animals[i].CustomColumn9) params.CustomColumn9 = $scope.editlist.animals[i].CustomColumn9;

                        API.listUpdateAnimal($scope.datasetId, $scope.analysisId, $scope.editlist.id, $scope.editlist.animals[i].id, params);
                    }
                }

            }, function (error) {

                // failed to create list
                $scope.listFailedMessage = 'List failed to create on server: ' + error.message;
                $scope.listFailedDetails = error.details;
                for (var i = 0; i < $scope.listFailedDetails.length; i++) {
                    for (var j = 0; j < $scope.editlist.animals.length; j++) {
                        if ($scope.editlist.animals[j].id == $scope.listFailedDetails[i].id) {
                            $scope.editlist.animals[j].Failed = true;
                            $scope.editlist.animals[j].FailedMessage = $scope.listFailedDetails[i].message;
                        }
                    }
                }
            });
        };

        $scope.showListErrors = function () {


            $timeout(function () {
                var modalInstance = $modal.open({
                    templateUrl: 'errorDisplay.html',
                    controller: 'ErrorListController',
                    resolve: { errorList: function () { return $scope.listFailedDetails; } }
                });
                modalInstance.result.then(function (result) {

                });
            }, 500);
        };

        $scope.PreviewList = function (aNewListName) {


            $timeout(function () {
                var modalInstance = $modal.open({
                    templateUrl: 'animalEditor.html',
                    controller: 'ModalController',
                    resolve: { animalsToEdit: function () { return $scope.editlist.animals; } }
                });
                modalInstance.result.then(function (result) {
                    $scope.editlist.animals = result;
                    $scope.listPreviewing = false;

                });
            }, 500);
            $scope.listPreviewing = true;
        };

        $scope.convertSearchToList = function (aNewListName, aSearch) {
            var params = {};
            params.SEARCHID = aSearch.id;
            var p = API.createListFromSavedQuery($scope.datasetId, $scope.analysisId, aNewListName, params);
            p.then(function (data) { $scope.newAnimalList = "label: " + data[0].label + " created " + data[0].created; $scope.loadMatesel() });
            return p;
        }

        $scope.createNewList = function () {
            var p = API.createList($scope.datasetId, $scope.analysisId, $scope.editlist.label, $scope.editlist.animals);
            p.then(function (data2) { $scope.newAnimalList = "label: " + data2[0].label + " created " + data2[0].created + " with " + data2[0].size + " animals."; $scope.loadMatesel() });
            return p;
        }
        //  load matesel templates


        $scope.ReloadMateselRuns = function () {
            API.mateselruns($scope.datasetId, $scope.analysisId).then(function (data) {
                $scope.mateselruns = data;
                $scope.loadCount++;
            });
        };

        $scope.selecteddataset = {};
        $scope.selectedanalysis = {};
        $scope.selectedrun = {};

        $scope.setDataset = function (ds) {
            $scope.datasetId = ds.id; $scope.loadAnalyses()
        };

        $scope.setAnalysis = function (an) {
            $scope.analysisId = an.id; $scope.loadMatesel()
        };

        $scope.setMateselRun = function (ms) {
            $scope.mateselrun = ms; $scope.mateselFinishedCount = 0;
        };

        $scope.invalidRunName = function (runTemplate, runIndex, runCustom, runName) {
            if (($scope.datasetId < 0) || ($scope.analysisId < 0)) {
                $scope.lastRunErrorMessage = "Dataset and analysis must be selected";
                return false;
            }
            if (!runTemplate) {
                $scope.lastRunErrorMessage = "Run template must be selected";
                return false;
            }
            if (!runIndex && !runCustom) {
                $scope.lastRunErrorMessage = "You must selected an index OR a custom column";
                return false;
            }
            if (runName.length > 0) {
                for (var i = 0; i < $scope.mateselruns.length; i++) {
                    if (runName == $scope.mateselruns[i].description) {
                        $scope.lastRunErrorMessage = "Run name exists";
                        return true;
                    }
                }
                $scope.lastRunErrorMessage = "";
                return false;
            }
            $scope.lastRunErrorMessage = "Run name cannot be blank";
            return true;

        };



        $scope.createMateselRun = function (runTemplate, runIndex, runCustom, runName) {
            var p = API.createMateselRun($scope.datasetId, $scope.analysisId, runTemplate.name, runName, runIndex.id, runCustom);
            p.then(function (data) {
                if (data.id > 0) {
                    $scope.lastRunSuccessMessage = "Run id " + data.id + " created as " + data.description;

                }
                else {
                    $scope.lastRunSuccessMessage = "Run creation failed";
                }
                $scope.ReloadMateselRuns();
            });
            return p;

        };

        $scope.loadTraits = function () {
            API.mateselruntraits($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                $scope.mateseltraits = data;
            });

        }

        $scope.loadParams = function () {
            API.mateselrunsettings($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                $scope.mateselparams = data;
            });

        }
        $scope.loadGroups = function () {

            API.getMateselRunGroups($scope.datasetId, $scope.analysisId, $scope.msrunid, 'M').then(function (data) {
                $scope.mateselmalegroups = data;
            });
            API.getMateselRunGroups($scope.datasetId, $scope.analysisId, $scope.msrunid, 'F').then(function (data) {
                $scope.mateselfemalegroups = data;
            });
        }

        $scope.loadConsole = function () {
            API.getMateselRunConsole($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                $scope.mateselRunConsole = data;
            });

        }

        $scope.loadSummary = function () {
            API.getMateselRunSummary($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                $scope.mateselRunSummary = data;
            });

        }

        $scope.loadSireSummary = function () {
            API.getMateselSireSummary($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                $scope.mateselSireSummary = data;
            });

        }

        $scope.loadMatings = function () {
            API.getMateselMatings($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                $scope.mateselMatings = data;
            });

        }

        $scope.drawFrontierChart = function () {
            // have to fetch this data 
            $scope.frontierData = API.getMateselFrontier($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (frontdata) {
                var data = sgHelpers.generateFrontierGraphData(
                frontdata
            );
                $scope.frontierchart.data = data;
            });
        }

        $scope.loadIni = function () {
            $scope.mateselRunIni = API.getMateselRunIni($scope.datasetId, $scope.analysisId, $scope.msrunid);

        }
        $scope.loadMatings = function () {
            API.getMateselRunMatings($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                $scope.mateselRunMatings = data;
            });

        }

        $scope.loadPermissions = function (group) {

            API.getMateselRunGroupPermissions($scope.datasetId, $scope.analysisId, $scope.msrunid, group.GroupSex, group.GroupNumber).then(function (data) {
                group.permissions = data;
            });

        }

        $scope.loadMateselFiles = function () {
            API.getMateselOutputFiles($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                $scope.mateselfiles = data;
            });

        }

        $scope.$watch('mateselmalegroups', function (newValue, oldValue) {
            if (newValue != null) {
                for (var i = 0; i < newValue.length; i++) {
                    $scope.loadPermissions(newValue[i]);
                }
            }
        });

        $scope.$watch('mateselfemalegroups', function (newValue, oldValue) {
            if (newValue != null) {
                for (var i = 0; i < newValue.length; i++) {
                    $scope.loadPermissions(newValue[i]);
                }
            }
        });

        $scope.mateselrun = null;
        $scope.$watch('mateselrun', function (newValue, oldValue) {
            if (newValue == null) {
                $scope.stopRefreshMateselRunStatus();
                return;
            }
            var shouldLoad = false;
            if ($scope.msrunid != newValue.id) {
                $scope.stopRefreshMateselRunStatus();
                $scope.msrunid = newValue.id;
                $scope.loadTraits();
                $scope.loadParams();
                $scope.loadGroups();
                //$scope.loadMatings();
                //$scope.loadIni();
                $scope.loadConsole();
                $scope.drawFrontierChart();
                $scope.loadMateselFiles();
                $scope.refreshMateselRunStatus();
            }
            // don't do anything else, let angular flush any changed run values back to screen
        });

        $scope.editableMateselParameter = function (run_param) {
            if (run_param.parameter_type == 'I') return true;
            if (run_param.parameter_type == 'R') return true;
            return false;
        }
        $scope.notEditableMateselParameter = function (run_param) {
            if (run_param.parameter_type == 'I') return false;
            if (run_param.parameter_type == 'R') return false;
            return true;
        }
        $scope.editedrunparams = [];
        $scope.updateParameter = function (parameter_order) {
            API.setParameterValue($scope.datasetId, $scope.analysisId, $scope.msrunid, parameter_order, $scope.editedrunparams[parameter_order]).then(function (data) {
                API.mateselrunsettings($scope.datasetId, $scope.analysisId, $scope.msrunid).then(function (data) {
                    $scope.mateselparams = data
                });
            });
        }

        $scope.selectedNewTrait = '';
        $scope.addMateselRunTrait = function (newTrait) {
            var p = API.addMateselRunTrait($scope.datasetId, $scope.analysisId, $scope.msrunid, newTrait.id);
            p.then(function (data) {
                $scope.loadTraits();
            });
            return p;

        }
        $scope.addMateselCustomColumn = function (customColumn) {
            var p = API.addMateselRunTrait($scope.datasetId, $scope.analysisId, $scope.msrunid, customColumn);
            p.then(function (data) {
                $scope.loadTraits();
            });
            return p;

        }
        $scope.updateMateselRunTrait = function (trait) {
            var params = {};
            params.TRAITORDER = trait.traitorder;
            params.CONTROLTYPE = trait.control_type;
            params.WEIGHTING = trait.weighting;
            params.TARGET1 = trait.target1;
            params.TARGET2 = trait.target2;
            params.TARGET3 = trait.target3;
            params.INVOKED = trait.invoked;
            var p = API.updateMateselRunTrait($scope.datasetId, $scope.analysisId, $scope.msrunid, trait.trait, params);
            p.then(function (data)
            { $scope.loadTraits(); });
            return p;
        }
        $scope.deleteMateselRunTrait = function (trait) {
            API.deleteMateselRunTrait($scope.datasetId, $scope.analysisId, $scope.msrunid, trait.trait).then(function (data)
            { $scope.loadTraits(); });
        }
        $scope.addMateselRunGroup = function (sex, id) {
            var params = {};
            params.GROUPLISTID = id;
            //sending a 0 as the run group number means we will get allocated one from 1 to ...
            var p = API.addOrUpdateMateselRunGroup($scope.datasetId, $scope.analysisId, $scope.msrunid, sex, 0, params);
            p.then(function (data)
            { $scope.loadGroups(); });
            return p;

        }
        $scope.updateMateselRunGroup = function (group) {
            var params = {};
            params.GROUPLISTID = group.GroupList;
            params.MINUSE = group.GroupMinuse;
            params.MAXUSE = group.GroupMaxuse;
            params.ABSMINUSE = group.GroupAbsminuse;
            params.NUMMATINGSORSELNPROP = group.NumMatingsOrSelnProp;
            params.NUMMATINGSORSELNPROPVAL = group.NumMatingsOrSelnPropVal;
            params.INVOKEFEMALENUMSORPROPS = group.InvokeFemaleNumsOrProps;
            params.MALESCANBEBACKUPS = group.MalesCanBeBackups;
            params.MAXBACKUPS = group.MaxBackups;
            params.PRESELECTION = group.Preselection;
            params.MALENATMATINGVECTOR = group.MaleNatMatingVector;
            var p = API.addOrUpdateMateselRunGroup($scope.datasetId, $scope.analysisId, $scope.msrunid, group.GroupSex, group.GroupNumber, params);
            p.then(function (data)
            { $scope.loadGroups(); });
            return p;

        }
        $scope.deleteMateselRunGroup = function (group) {
            var params = {};
            var p = API.deleteMateselRunGroup($scope.datasetId, $scope.analysisId, $scope.msrunid, group.GroupSex, group.GroupNumber);
            p.then(function (data)
            { $scope.loadGroups(); });
            return p;

        }
        $scope.deleteMatingGroupPermission = function (maleGroupNumber, femaleGroupNumber) {
            var p = API.deleteMateselRunGroupPermissions($scope.datasetId, $scope.analysisId, $scope.msrunid, 'M', maleGroupNumber, femaleGroupNumber);
            p.then(function (data)
            { $scope.loadGroups(); });
            return p;

        }
        $scope.onDropGroupComplete = function (data, femaleGroupNumber) {
            // one object should be the female group and the other should be the male group
            API.addMateselRunGroupPermissions($scope.datasetId, $scope.analysisId, $scope.msrunid, data.GroupSex, data.GroupNumber, femaleGroupNumber).then(function (data)
            { $scope.loadGroups(); });

        }
        $scope.startMatesel = function () {
            var params = {};
            //            params.SIRES = $scope.selectedSireList.id;
            //            params.DAMS = $scope.selectedDamList.id;
            //            params.EXTPEDI = $scope.selectedExtPediList.id;
            var p = API.submitMateselRun($scope.datasetId, $scope.analysisId, $scope.msrunid, params);
            p.then(function (data)
            { $scope.ReloadMateselRuns($scope.msrunid); });
            return p;
        }

        $scope.stopMatesel = function () {
            var params = {};
            //            params.SIRES = $scope.selectedSireList.id;
            //            params.DAMS = $scope.selectedDamList.id;
            //            params.EXTPEDI = $scope.selectedExtPediList.id;
            var p = API.stopMateselRun($scope.datasetId, $scope.analysisId, $scope.msrunid, params);
            p.then(function (data)
            { $scope.ReloadMateselRuns($scope.msrunid); });
            return p;
        }

        $scope.updateListColumnNames = function (animalList) {
            var params = {};
            if (animalList.CustomColumn1) params.CustomColumn1 = animalList.CustomColumn1;
            if (animalList.CustomColumn2) params.CustomColumn2 = animalList.CustomColumn2;
            if (animalList.CustomColumn3) params.CustomColumn3 = animalList.CustomColumn3;
            if (animalList.CustomColumn4) params.CustomColumn4 = animalList.CustomColumn4;
            if (animalList.CustomColumn5) params.CustomColumn5 = animalList.CustomColumn5;
            if (animalList.CustomColumn6) params.CustomColumn6 = animalList.CustomColumn6;
            if (animalList.CustomColumn7) params.CustomColumn7 = animalList.CustomColumn7;
            if (animalList.CustomColumn8) params.CustomColumn8 = animalList.CustomColumn8;
            if (animalList.CustomColumn9) params.CustomColumn9 = animalList.CustomColumn9;

            API.listUpdate($scope.datasetId, $scope.analysisId, animalList.id, params);

        }
        // modal dialogs
        $scope.editlist = undefined;
        $scope.showAnimalListEditor = function (animalList) {
            $scope.editlist = animalList;
            API.list($scope.datasetId, $scope.analysisId, $scope.editlist.id).then(function (data) {
                $scope.editlist.animals = data;

                var modalInstance = $modal.open({
                    templateUrl: 'animalEditor.html',
                    controller: 'ModalController',
                    resolve: { animalsToEdit: function () { return $scope.editlist.animals; } }
                });
                modalInstance.result.then(function (result) {
                    var updated = [];
                    var removed = '';
                    var added = [];
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].Deleted) {
                            removed = removed + result[i].id + ',';
                        }
                        if (result[i].Updated) {
                            updated.push(result[i]);
                        }
                        if (result[i].Added) {
                            added.push(result[i]);
                        }
                    }
                    if (removed.length > 0) {
                        API.deleteFromList($scope.datasetId, $scope.analysisId, $scope.editlist.id, removed);
                    }
                    for (var j = 0; j < updated.length; j++) {
                        var params = {};
                        if (updated[j].MinUse) params.MinUse = updated[j].MinUse;
                        if (updated[j].MaxUse) params.MaxUse = updated[j].MaxUse;
                        if (updated[j].AbsMinUse) params.AbsMinUse = updated[j].AbsMinUse;
                        if (updated[j].CustomColumn1) params.CustomColumn1 = updated[j].CustomColumn1;
                        if (updated[j].CustomColumn2) params.CustomColumn2 = updated[j].CustomColumn2;
                        if (updated[j].CustomColumn3) params.CustomColumn3 = updated[j].CustomColumn3;
                        if (updated[j].CustomColumn4) params.CustomColumn4 = updated[j].CustomColumn4;
                        if (updated[j].CustomColumn5) params.CustomColumn5 = updated[j].CustomColumn5;
                        if (updated[j].CustomColumn6) params.CustomColumn6 = updated[j].CustomColumn6;
                        if (updated[j].CustomColumn7) params.CustomColumn7 = updated[j].CustomColumn7;
                        if (updated[j].CustomColumn8) params.CustomColumn8 = updated[j].CustomColumn8;
                        if (updated[j].CustomColumn9) params.CustomColumn9 = updated[j].CustomColumn9;

                        API.listUpdateAnimal($scope.datasetId, $scope.analysisId, $scope.editlist.id, updated[j].id, params);
                    }
                });
            });



        };


        //
        //  FILTERS
        //
    }
])

.controller('ErrorListController', function ($scope, $modalInstance, errorList) {

    $scope.errorList = errorList;
    $scope.ok = function () {
        $modalInstance.close();
    };

})

.controller('ModalController', function ($scope, $modalInstance, animalsToEdit) {

    $scope.newAnimal = new Object();
    $scope.editlistanimals = animalsToEdit;
    $scope.ok = function () {
        $modalInstance.close($scope.editlistanimals);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.setAnimalUpdated = function (animal) {
        animal.Updated = true;
    };

    $scope.setAnimalDeleted = function (animal) {
        animal.Deleted = !animal.Deleted;
    };

    $scope.addAnimal = function () {
        $scope.newAnimal.Updated = true;
        $scope.editlistanimals.push($scope.newAnimal);
        $scope.newAnimal = new Object();
    };
})
/****************************/
/********** CHARTS **********/
/****************************/

    .controller('Charts', ['$scope', '$routeParams', 'API', '$q', '$window', function ($scope, $routeParams, API, $q, $window) {
        var $controller = this;

        // Models
        $scope.selection = {};
        $scope.selection.global = {};
        $scope.selection.chart1 = {};
        $scope.selection.chart2 = {};
        $scope.selection.chartIntervalsMale = {};
        $scope.selection.chartIntervalsFemale = {};
        $scope.selection.distributionchart1 = {};
        $scope.selection.distributionchart2 = {};

        // Private variables
        this._datasetId = null;
        this._analysisId = null;
        this._flockCode = null;
        this._flock = null;

        this._chart1 = {};
        this._chart1.breakdown = null;
        this._chart1.trait = null;

        this._chart2 = {};
        this._chart2.breakdown = null;
        this._chart2.trait = null;

        this._traits = null;
        this._dropAverages = null;
        this._dropAverageAccuracies = null;
        this._groupAverages = null;
        this._groupAverageAccuracies = null;
        this._flockAverages = null;
        this._flockAverageAccuracies = null;

        this._generationIntervals = null;
        this._flockGenerationIntervals = null;
        this._groupGenerationIntervals = null;

        this._flockDistribution1 = null;
        this._flockDistribution2 = null;

        // methods
        $controller.clearAnalyses = function () { $controller._analysisId = null; $scope.analyses = null; $scope.selection.global.analysis = null; }
        $controller.clearFlocks = function () { $controller._flockCode = null; $controller._flock = null; $scope.flocks = null; $scope.selection.global.flock = null; }
        $controller.clearChart1Breakdowns = function () { $controller._chart1.breakdown = null; $scope.chart1Breakdowns = null; $scope.selection.chart1.breakdown = null; }
        $controller.clearChart1Traits = function () { $controller._chart1.trait = null; $scope.chart1Traits = null; $scope.selection.chart1.trait = null; }
        $controller.clearChart2Breakdowns = function () { $controller._chart2.breakdown = null; $scope.chart2Breakdowns = null; $scope.selection.chart2.breakdown = null; }
        $controller.clearChart2Traits = function () { $controller._chart2.trait = null; $scope.chart2Traits = null; $scope.selection.chart2.trait = null; }
        $controller.clearChart1 = function () { $scope.chart1.data = sgHelpers.generateGraphData($scope.selection.global.year); }
        $controller.clearChart2 = function () { $scope.chart2.data = sgHelpers.generateGraphData($scope.selection.global.year); }
        $controller.clearChartIntervalsMale = function () { $scope.chart1.data = sgHelpers.generateGraphData($scope.selection.global.year); }
        $controller.clearChartIntervalsFemale = function () { $scope.chart2.data = sgHelpers.generateGraphData($scope.selection.global.year); }
        $controller.drawChart1 = function () {
            var data = sgHelpers.generateGraphData(
                $scope.selection.global.year,
                $controller._chart1.breakdown,
                !$scope.selection.chart1.accuracies ? $controller._dropAverages : $controller._dropaverageAccuracies,
                !$scope.selection.chart1.accuracies ? $controller._groupAverages : $controller._groupAverageAccuracies,
                !$scope.selection.chart1.accuracies ? $controller._flockAverages : $controller._flockAverageAccuracies,
                $controller._chart1.trait,
                ["drop_year", "drop_year", "drop_year"]
            );
            $scope.chart1.data = data;
        }
        $controller.drawChart2 = function () {
            var data = sgHelpers.generateGraphData(
                $scope.selection.global.year,
                $controller._chart2.breakdown,
                !$scope.selection.chart2.accuracies ? $controller._dropAverages : $controller._dropaverageAccuracies,
                !$scope.selection.chart2.accuracies ? $controller._groupAverages : $controller._groupAverageAccuracies,
                !$scope.selection.chart2.accuracies ? $controller._flockAverages : $controller._flockAverageAccuracies,
                $controller._chart2.trait,
                ["drop_year", "drop_year", "drop_year"]
            );
            $scope.chart2.data = data;
        }
        $controller.drawChartIntervalsMale = function () {
            var data = sgHelpers.generateGraphData(
                $scope.selection.global.year,
                null,
                $controller._generationIntervals,
                $controller._groupGenerationIntervals = null,
                $controller._flockGenerationIntervals,
                "sire_avg_age",
                ["year_drop", null, "flock_drop"]
            );
            $scope.chartIntervalsMale.data = data;
        }
        $controller.drawChartIntervalsFemale = function () {
            var data = sgHelpers.generateGraphData(
                $scope.selection.global.year,
                null,
                $controller._generationIntervals,
                $controller._groupGenerationIntervals = null,
                $controller._flockGenerationIntervals,
                "dam_avg_age",
                ["year_drop", null, "flock_drop"]
            );
            $scope.chartIntervalsFemale.data = data;
        }


        $controller.drawDistributionChart1 = function () {
            // have to fetch this data 
            var params = {};
            params.dropyear = $scope.selection.global.year;
            params.breakdown = $controller._chart1.breakdown;
            params.traitname = $controller._chart1.trait;
            $scope.distributionData1 = API.flockDistribution($controller._datasetId, $controller._analysisId, $controller._flockCode, params).then(function (distdata) {
                var data = sgHelpers.generateDistributionGraphData(
                distdata
            );
                $scope.distributionchart1.data = data;
            });
        }
        $controller.drawDistributionChart2 = function () {
            // have to fetch this data 
            var params = {};
            params.dropyear = $scope.selection.global.year;
            params.breakdown = $controller._chart2.breakdown;
            params.traitname = $controller._chart2.trait;
            $scope.distributionData2 = API.flockDistribution($controller._datasetId, $controller._analysisId, $controller._flockCode, params).then(function (distdata) {
                var data = sgHelpers.generateDistributionGraphData(distdata
            );
                $scope.distributionchart2.data = data;
            });
        }

        $scope.credentialsAccepted = true;  // true if we are logged in via forms authentication
        //$scope.credentialsAccepted = ($scope.selection.username != null && $scope.selection.username != "" && $scope.selection.password != null && $scope.selection.password != "");

        if ($scope.credentialsAccepted) {
            //	Load the Datasets
            API.datasets().then(function (data) {
                $scope.datasets = data;
            });
        };


        // Setup Chart types
        $scope.chartTypes = ['LineChart', 'AreaChart', 'PieChart', 'ColumnChart', 'BarChart', 'Table'];
        $scope.selection.global.chartType = $scope.chartTypes[0];

        // setup the last amount of years they can view
        var years = [];
        for (var i = new Date().getFullYear(); i >= 1950; i--)
            years.push(i);
        $scope.years = years;
        $scope.selection.global.year = 2004;
        $scope.$watch('selection.global.year', function (newYear, oldYear) {
            if ($scope.selection.chart1.trait)
                $controller.drawChart1();
            if ($scope.selection.chart2.trait)
                $controller.drawChart2();
        });

        // The Charts and code for when the Chart Type is changed
        $scope.chart1 = {};
        $scope.chart1.options = { 'title': 'ASBV', 'isStacked': "true", 'legend': 'top' }
        $scope.chart2 = {};
        $scope.chart2.options = { 'title': 'ASBV', 'isStacked': "true", 'legend': 'top' }
        $scope.chartIntervalsMale = {};
        $scope.chartIntervalsMale.options = { 'title': 'Male', 'isStacked': "true", 'legend': 'top' }
        $scope.chartIntervalsFemale = {};
        $scope.chartIntervalsFemale.options = { 'title': 'Female', 'isStacked': "true", 'legend': 'top' }
        $scope.distributionchart1 = {};
        $scope.distributionchart1.options = { title: 'Distribution of percentiles over years', vAxis: { direction: -1 }, colorAxis: { colors: ['red', 'blue'] }, 'legend': 'top' };
        $scope.distributionchart1.type = 'BubbleChart';
        $scope.distributionchart2 = {};
        $scope.distributionchart2.options = { title: 'Distribution of percentiles over years', vAxis: { direction: -1 }, colorAxis: { colors: ['red', 'blue'] }, 'legend': 'top' };
        $scope.distributionchart2.type = 'BubbleChart';
        $controller.clearChart1();
        $controller.clearChart2();
        $controller.clearChartIntervalsMale();
        $controller.clearChartIntervalsFemale();
        $scope.$watch('selection.global.chartType', function (newType, oldType) {
            $scope.chart1.type = newType;
            $scope.chart2.type = newType;
            $scope.chartIntervalsMale.type = newType;
            $scope.chartIntervalsFemale.type = newType;
        });

        // Watch the accuracies checkboxes
        $scope.$watch('selection.chart1.accuracies', function (newAcc, oldAcc) { if ($scope.selection.chart1.trait) $controller.drawChart1(); });
        $scope.$watch('selection.chart2.accuracies', function (newAcc, oldAcc) { if ($scope.selection.chart2.trait) $controller.drawChart2(); });

        // Watch and code for when the dataset has been changed
        $scope.$watch('selection.global.dataset', function (newDataset, oldDataset) {

            // Clear out appropriate values
            $controller.clearAnalyses();
            $controller.clearFlocks();
            $controller.clearChart1Breakdowns();
            $controller.clearChart1Traits();
            $controller.clearChart2Breakdowns();
            $controller.clearChart2Traits();
            $controller.clearChart1();
            $controller.clearChart2();

            // Process Change
            if (newDataset != null) {
                // Add the loader
                $scope.loadingAnalysis = true;

                // Set the dataset private variable
                $controller._datasetId = newDataset.id;

                // Get the Analyses list for the chosen dataset
                API.analyses($controller._datasetId).then(function (data) {
                    $scope.analyses = data; // Add the new Analyses list
                    if (data.length == 1)
                        $scope.selection.analysis = data[0];

                    $scope.loadingAnalysis = false; // Remove the loader
                });
            } else {
                $controller._datasetId = null;
            }
        });

        // Watch and code for when the Analysis has been changed
        $scope.$watch('selection.global.analysis', function (newAnalysis, oldAnalysis) {

            // Clear out appropriate values
            $controller.clearFlocks();
            $controller.clearChart1Breakdowns();
            $controller.clearChart1Traits();
            $controller.clearChart2Breakdowns();
            $controller.clearChart2Traits();
            $controller.clearChart1();
            $controller.clearChart2();

            // Process Change
            if (newAnalysis != null) {
                // Add the loader
                $scope.loadingFlocks = true;

                // Set the analysis private variable
                $controller._analysisId = newAnalysis.id;

                // Load the flocks for the chosen Analysis
                $q.all([
                        API.flocks($controller._datasetId, $controller._analysisId),
                        API.traits($controller._datasetId, $controller._analysisId),
                        API.drops($controller._datasetId, $controller._analysisId),
                        API.dropAccuracies($controller._datasetId, $controller._analysisId),
                        API.generationIntervals($controller._datasetId, $controller._analysisId)
                    ])
                    .then(function (data) {
                        $scope.flocks = data[0]; // Add the new flocks list
                        $controller._traits = data[1]; // Save the traits
                        $controller._dropAverages = data[2]; // Save the drop averages
                        $controller._dropaverageAccuracies = data[3]; // Save the drop averages accuracies
                        $controller._generationIntervals = data[4]; // Save the generation intervals
                        $scope.loadingFlocks = false; // Remove the loader
                    });
            }
            else {
                $controller._analysisId = null;
            }
        });

        // Watch and code for when the Flock has been changed
        $scope.$watch('selection.global.flock', function (newflock, oldflock) {

            // Clear out appropriate values
            $controller.clearChart1Breakdowns();
            $controller.clearChart1Traits();
            $controller.clearChart2Breakdowns();
            $controller.clearChart2Traits();
            $controller.clearChart1();
            $controller.clearChart2();

            // Process Change
            if (newflock != null) {
                // Add the loader
                $scope.loadingBreakdowns = true;

                // Set the flock private variable
                $controller._flockCode = newflock;

                // Work out the available breakdowns
                API.flock($controller._datasetId, $controller._analysisId, $controller._flockCode).then(function (data) {
                    // Add the flock
                    $controller._flock = data;

                    // Get the flock and group averages
                    $q.all([
                            API.flockAverages($controller._datasetId, $controller._analysisId, $controller._flockCode),
                            API.groupAverages($controller._datasetId, $controller._analysisId, $controller._flock.group_type.trim()),
                            API.flockAverageAccuracies($controller._datasetId, $controller._analysisId, $controller._flockCode),
                            API.groupAverageAccuracies($controller._datasetId, $controller._analysisId, $controller._flock.group_type.trim()),
                            API.flockGenerationIntervals($controller._datasetId, $controller._analysisId, $controller._flockCode),
                    //API.groupGenerationIntervals($controller._datasetId, $controller._analysisId, $controller._flock.group_type.trim())
                        ])
                        .then(function (data) {

                            $controller._flockAverages = data[0]; // save the new flocks list
                            $controller._groupAverages = data[1]; // save the new group averages list
                            $controller._flockAverageAccuracies = data[2]; // save the new flocks list
                            $controller._groupAverageAccuracies = data[3]; // save the new group averages list
                            $controller._flockGenerationIntervals = data[4];
                            //$controller._groupGenerationIntervals = data[5];

                            // Available breakdowns
                            var availableBreakdowns = [];
                            for (var i = 0; i < $controller._flockAverages.length; i++) {
                                var bd = $controller._flockAverages[i].breakdown;
                                if (availableBreakdowns.indexOf(bd) == -1) {
                                    availableBreakdowns.push(bd);
                                }
                            }

                            // Add the breakdowns to the scope
                            $scope.chart1Breakdowns = availableBreakdowns;
                            $scope.chart2Breakdowns = availableBreakdowns;

                            // Draw the averages charts
                            $controller.drawChartIntervalsMale();
                            $controller.drawChartIntervalsFemale();

                            // Remove the loader
                            $scope.loadingBreakdowns = false;
                        });
                });
            }
            else {
                $controller._flockCode = null;
                $controller._flock = null;
            }


        });

        // Watch and code for when the Flock has been changed
        $scope.$watch('selection.chart1.breakdown', function (newBreakdown, oldBreakdown) {
            // Clear out appropriate values
            $controller.clearChart1Traits();
            $controller.clearChart1();

            // Process Change
            if (newBreakdown != null) {
                // Add the loader
                $scope.loadingChart1Traits = true;

                // Set the breakdown private variable
                $controller._chart1.breakdown = newBreakdown;

                //                // Work out the available traits
                //                var flocks = sgHelpers.getSpecificBreakdown($controller._flockAverages, $controller._breakdown);
                //                var availableTraits = [];
                //                for (var i = 0; i < flocks.length; i++)
                //                {
                //                    for (var flockProp in flocks[i])
                //                    {
                //                        if (flocks[i][flockProp] != null && availableTraits.indexOf(flockProp) == -1 && flockProp != "id" && flockProp != "flock" && flockProp != "drop_year" && flockProp != "breakdown")
                //                        {
                //                            availableTraits.push(flockProp);
                //                        }
                //                    }
                //                }
                //                // Add the traits to the scope
                //                $scope.traits = availableTraits.sort();

                // Set the available traits
                $scope.chart1Traits = $controller._traits;

                // Remove the loader
                $scope.loadingChart1Traits = false;

                // Render a chart with drop and group data
                //$scope.traitChart.data = sgHelpers.generateGraphData($scope.selection.year, $controller._breakdown, $controller._dropAverages, $controller._groupAverages);
            }
            else {
                $controller._chart1.breakdown = null;
            }
        });

        // Watch and code for when the Flock has been changed
        $scope.$watch('selection.chart2.breakdown', function (newBreakdown, oldBreakdown) {
            // Clear out appropriate values
            $controller.clearChart2Traits();
            $controller.clearChart2();

            // Process Change
            if (newBreakdown != null) {
                // Add the loader
                $scope.loadingChart2Traits = true;

                // Set the breakdown private variable
                $controller._chart2.breakdown = newBreakdown;

                // Set the available traits
                $scope.chart2Traits = $controller._traits;

                // Remove the loader
                $scope.loadingChart2Traits = false;

                // Render a chart with drop and group data
                //$scope.traitChart.data = sgHelpers.generateGraphData($scope.selection.year, $controller._breakdown, $controller._dropAverages, $controller._groupAverages);
            }
            else {
                $controller._chart2.breakdown = null;
            }
        });


        // On change of the trait for the graph
        $scope.$watch('selection.chart1.trait', function (newTrait, oldTrait) {
            $controller.clearChart1();

            if (newTrait != null) {
                $controller._chart1.trait = newTrait;
                $controller.drawChart1();
                $controller.drawDistributionChart1();
            } else {
                $controller._chart1.trait = null;
            }
        });

        // On change of the trait for the graph
        $scope.$watch('selection.chart2.trait', function (newTrait, oldTrait) {
            $controller.clearChart2();

            if (newTrait != null) {
                $controller._chart2.trait = newTrait;
                $controller.drawChart2();
                $controller.drawDistributionChart2();
            } else {
                $controller._chart2.trait = null;
            }
        });

        //
        // PAGE METHODS
        //
        $scope.setDisabledClass = function (disabled) {
            if (disabled)
                return "disabled";
            else
                return "";
        }

    } ])


    .controller('MyDetails', ['$scope', '$routeParams', 'filterFilter', 'API', function ($scope, $routeParams, filterFilter, API) {

        $scope.myURL = "";

        $scope.loadMyUrl = function () {
            API.flockExternalURL().then(function (data) {
                $scope.myURL = data.Url;
            });
        };

        $scope.setMyUrl = function (aUrl) {
            API.setFlockExternalURL(aUrl).then(function (data) {
                $scope.myURL = data.Url;
            });
        };

        $scope.blankServiceProvider = [{ id: -1, login: "<none>", description: "<none>"}];
        $scope.serviceproviders = $scope.blankServiceProvider;

        $scope.activeServiceProviders = [];

        $scope.loadAllServiceProviders = function () {
            API.loadAllServiceProviders().then(function (data) {
                $scope.serviceproviders = $scope.blankServiceProvider.concat(data);
            });


        };

        $scope.loadServiceProviders = function () {
            $scope.allsploading = true;
            API.loadServiceProviders().then(function (data) {
                $scope.activeserviceproviders = data;
                $scope.allsploading = false;
            });
        };

        // load my URL
        $scope.loadMyUrl();
        // all available service providers
        $scope.loadAllServiceProviders();
        // just the service providers for this logged in user
        $scope.loadServiceProviders();

        $scope.nominateServiceProvider = function (sp) {
            $scope.sploading = true;
            API.setServiceProvider(sp.id).then(function (data) {
                $scope.lastSPSuccessMessage = "Providers nominated: ";
                for (var i = 0; i < data.length; i++) {
                    $scope.lastSPSuccessMessage += data[i].description + ", ";
                }
                $scope.activeserviceproviders = data;
                $scope.sploading = false;
            });
        }

        $scope.deleteServiceProvider = function (sp) {
            $scope.sploading = true;
            API.deleteServiceProvider(sp.id).then(function (data) {

                $scope.lastSPSuccessMessage = "Providers nominated: ";
                for (var i = 0; i < data.length; i++) {
                    $scope.lastSPSuccessMessage += data[i].description + ", ";
                }
                $scope.activeserviceproviders = data;
                $scope.sploading = false;
            });
        }
    } ])

    .controller('Admin', ['$scope', '$routeParams', 'filterFilter', 'API', function ($scope, $routeParams, filterFilter, API) {

        $scope.serviceproviders = [];

        $scope.clearProvider = function () {
            $scope.blankProvider = [{ id: -1, login: "<new>", password: "", firstname: "<new>", lastname: "", email: "", maxlists: 200}];

            $scope.activeserviceprovider = $scope.blankProvider[0];
        }

        $scope.loadAllServiceProviders = function () {
            $scope.sploading = true;
            API.loadAllServiceProvider().then(function (data) {
                $scope.serviceproviders = $scope.blankProvider.concat(data);
                $scope.clearProvider();
                $scope.sploading = false;
            });


        };

        // all available service providers
        $scope.clearProvider();
        $scope.loadAllServiceProviders();

        $scope.addOrUpdateServiceProvider = function (aprovider) {
            $scope.sploading = true;
            API.addOrUpdateServiceProvider(aprovider.id, aprovider.login, aprovider.password, aprovider.firstname, aprovider.lastname, aprovider.email, aprovider.maxlists).then(function (data) {
                $scope.lastSPSuccessMessage = "Provider created: ";
                $scope.lastSPSuccessMessage += data.id + " " + data.login;
                $scope.activeserviceprovider = data;
                $scope.sploading = false;
                $scope.loadAllServiceProviders();

            });
        }

    } ])

    .controller('MyUpdates', ['$scope', '$routeParams', 'filterFilter', 'API', function ($scope, $routeParams, filterFilter, API) {

        $scope.updates = [];
        $scope.loadingUpdates = true;
        API.updates().then(function (data) {
            $scope.updates = data;
            $scope.loadingUpdates = false;
        });

        $scope.showLoading = function () {
            return $scope.loadingUpdates;
        }
    } ])