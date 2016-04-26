$ ( document ).ready(function() {
    main();
});


function main() {
    console.log("We are ready!");
    $.ajax({
        type: 'GET',
        url: "http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/?key=C97C4727D2637174264FA388C7AF9C45&account_id=65406320"
        data: { get_param: 'value'},
        dataType: 'json',
        success: function(data) {
            $.each(data, function(index, element) {
                $('body').append($('<div>', {
                    text: element.name
                }));
            });
        }
    });
}
