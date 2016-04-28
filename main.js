var matches;
var heroes;
var accountId = 65406320;
var playedHeroes = [];


$ ( document ).ready(function() {
    loadData();
});

function loadData() {
    $.when(
        $.getJSON('playerdata.json', function(json) {
            matches = json.matches;
        }),
        $.getJSON('herodata.json', function(json) {
            heroes = json.heroes;
        })
    ).then(function() {
        console.log("We are ready!");
        main();
    });
}

function main() {

    findAllPlayedHeroes();
    console.log(playedHeroes);
}

function findAllPlayedHeroes() {
    for (var i = 0; i < matches.length; i++) {
        playedHeroes.push(getHeroForMatch(matches[i]));
    }
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
    var results = $.grep(heroes, function(n,i) {
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
    var results = $.grep(match.players, function(n,i) {
        return n.account_id == accountId;
    });

    return results[0];
}
