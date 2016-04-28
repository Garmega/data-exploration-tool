var matches;
var heroes;
var accountId = "65406320";

$ ( document ).ready(function() {
    loadData();
});

function loadData() {
    $.when(
        $.getJSON('playerdata.json', function(json) {
            matches = json.matches;
            console.log(matches);
        }),
        $.getJSON('herodata.json', function(json) {
            heroes = json.heroes;
            console.log(heroes);
        })
    ).then(
        main()
    );
}

function main() {
    console.log("We are ready!");

    for (var i = 0; i < 10; i++) {
        getHeroForMatch(matches[i]);
    }
}

function getHeroForMatch(match) {
    if (match_id != null) {
        var players = match.players;
        for (var i = 0; i < players.length; i++) {
            if (players.account_id == accountId) {
                return getHeroById(players.hero_id);
            }
        }
    }

    return null;
}

function getHeroById(id) {
    return heroes[id - 1];
}
