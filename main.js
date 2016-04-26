$ ( document ).ready(function() {
    main();
});


function main() {
    console.log("We are ready!");
    $.getJSON('playerdata.json', function(json) {
        console.log(json);
    })
}
