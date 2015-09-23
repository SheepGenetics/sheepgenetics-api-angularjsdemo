'use strict';


angular.module('SheepGenetics.services', [])

//
//	API 
//

			.service('API', function ($http, $q, $window) {

			    this.loadCount = 0;
			    this._datasets = null;
			    this._analyses = {};
			    // now try to find user name and hashkey password if we are running in the sheepgenetics domain and we are logged in via forms


			    this._userName = '';
			    this._passwordHash = '';

			    this.setUserPasswordHash = function (username, pwordhash) {
			        this._userName = username;
			        this._passwordHash = pwordhash;
			    };

			    this.setUserPassword = function (username, pword) {
			        this._userName = username;
			        var userPassPhrase = pword + "SGPasswordSalt" + username;
			        this._passwordHash = CryptoJS.SHA1(userPassPhrase);

			    };

			    // Charts
			    this._chartflocks = {};
			    this._traits = {};
			    this._dropAverages = {};
			    this._dropAverageAccuracies = {};
			    this._groupAverages = {};
			    this._groupAverageAccuracies = {};
			    this._flockAverages = {};
			    this._flockAverageAccuracies = {};
			    this._genIntervals = {};
			    this._GroupGenIntervals = {};
			    this._flockGenIntervals = {};
			    this._flockDistribution = {};

			    //
			    //	DISPATCHER
			    //

			    this.datasets = function (params) {
			        var url = '/datasets.json';
			        if (this._datasets == null)
			            this._datasets = this.getData(url, params);
			        return this._datasets;
			    };

			    this.findanimal = function (animalid) {
			        var url = '/findanimal/' + animalid + '.json';
			        var params = [];
			        return this.getData(url, params);
			    };

			    this.analyses = function (id, params) {
			        var url = '/' + id + '/analyses.json';
			        if (typeof (this._analyses[id]) == 'undefined')
			            this._analyses[id] = this.getData(url, params);
			        return this._analyses[id];
			    };

			    this.query = function (datasetId, analysisId, params) {

			        var $this = this;

			        var url = '/' + datasetId + '/' + analysisId + '/query.json';
			        //	debug mode (to get around painfully long request)
			        if (false) {
			            url = 'data.json';
			            var promise = this.getExternalData(url, params).then(function (data) {
			                var results = [];
			                for (var i = 0; i < data.length; i++)
			                    results.push($this.processResult(data[i]));
			                return results;
			            });
			            return promise;
			        }

			        var promise = this.getData(url, params).then(function (data) {
			            var results = [];
			            for (var i = 0; i < data.length; i++)
			                results.push($this.processResult(data[i]));
			            return results;
			        });

			        return promise;
			    };

			    this.querycount = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/querycount.json';
			        return this.getData(url, params);
			    };

			    this.asbvs = function (datasetId, analysisId, params) {

			        var $this = this;

			        var url = '/' + datasetId + '/' + analysisId + '/asbvs.json';
			        var promise = this.getData(url, params).then(function (data) {

			            //	set first 10 columns to be displayed by default
			            for (var i = 0; i < data.length; i++)
			                data[i].display = (i < 10);

			            return data;

			        });

			        return promise;

			    };

			    this.breeds = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/breeds.json';
			        return this.getData(url, params);
			    };

			    this.woolgroups = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/options/woolgroup.json';
			        return this.getData(url, params);
			    };

			    this.sexes = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/options/sex.json';
			        return this.getData(url, params);
			    };

			    this.sirestatuses = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/options/sirestatus.json';
			        return this.getData(url, params);
			    };
			    this.dropyears = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/options/dropyears.json';
			        return this.getData(url, params);
			    };
			    this.breederlocations = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/breeders/regions.json';
			        return this.getData(url, params);
			    };

			    this.TermsAndConditions = function () {
			        var url = '/matesel/user/termsandconditions.json';
			        return this.getData(url);

			    }
			    this.TermsAndConditionsAccepted = function () {
			        var url = '/matesel/user/termsandconditions/accepted.json';
			        return this.getData(url);

			    }
			    this.AcceptTermsAndConditions = function () {
			        var url = '/matesel/user/termsandconditions/accepted';
			        var params = {};
			        params.ACCEPTED = "Y";
			        return this.postData(url, params);
			    }
			    this.mateseltemplates = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/templates.json';
			        return this.getData(url, params);
			    };
			    this.mateselruns = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist.json';
			        return this.getData(url, params);
			    };
			    this.mateselrun = function (datasetId, analysisId, runid, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + runid + '.json';
			        return this.getData(url, params);
			    };

			    this.submitMateselRun = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/submit';
			        return this.postData(url, params)


			    };
			    this.stopMateselRun = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/stop';
			        return this.postData(url, params)


			    };
			    this.getMateselRunConsole = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/console.json';
			        return this.getData(url, params)

			    }
			    this.getMateselRunSummary = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/summary.json';
			        return this.getData(url, params)

			    }
			    this.getMateselSireSummary = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/sireuse.json';
			        return this.getData(url, params)

			    }
			    this.getMateselMatings = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/matings.json';
			        return this.getData(url, params)

			    }
			    this.getMateselFrontier = function (datasetId, analysisId, mateselId) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/frontier.json';
			        return this.getData(url)

			    }
			    this.getMateselRunIni = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/ini.json';
			        return this.getData(url, params)

			    }
			    this.getMateselRunMatings = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/matings.json';
			        return this.getData(url, params)

			    }
			    this.createMateselRun = function (datasetId, analysisId, templateName, runName, index, custom) {
			        var params = {};
			        params.DESCRIPTION = runName;
			        params.TEMPLATE = templateName;
			        params.INDEX = index;
			        if (custom) {
			            params.INDEX = custom;
			        }
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/create';
			        return this.postData(url, params);
			    };

			    this.flocks = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/flocks';
			        return this.getData(url, params);

			    };
			    this.lists = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/list/all';
			        return this.getData(url, params);
			    };
			    this.list = function (datasetId, analysisId, listid) {

			        var url = '/' + datasetId + '/' + analysisId + '/list/' + listid + '.json';
			        return this.getData(url);
			    };
			    this.createList = function (datasetId, analysisId, listname, animal_list) {
			        var params = {};
			        var formDataFormatted = new FormData();
			        formDataFormatted.append('label', listname);
			        formDataFormatted.append('animals', animal_list);
			        var url = '/' + datasetId + '/' + analysisId + '/list/create';
			        return this.postData(url, params, formDataFormatted);
			    };
			    this.deleteList = function (datasetId, analysisId, listid) {
			        var params = {};
			        var formDataFormatted = new FormData();
			        formDataFormatted.append('label', listname);
			        var url = '/' + datasetId + '/' + analysisId + '/list/delete';
			        return this.postData(url, params, formDataFormatted);
			    };
			    this.deleteFromList = function (datasetId, analysisId, listid, animal_list) {
			        var params = {};
			        var formDataFormatted = new FormData();
			        formDataFormatted.append('animals', animal_list);
			        var url = '/' + datasetId + '/' + analysisId + '/list/' + listid + '/remove';
			        return this.postData(url, params, formDataFormatted);
			    };
			    this.listUpdate = function (datasetId, analysisId, listid, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/list/' + listid;
			        return this.postData(url, params);
			    };
			    this.listUpdateAnimal = function (datasetId, analysisId, listid, animalid, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/list/' + listid + '/' + animalid;
			        return this.postData(url, params);
			    };
			    this.savedLists = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/queries/saved.json';
			        return this.getData(url, params);

			    }
			    this.createListFromSavedQuery = function (datasetId, analysisId, listname, params) {
			        var formDataFormatted = new FormData();
			        formDataFormatted.append('label', listname);
			        var url = '/' + datasetId + '/' + analysisId + '/list/createfromsavedquery';
			        return this.postData(url, params, formDataFormatted);

			    }
			    this.mateselruntraits = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/traits.json';
			        return this.getData(url, params);
			    };
			    this.mateselrunsettings = function (datasetId, analysisId, mateselId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/settings.json';
			        return this.getData(url, params);
			    };
			    this.setParameterValue = function (datasetId, analysisId, mateselId, parameterOrder, newValue) {
			        var params = {};
			        params.VALUE = newValue;
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/settings/' + parameterOrder + '/value';
			        return this.postData(url, params);


			    };
			    this.addMateselRunTrait = function (datasetId, analysisId, mateselId, traitName, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/traits/' + traitName;
			        return this.postData(url, params);


			    };
			    this.updateMateselRunTrait = function (datasetId, analysisId, mateselId, traitName, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/traits/' + traitName;
			        return this.postData(url, params);
			    };


			    this.deleteMateselRunTrait = function (datasetId, analysisId, mateselId, traitName, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/traits/' + traitName;
			        return this.deleteData(url, params);
			    };

			    this.getMateselRunGroups = function (datasetId, analysisId, mateselId, groupSex) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/groups/' + groupSex + '.json';
			        return this.getData(url);


			    };
			    this.addOrUpdateMateselRunGroup = function (datasetId, analysisId, mateselId, groupSex, groupNumber, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/groups/' + groupSex + '/' + groupNumber;
			        return this.postData(url, params);


			    };
			    this.deleteMateselRunGroup = function (datasetId, analysisId, mateselId, groupSex, groupNumber) {
			        var params = [];
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/groups/' + groupSex + '/' + groupNumber;
			        return this.deleteData(url, params);
			    };

			    this.getMateselRunGroupPermissions = function (datasetId, analysisId, mateselId, groupSex, groupNumber) {
			        var params = [];
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/groups/' + groupSex + '/' + groupNumber + '/permissions.json';
			        return this.getData(url, params);


			    };

			    this.addMateselRunGroupPermissions = function (datasetId, analysisId, mateselId, groupSex, groupNumber, otherGroupNumber) {
			        var params = [];
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/groups/' + groupSex + '/' + groupNumber + '/permissions/' + otherGroupNumber;
			        return this.postData(url, params);


			    };
			    this.deleteMateselRunGroupPermissions = function (datasetId, analysisId, mateselId, groupSex, groupNumber, otherGroupNumber) {
			        var params = [];
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/groups/' + groupSex + '/' + groupNumber + '/permissions/' + otherGroupNumber;
			        return this.deleteData(url, params);


			    };

			    this.getMateselOutputFiles = function (datasetId, analysisId, mateselId) {

			        var params = [];
			        var url = '/' + datasetId + '/' + analysisId + '/matesel/runlist/' + mateselId + '/files';
			        return this.getData(url, params);

			    }



			    /*******************************/
			    /********** Charts **********/
			    /*******************************/

			    this.drops = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/dropaverages.json';
			        var key = datasetId + "-" + analysisId;
			        if (typeof (this._dropAverages[key]) == 'undefined')
			            this._dropAverages[key] = this.getData(url, params);
			        return this._dropAverages[key];
			    };

			    this.dropAccuracies = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/dropaverageaccuracies.json';
			        var key = datasetId + "-" + analysisId;
			        if (typeof (this._dropAverageAccuracies[key]) == 'undefined')
			            this._dropAverageAccuracies[key] = this.getData(url, params);
			        return this._dropAverageAccuracies[key];
			    };

			    this.chartflocks = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/flocks.json';
			        var key = datasetId + "-" + analysisId;
			        if (typeof (this._chartflocks[key]) == 'undefined')
			            this._chartflocks[key] = this.getData(url, params);
			        return this._chartflocks[key];
			    };

			    this.flock = function (datasetId, analysisId, flockId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/flock/' + flockId + '.json';
			        return this.getData(url, params);
			    };

			    this.groupAverages = function (datasetId, analysisId, group, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/groupaverages/' + group + '.json';
			        var key = datasetId + "-" + analysisId + "-" + group;
			        if (typeof (this._groupAverages[key]) == 'undefined')
			            this._groupAverages[key] = this.getData(url, params);
			        return this._groupAverages[key];
			    };

			    this.groupAverageAccuracies = function (datasetId, analysisId, group, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/groupaverageaccuracies/' + group + '.json';
			        var key = datasetId + "-" + analysisId + "-" + group;
			        if (typeof (this._groupAverageAccuracies[key]) == 'undefined')
			            this._groupAverageAccuracies[key] = this.getData(url, params);
			        return this._groupAverageAccuracies[key];
			    };

			    this.traits = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/asbvs.json';
			        var key = datasetId + "-" + analysisId;
			        if (typeof (this._traits[key]) == 'undefined')
			            this._traits[key] = this.getData(url, params);
			        return this._traits[key];
			    };

			    this.flockAverages = function (datasetId, analysisId, flock, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/flockaverages/' + flock + '.json';
			        var key = datasetId + "-" + analysisId + "-" + flock;
			        if (typeof (this._flockAverages[key]) == 'undefined')
			            this._flockAverages[key] = this.getData(url, params);
			        return this._flockAverages[key];
			    };

			    this.flockAverageAccuracies = function (datasetId, analysisId, flock, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/flockaverageaccuracies/' + flock + '.json';
			        var key = datasetId + "-" + analysisId + "-" + flock;
			        if (typeof (this._flockAverageAccuracies[key]) == 'undefined')
			            this._flockAverageAccuracies[key] = this.getData(url, params);
			        return this._flockAverageAccuracies[key];
			    };

			    this.generationIntervals = function (datasetId, analysisId, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/generationintervals.json';
			        var key = datasetId + "-" + analysisId;
			        if (typeof (this._genIntervals[key]) == 'undefined')
			            this._genIntervals[key] = this.getData(url, params);
			        return this._genIntervals[key];
			    };

			    this.groupGenerationIntervals = function (datasetId, analysisId, group, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/groupgenerationintervals/' + group + '.json';
			        var key = datasetId + "-" + analysisId + "-" + group;
			        if (typeof (this._GroupGenIntervals[key]) == 'undefined')
			            this._GroupGenIntervals[key] = this.getData(url, params);
			        return this._GroupGenIntervals[key];
			    };

			    this.flockGenerationIntervals = function (datasetId, analysisId, flock, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/flockgenerationintervals/' + flock + '.json';
			        var key = datasetId + "-" + analysisId + "-" + flock;
			        if (typeof (this._flockGenIntervals[key]) == 'undefined')
			            this._flockGenIntervals[key] = this.getData(url, params);
			        return this._flockGenIntervals[key];
			    };

			    this.flockDistribution = function (datasetId, analysisId, flock, params) {
			        var url = '/' + datasetId + '/' + analysisId + '/statistics/distribution/' + flock + '.json';
			        return this.getData(url, params);
			    }

			    this.updates = function () {
			        var url = '/updates.json';
			        return this.getData(url);


			    }

			    // MyDetails screen

			    this.flockExternalURL = function () {
			        var url = '/ExternalUrl.json';
			        return this.getData(url);

			    }
			    this.setFlockExternalURL = function (extURL) {
			        var url = '/ExternalUrl.json';
			        var params = {};
			        params.url = extURL;
			        return this.postData(url, params);

			    }
			    this.loadAllServiceProviders = function () {
			        var url = '/serviceproviders/all.json';
			        return this.getData(url);

			    }

			    // admin screen, more details for admins
			    this.loadAllServiceProvider = function () {
			        var url = '/serviceprovider/all.json';
			        return this.getData(url);

			    }
			    // just those providers for this user
			    this.loadServiceProviders = function () {
			        var url = '/serviceproviders.json';
			        return this.getData(url);

			    }

			    // add a provider
			    this.setServiceProvider = function (id) {
			        var url = '/serviceproviders/' + id;
			        return this.postData(url);

			    }

			    // delete a provider
			    this.deleteServiceProvider = function (id) {
			        var url = '/serviceproviders/' + id;
			        return this.deleteData(url);

			    }

			    // add a brand new service provider (admin only)
			    this.addOrUpdateServiceProvider = function (spid, login, password, firstname, lastname, email, maxlists) {
			        var params = {};
			        //        public const string SP_LOGIN = "LOGIN";
			        //        public const string SP_PASSWORD = "PASSWORD";
			        //        public const string SP_FIRSTNAME = "FIRSTNAME";
			        //        public const string SP_LASTNAME = "LASTNAME";
			        //        public const string SP_EMAIL = "EMAIL";
			        //        public const string SP_MAXLISTS = "MAXLISTS";
			        var formDataFormatted = new FormData();
			        formDataFormatted.append('LOGIN', login);
			        formDataFormatted.append('PASSWORD', password);
			        formDataFormatted.append('FIRSTNAME', firstname);
			        formDataFormatted.append('LASTNAME', lastname);
			        formDataFormatted.append('EMAIL', email);
			        formDataFormatted.append('MAXLISTS', maxlists);
			        var url = '/serviceprovider/' + spid;
			        return this.postData(url, params, formDataFormatted);


			    }

			    //	
			    //	PROCESS DATA
			    //	

			    this.processResult = function (result) {

			        var data = {};

			        //	turn breeding values into 
			        var breedingvalues = result.breedingvalues;
			        for (var i = 0; i < breedingvalues.length; i++)
			            data[breedingvalues[i].name] = breedingvalues[i];
			        result.data = data;

			        //console.log(JSON.stringify(result, null, 2));
			        return result;

			    };


			    //             DELETE DATA
			    //
			    this.deleteData = function (location, params) {

			        var $this = this;
			        var deferred = $q.defer();

			        var url = this.getApiUrl(location, params);
			        var authHeader = this.getAuthHeader();
			        $http({
			            method: 'DELETE',
			            url: url,
			            headers: { 'Authorization': authHeader }
			        }).
						        success(function (data) {
						            deferred.resolve(data);
						            $this.loadCount++;
						        }).
							error(function () {
							    deferred.reject();
							}
									);
			        //console.log('DELETE] ' + url);
			        return deferred.promise;
			    }


			    //             POST DATA
			    //
			    this.postData = function (location, params, formdata) {

			        var $this = this;
			        var deferred = $q.defer();

			        var url = this.getApiUrl(location, params);
			        var authHeader = this.getAuthHeader();
			        $http({
			            method: 'POST',
			            url: url,
			            headers: { 'Content-Type': undefined, 'Authorization': authHeader },
			            transformRequest: angular.identity,
			            data: formdata
			        }).
						        success(function (data) {
						            deferred.resolve(data);
						            $this.loadCount++;
						        }).
							error(function (response) {
							    deferred.reject(response);
							}
									);

			        //console.log('POST] ' + url);
			        return deferred.promise;
			    }

			    //
			    //	RETRIEVE DATA
			    //

			    this.getFileData = function (fileName, scope) {
			        var deferred = $q.defer();
			        var r = new FileReader();
			        r.onprogress = function (event) {
			            scope.fileLoadProgressUpdate(event.loaded, event.total, true);

			        };
			        r.onload = function () {
			            var aresult = this.result;
			            deferred.resolve(aresult);
			        };
			        r.readAsText(fileName);
			        return deferred.promise;

			    }
			    this.getData = function (location, params) {

			        var $this = this;
			        var deferred = $q.defer();

			        var url = this.getApiUrl(location, params);
			        var authHeader = this.getAuthHeader();
			        $http({
			            method: 'GET',
			            url: url,
			            headers: { 'Authorization': authHeader }
			        }).
						        success(function (data) {
						            deferred.resolve(data);
						            $this.loadCount++;
						        }).
							error(function (response) {
							    deferred.reject(response);
							}
									);
			        //console.log('REQUEST] ' + url);
			        return deferred.promise;
			    }

			    this.getExternalData = function (location, params) {

			        var deferred = $q.defer();
			        var authHeader = this.getAuthHeader();
			        $http({
			            method: 'GET',
			            url: location,
			            headers: { 'Authorization': authHeader }
			        }).
						        success(function (data) {
						            deferred.resolve(data);
						        }).
							error(function (response) {
							    deferred.reject(response);
							}
									);

			        //console.log('REQUEST] ' + location);
			        return deferred.promise;
			    }
			    this.getAuthHeader = function () {
			        this.setUserPassword($window.sgun, $window.sgpw);

			        var secretAppAPIKey = "87a52d10878602fbcd92f98e9d825886";
			        var publicAppAPIKey = "eec14b44831b571a7dbbc70432a4c145";

			        //	PREPARE RESTFUL REQUEST

			        var timeStamp = Math.round(Date.now() / 1000);
			        var messageSignature = publicAppAPIKey + this._userName + timeStamp;
			        var hmac = CryptoJS.HmacSHA1(messageSignature, secretAppAPIKey + this._passwordHash);

			        var authHeader = 'SheepGenetics appid="' + publicAppAPIKey + '",userid="' + this._userName + '",timestamp="' + timeStamp + '",apikey="' + hmac + '"';
			        return authHeader;
			    }

			    this.getApiUrl = function (location, params) {

			        //var apiUrl = "http://sgsearchqa.sheepgenetics.org.au/api/1";
			        //var apiUrl = "http://localhost:4215/api/1";
			        if (!window.location.origin) {
			            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
			        }
			        var apiUrl = "";
			        //                    if (!window.location.origin.contains('sheepgenetics.org.au'))
			        //                    {
			        //                        apiUrl = "http://sgsearch.sheepgenetics.org.au/api/1";
			        //                    }
			        //                    else
			        //                    {
			        apiUrl = window.location.origin + "/api/1";
			        //                    }

			        if (typeof (params) == 'object')
			            params = '?' + this.serialize(params);
			        else if (typeof (params) == 'undefined')
			            params = '';

			        //	REQUEST URL
			        return apiUrl + location + params;

			    }

			    this.serialize = function (obj, prefix) {
			        var str = [];
			        for (var p in obj) {
			            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];

			            //  hack for breed id's
			            if (k == 'BreedId') {
			                for (var i = 0; i < v.length; i++)
			                    str.push(k + "=" + encodeURIComponent(v[i]));

			            }
			            else {
			                str.push(typeof v == "object" ?
                                    this.serialize(v, k) :
                                    k + "=" + encodeURIComponent(v));
			            }
			        }
			        return str.join("&");
			    }


			});
