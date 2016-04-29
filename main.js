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
    var svg = d3.select('container')
        .append('svg')
        .append('height', 600)
        .append('width', 600);

    var margin = {
        left: 250,
        bottom: 100,
        top: 50,
        right: 50
    };

    var height = 600 - margin.bottom - margin.top;
	var width = 600 - margin.left - margin.right;

    var g = svg.append('g')
				.attr('transform', 'translate(' +  margin.left + ',' + margin.top + ')')
				.attr('height', height)
				.attr('width', width);

    var xMax =d3.max(data, function(d){return (d.win + d.lose)/d.win})*1.05;
	var xMin =d3.min(data, function(d){return (d.win + d.lose)/d.win})*.85;
	var xScale  = d3.scale.log().range([0, width]).domain([xMin, xMax]);
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
        var heroId = hero.id;
        var win = determineWin(matches[i]);

        var data = $.grep(results, function(n, i) {
            return n.hero_id == heroId;
        })[0];

        if (data == null) {
            data = {};
            data.hero_id = heroId;
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
