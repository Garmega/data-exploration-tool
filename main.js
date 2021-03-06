var matchList;
var heroList;

var accountId = 65406320;

var showHeroType = false;
var showMatchCount = false;

$(document).ready(function() {
    loadData();
});

function loadData() {
    $.when(
        $.getJSON('playerdata.json', function(json) {
            matchList = json.matches;
        }),
        $.getJSON('herodata.json', function(json) {
            heroList = json.heroes;
        })
    ).then(function() {
        console.log("We are ready!");
        main();
    });
}

function main() {
    d3.json('herodata.json', function(json) {

        var xScale;
        var yScale;
        var circles;

        //Adds SVG to div on page.
        var svg = d3.select('#chart')
            .append('svg')
            .attr('height', 500)
            .attr('width', 1000);

        //Sets margins
        var margin = {
            left: 50,
            bottom: 100,
            top: 50,
            right: 50
        }

        //Calculates the chart size
        var height = 500 - margin.bottom - margin.top;
        var width = 1000 - margin.left - margin.right;

        //Adds the chart canva and moves it accordingly
        var g = svg.append('g')
                    .attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')')
                    .attr('height', height)
                    .attr('width', width);

        //Makes the x axis label and appends it
        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (height + margin.top) + ')')
            .attr('class', 'axis');

        //Makes the x axis label and appends it
        var yAxisLabel = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + width/2) + ',' + (height + margin.top + 40) + ')')
            .attr('class', 'title')
            .text('Win Percentile');

        /*
        Sets the scales for the chart
        */
        var setScales = function(data) {
            var xMax =d3.max(data, function(d){return d.win/(d.win + d.lose)})*1.05;
            var xMin =d3.min(data, function(d){return d.win/(d.win + d.lose)}) -.05;

            xScale = d3.scale.linear()
                .range([0, width])
                .domain([xMin, xMax]);

            //Yscale is arbitrarily ordinal so make it as large as there are unique heroes
            var heroNames = [];
            for (var i = 0; i < data.length; i++) {
                heroNames.push(data[i].localized_name);
            }

            yScale = d3.scale.ordinal()
                .domain(heroNames)
                .rangeBands([0, height], .2);
        }

        /*
        Sets the axes of the chart
        */
        var setAxes = function() {
            // Define x axis using d3.svg.axis(), assigning the scale as the xScale
            var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient('bottom')
                        .tickFormat(d3.format('10%'));

            xAxisLabel.call(xAxis);
        }

        var draw = function(data) {
            setScales(data);
            setAxes();

            circles = g.selectAll('circle').data(data);

            circles.enter().append('circle')
                .attr('r', function(d) { return 7 })
                .style('fill', function(d) { return (determineColor(d))})
                .attr('cx', xScale(0.5))
                .attr('cy', function(d) { return yScale(d.localized_name)})
        		.style('opacity', .5)
        		.attr('title', function(d) {return d.localized_name + "\nWin: " + d.win + " Lose: " + d.lose});

            circles.exit().remove();

            circles.transition()
                .duration(1000)
                .delay(function(d,i) {return i * 50})
                .attr('cx', function(d) { return xScale(d.win/(d.win + d.lose))})
                .attr('cy', function(d) { return yScale(d.localized_name)});
        }

        var currentData = getHeroWinLoseCounts(matchList);
        draw(currentData)

        /*
        On click event to show or hide the hero type for each circle.
        */
        var toggleColor = function() {
            showHeroType = !showHeroType;
            circles.transition()
                .duration(500)
                .style('fill', function(d) { return (determineColor(d))})
                //The bottom two are necessary in case this is fired before
                //the initial drawing is complete. This will instantly complete
                //the previous transition and toggle the color
                .attr('cx', function(d) { return xScale(d.win/(d.win + d.lose))})
                .attr('cy', function(d) { return yScale(d.localized_name)});
        }

        /*
        On click event that causes the circles to resize to hide or show density
        */
        var resize = function() {
            showMatchCount = !showMatchCount;
            var sizeFunction = null;
            if (showMatchCount) {
                sizeFunction = function(d) { return (d.win + d.lose) * 3 };
            } else {
                sizeFunction = function(d) { return 7 };
            }
            circles.transition()
                .duration(500)
                .attr('r', sizeFunction)
                //The bottom two are necessary in case this is fired before
                //the initial drawing is complete. This will instantly complete
                //the previous transition and toggle the color
                .attr('cx', function(d) { return xScale(d.win/(d.win + d.lose))})
                .attr('cy', function(d) { return yScale(d.localized_name)});
        }

        document.getElementById("toggleColor").onclick = toggleColor;
        document.getElementById("toggleSize").onclick = resize;
        // Hi Chennan.
        // Love, Drunk Hyytek, who can somehow still comprehend spelling and shit.
        $("circle").tooltip({
            'container': 'body',
            'placement': 'bottom',
        });
    });
}

