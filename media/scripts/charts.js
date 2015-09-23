var sgHelpers = sgHelpers || {};

sgHelpers.compareDropYear = function (a, b) {
    if (a.drop_year < b.drop_year)
        return -1;
    if (a.drop_year > b.drop_year)
        return 1;

    return 0;
}

sgHelpers.getLastSinceYear = function (data, year, dropYearLabel) {
    if (year == null)
        year = 2004;

    var returnData = [];
    for (var i = 0; i < data.length; i++) {
        var dropYear = parseInt(data[i][dropYearLabel]);

        if (dropYear >= year) {
            returnData.push(data[i]);
        }
    }
    return returnData;
}

sgHelpers.getSpecificBreakdown = function (data, breakdown) {
    var returnData = [];
    if (!data)
        return returnData;

    for (var i = 0; i < data.length; i++) {
        if (data[i].breakdown == breakdown) {
            returnData.push(data[i]);
        }
    }
    return returnData;
}

sgHelpers.sgFilterResultsForGraph = function (averages, breakdown, year, dropYearLabel) {
    var arr = sgHelpers.getLastSinceYear(averages, year, dropYearLabel);

    if (breakdown)
        arr = sgHelpers.getSpecificBreakdown(arr, breakdown);

    return arr.sort(sgHelpers.compareDropYear);
}

sgHelpers.generateGraphData = function (year, breakdown, dAve, gAve, fAve, trait, dropYearLabel) {
    p(breakdown + "*" + trait);
    // Variables
    var cols = [{ id: "y", label: "Drop Year", type: "string"}];
    var graphData = [];

    if (!dAve && !gAve && !fAve) {
        cols.push({ id: "a", label: "Ave", type: "number" });
    }

    // Setup
    if (dAve) {
        cols.push({ id: "d", label: "Run Averages", type: "number" });
        var dropAverages = sgHelpers.sgFilterResultsForGraph(dAve, breakdown, year, dropYearLabel[0]);
    }
    if (gAve) {
        cols.push({ id: "g", label: gAve[0].group + " Averages", type: "number" });
        var groupAverages = sgHelpers.sgFilterResultsForGraph(gAve, breakdown, year, dropYearLabel[1]);
    }

    if (fAve) {
        cols.push({ id: "f", label: fAve[0].flock + " Averages", type: "number" });
        var flockAverages = sgHelpers.sgFilterResultsForGraph(fAve, breakdown, year, dropYearLabel[2]);
    }

    // Get the lowest year
    var lowestYear = 10000;
    if (!dAve && !gAve && !fAve) {
        lowestYear = year;
    }
    else {
        if (dropAverages && dropAverages[0][dropYearLabel[0]] < lowestYear)
            lowestYear = dropAverages[0][dropYearLabel[0]];
        if (groupAverages && groupAverages[0][dropYearLabel[1]] < lowestYear)
            lowestYear = groupAverages[0][dropYearLabel[1]];
        if (flockAverages && flockAverages[0][dropYearLabel[2]] < lowestYear)
            lowestYear = flockAverages[0][dropYearLabel[2]];
    }

    // get the highest year
    var highestYear = 0;
    if (!dAve && !gAve && !fAve) {
        highestYear = new Date().getFullYear();
    }
    else {
        if (dropAverages && dropAverages[dropAverages.length - 1][dropYearLabel[0]] > highestYear)
            highestYear = dropAverages[dropAverages.length - 1][dropYearLabel[0]];
        if (groupAverages && groupAverages[groupAverages.length - 1][dropYearLabel[1]] > highestYear)
            highestYear = groupAverages[groupAverages.length - 1][dropYearLabel[1]];
        if (flockAverages && flockAverages[flockAverages.length - 1][dropYearLabel[2]] > highestYear)
            highestYear = flockAverages[flockAverages.length - 1][dropYearLabel[2]];
    }

    for (var theYear = lowestYear; theYear <= highestYear; theYear++) {
        var newArr = [];

        newArr.push({ v: theYear });

        // Drops
        if (dropAverages) {
            p("In Averages");
            var d = dropAverages.filter(function (drop) {
                return drop[dropYearLabel[0]] == theYear.toString();
            });
            if (d != null && d[0] != null)
                newArr.push({ v: d[0][trait], f: d[0][trait].toFixed(2) });
        }

        // Groups
        if (groupAverages) {
                    p("In Group");
            var g = groupAverages.filter(function (group) {
                return group[dropYearLabel[1]] == theYear.toString();
            });
                        if (g != null && g[0] != null)
                newArr.push({ v: g[0][trait], f: g[0][trait].toFixed(2) });
        }

        // Flocks
        if (flockAverages) {
            p("In Flock");
            var f = flockAverages.filter(function (flock) {
                return flock[dropYearLabel[2]] == theYear.toString();
            });
            if (f != null && f[0] != null)
                newArr.push({ v: f[0][trait], f: f[0][trait].toFixed(2) });
        }


        // Add the row of data
        graphData.push({ c: newArr });
    }

    if (typeof callback === 'function')
        callback();

    return { "cols": cols, "rows": graphData };
}

