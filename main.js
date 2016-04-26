
var url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v1/?key=C97C4727D2637174264FA388C7AF9C45&steamids=76561198025672048"
var xmlhttp = new XMLHttpRequest();

$ ( document ).ready(function() {
    main();
});


function main() {
    console.log("We are ready!");
    readData();
}


function readData() {
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


xmlhttp.onreadystatechange = function() {
if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var myArr = JSON.parse(xmlhttp.responseText);
    console.log(myArr);
    }
};
