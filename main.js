var matchList;
var heroList;

var accountId = 65406320;
var anonymousId = 4294967295;

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
    var results = getHeroWinLoseCounts(matchList);
    draw(results);
    console.log(results);
}

function draw(data) {
    var svg = d3.select('#container')
        .append('svg')
        .attr('height', 1000)
        .attr('width', 1000);

    var margin = {
        left: 70,
        bottom: 100,
        top: 50,
        right: 50
    };

    var height = 1000 - margin.bottom - margin.top;
	var width = 1000 - margin.left - margin.right;

    var g = svg.append('g')
				.attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')')
				.attr('height', height)
				.attr('width', width);

    var xMax =d3.max(data, function(d){return d.win/(d.win + d.lose)})*1.05;
	var xMin =d3.min(data, function(d){return d.win/(d.win + d.lose)})*.85;

	var xScale  = d3.scale.linear()
        .range([0, width])
        .domain([xMin, xMax]);


    var heroNames = [];

    for (var i = 0; i < data.length; i++) {
        heroNames.push(data.localized_name);
    }

    var yScale = d3.scale.ordinal()
        .domain(heroNames)
        .range([0, height])

    var circles = g.selectAll('circle').data(data);

    circles.enter().append('circle')
        .attr('r', function(d) { return (d.win + d.lose) *2 })
        .attr('fill', 'blue')
        .attr('cy', height)
		.style('opacity', .3)
		.attr('title', function(d) {return d.localized_name});

    circles.transition()
        .duration(1500)
        .delay(function(d,i) {return i * 50})
        .attr('cx', function(d) { return xScale(d.win/(d.win + d.lose))} )
        .attr('cy', function(d) { return yScale(d.localized_name)})
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