sgHelpers.generateAveragesGraphData = function (year, genInt, flockGenInt, groupGenInt, maleOrFemale, dropYearLabel) {
    // Variables
    var cols = [{ id: "y", label: "Drop Year", type: "string"}];
    var graphData = [];

    if (!genInt && !flockGenInt && !groupGenInt) {
        cols.push({ id: "a", label: "Ave", type: "number" });
    }

    // Setup
    if (genInt) {
        cols.push({ id: "d", label: "Generation Intervals", type: "number" });
        var dropAverages = sgHelpers.sgFilterResultsForGraph(genInt, breakdown, year);
    }
    if (flockGenInt) {
        cols.push({ id: "g", label: "Flock Generation Intervals", type: "number" });
        var groupAverages = sgHelpers.sgFilterResultsForGraph(flockGenInt, breakdown, year);
    }

    if (groupGenInt) {
        cols.push({ id: "f", label: "Group Generation Intervals", type: "number" });
        var flockAverages = sgHelpers.sgFilterResultsForGraph(groupGenInt, breakdown, year);
    }

    // Get the lowest year
    var lowestYear = 10000;
    if (!dAve && !gAve && !fAve) {
        lowestYear = year;
    }
    else {
        if (dropAverages && dropAverages[0][dropYearLabel] < lowestYear)
            lowestYear = dropAverages[0][dropYearLabel];
        if (groupAverages && groupAverages[0][dropYearLabel] < lowestYear)
            lowestYear = groupAverages[0][dropYearLabel];
        if (flockAverages && flockAverages[0][dropYearLabel] < lowestYear)
            lowestYear = flockAverages[0][dropYearLabel];
    }

    // get the highest year
    var highestYear = 0;
    if (!dAve && !gAve && !fAve) {
        highestYear = new Date().getFullYear();
    }
    else {
        if (dropAverages && dropAverages[dropAverages.length - 1][dropYearLabel] > highestYear)
            highestYear = dropAverages[dropAverages.length - 1][dropYearLabel];
        if (groupAverages && groupAverages[groupAverages.length - 1][dropYearLabel] > highestYear)
            highestYear = groupAverages[groupAverages.length - 1][dropYearLabel];
        if (flockAverages && flockAverages[flockAverages.length - 1][dropYearLabel] > highestYear)
            highestYear = flockAverages[flockAverages.length - 1][dropYearLabel];
    }

    for (var theYear = lowestYear; theYear <= highestYear; theYear++) {
        var newArr = [];

        newArr.push({ v: theYear });

        // Drops
        if (dropAverages) {
            var d = dropAverages.filter(function (drop) {
                return drop[dropYearLabel] == theYear.toString();
            });
            if (d != null && d[0] != null)
                newArr.push({ v: d[0][trait], f: d[0][trait].toFixed(2) });
        }

        // Groups
        if (groupAverages) {
            var g = groupAverages.filter(function (group) {
                return group[dropYearLabel] == theYear.toString();
            });
            if (g != null && g[0] != null)
                newArr.push({ v: g[0][trait], f: g[0][trait].toFixed(2) });
        }

        // Flocks
        if (flockAverages) {
            var f = flockAverages.filter(function (flock) {
                return flock[dropYearLabel] == theYear.toString();
            });
            if (f != null && f[0] != null)
                newArr.push({ v: f[0][trait], f: f[0][trait].toFixed(2) });
        }


        // Add the row of data
        graphData.push({ c: newArr });
    }

    if (typeof callback === 'function')
        callback();

    return { "cols": cols, "rows": graphData };
}


