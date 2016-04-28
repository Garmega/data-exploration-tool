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
            return getHeroById(player.hero_id);
        }
    }

    return null;
}

function getHeroById(id) {
    $.grep(heroes, function(n,i) {
        return n.id == 86
    });
}

function getPlayerInMatch(match) {
    $.grep(match, function(n,i) {
        return n.account_id == accountId;
    });
}
