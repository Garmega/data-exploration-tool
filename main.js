var matchInfo;
var heroInfo;

$ ( document ).ready(function() {
    main();
});


function main() {
    console.log("We are ready!");
    $.getJSON('playerdata.json', function(json) {
        matchInfo = json;
        console.log(matchInfo);
    })

    $.getJSON('herodata.json', function(json) {
        heroInfo = json;
        console.log(heroInfo);
    })

}

function getHeroForMatch() {

}