sgHelpers.generateDistributionGraphData = function (distData) {
    // Variables
    var graphData = [];
    var cols = [{ id: "p", label: "Percentile", type: "string" },
        { id: "d", label: "Drop", type: "number" },
        { id: "c", label: "PercentileNumber", type: "number" },
        { id: "b", label: "Breakdown", type: "string" },
        { id: "c", label: "Count", type: "number"}];

    var options = { title: 'Distribution of percentiles over years', vAxis: { direction: -1 } };

    for (var start = 0; start < distData.length; start++) {

        if (distData[start].ninety > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 90 }, { v: distData[start].breakdown }, { v: distData[start].ninety}] });
        }
        if (distData[start].eighty > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 80 }, { v: distData[start].breakdown }, { v: distData[start].eighty}] });
        }
        if (distData[start].seventy > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 70 }, { v: distData[start].breakdown }, { v: distData[start].seventy}] });
        }
        if (distData[start].sixty > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 60 }, { v: distData[start].breakdown }, { v: distData[start].sixty}] });
        }
        if (distData[start].fifty > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 50 }, { v: distData[start].breakdown }, { v: distData[start].fifty}] });
        }
        if (distData[start].forty > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 40 }, { v: distData[start].breakdown }, { v: distData[start].forty}] });
        }
        if (distData[start].thirty > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 30 }, { v: distData[start].breakdown }, { v: distData[start].thirty}] });
        }
        if (distData[start].twenty > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 20 }, { v: distData[start].breakdown }, { v: distData[start].twenty}] });
        }
        if (distData[start].ten > 0) {
            graphData.push({ c: [{ v: '' }, { v: distData[start].dropyear }, { v: 10 }, { v: distData[start].breakdownch21 }, { v: distData[start].ten}] });
        }
        // Drops

    }

    if (typeof callback === 'function')
        callback();

    return { "cols": cols, "rows": graphData };
}

sgHelpers.generateFrontierGraphData = function (frontData) {
    // Variables
    var graphData = [];
    var cols = [{ id: "index", label: "Index", type: "number" },
        { id: "frontier", label: "Frontier", type: "number" },
        { id: "xAx2", label: "xAx/2", type: "number" },
        { id: "end", label: "End", type: "number" }
        ];



    for (var start = 0; start < frontData.FrontierPoints.length; start++) {
        graphData.push({ c: [{ v: frontData.FrontierPoints[start].inbreeding }, { v: frontData.FrontierPoints[start].index }, { v: null }, { v: null}] });
    }

    for (var start2 = 0; start2 < frontData.GenerationPoints.length; start2++) {
        graphData.push({ c: [{ v: frontData.GenerationPoints[start2].xAx2 }, { v: null }, { v: frontData.GenerationPoints[start2].xG }, { v: null}] });
        if (start2 == (frontData.GenerationPoints.length - 1)) {
            graphData.push({ c: [{ v: frontData.GenerationPoints[start2].xAx2 }, { v: null }, { v: null }, { v: frontData.GenerationPoints[start2].xG}] });
        }
    }
    return { "cols": cols, "rows": graphData };
}

