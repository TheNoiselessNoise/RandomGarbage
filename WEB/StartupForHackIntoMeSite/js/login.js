/*
    ListenToUser.php - listens to any user GET/POST
                     - returns data if any
*/

$(document).ready(function(){
    $("#submitLogin").on("click", function(){
        let userToken = $("#userToken").val();
        $.post("ListenToUser.php", {
            "checkLoginToken":true,
            "userToken":userToken
        }, function(msg){
            $("#access_message").html(msg);
        });
    });
});

function getLoginToken(){
    return $.post(ListenToUser.php, {getLoginToken:true}, function(x){
        // TODO
        // perhaps just return x?
    });
}