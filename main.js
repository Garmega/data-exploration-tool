var matches;
var heroes;
var accountId = 65406320;

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
        main();
    });
}

function main() {
    console.log("We are ready!");

    for (var i = 0; i < 10; i++) {
        console.log(getHeroForMatch(matches[i]));
    }
}

function getHeroForMatch(match) {
    if (match.match_id != null) {
        var player = getPlayerInMatch(match);
        if (player != null) {
            return getHeroById(player.hero_id)[0];
        }
    }

    return null;
}

function getHeroById(id) {
    return $.grep(heroes, function(n,i) {
        return n.id == id
    });
}

function getPlayerInMatch(match) {
    return $.grep(match.players, function(n,i) {
        return n.account_id == accountId;
    });
}