function determineColor(hero) {
    if (!showHeroType) {
        return 'black';
    } else if (hero.attribute_type == 'intelligence') {
        return 'blue';
    } else if (hero.attribute_type == 'agility') {
        return 'green';
    } else {
        return 'red';
    }
}

/*
Gets all the played heroes and how many times playedHeroes
for the match data of this player.
@param matches: Array of match objects
@returns An map where the the key indicates heroId and the value
the number of occurances of that hero.
*/
function findAllPlayedHeroes(matches) {
    var results = {};
    for (var i = 0; i < matches.length; i++) {
        var hero = getHeroForMatch(matches[i]);
        var heroId = hero.id;
        var currentCount = results[heroId];
        var newCount = (currentCount != null) ? currentCount + 1 : 1;
        results[heroId] = newCount;
    }

    return results;
}

/*
@params matches: The matches to which to count with

@returns An array of objects each of which contains
a unique hero id followed by the win and lose count with that hero
*/
function getHeroWinLoseCounts(matches) {
    var results = [];
    for (var i = 0; i < matches.length; i++) {
        var hero = getHeroForMatch(matches[i]);
        var win = determineWin(matches[i]);

        var data = $.grep(results, function(n, i) {
            return n.hero_id == hero.id;
        })[0];

        if (data == null) {
            data = {};
            data.attribute_type = hero.attribute_type;
            data.localized_name = hero.localized_name;
            data.hero_id = hero.id;
            data.win = 0;
            data.lose = 0;
            results.push(data);
        }

        if (win) {
            data.win += 1;
        } else {
            data.lose += 1;
        }
    }

    return results;
}

/*
@params match: Match in which to determine win

@returns A boolean true if the current player was on the winning
team for the match. False otherwise. Null if player was not in match
*/
function determineWin(match) {
    if (match.match_id != null) {
        var playerAllegience = getPlayerAllegience(match);
        return (playerAllegience != null)
            ? (match.radiant_win == playerAllegience)
            : null;
    }

    return null;
}

/*
@params match: Match in which to determine allgeiance

@returns A boolean true if radiant otherwise false for dire.
Null if the player is not present in the match
*/
function getPlayerAllegience(match) {
    var player = getPlayerInMatch(match);
    return (player != null)
        ? (player.player_slot < 5)
        : null;
}

/*
Gets the hero for the match for this player.
@parms match: The match for which the hero shall be extracted from
@returns A hero object that the player played during this match
*/
function getHeroForMatch(match) {
    if (match.match_id != null) {
        var player = getPlayerInMatch(match);
        if (player != null) {
            return getHeroById(player.hero_id);
        } else {
            //no player exists in that match OR
            //data is somehow corrupt and there are multiples
        }
    }

    return null;
}

/*
Grabs the hero by id from the hero list.
@params id: Id of the hero you wish to look for
@returns The hero object if found. If multiples are found,only
the first one is return. If none is found than null.
*/
function getHeroById(id) {
    var results = $.grep(heroList, function(n, i) {
        return n.id == id
    });

    return results[0];
}

/*
Grabs the player from the match player list.
@params match: The match that is going to be searched
@returns The player object if found. If multiples are found,only
the first one is return. If none is found than null.
*/
function getPlayerInMatch(match) {
    var results = $.grep(match.players, function(n, i) {
        return n.account_id == accountId;
    });

    return results[0];
}
