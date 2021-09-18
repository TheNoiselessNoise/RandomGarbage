$(document).ready(function() {
    $(".button-collapse").sideNav();
    
    $('select').material_select();
    $('.modal-trigger').leanModal();
    
    setDatabase();
});

setInterval(function() {
    if ($(document).height() > $(window).height()) {
        $("footer").addClass("footerFix");
    } else {
        $("footer").removeClass("footerFix");
    }
}, 1);

function modChangeStatus(u, o, v){
    console.log(u, o, v);
    $.post("side/account/modstatus.php", {username:u, option:o, value:v}, function(){});
}

function modDelete(u){
    var conf = confirm("Do you really want to delete this moderator?");
    
    if (conf == true) {
        $.post("side/account/deletemod.php", { username:u }, function() {});
        window.location = "account.php";
    }
}

function getTables(t) {
    $(".dataDump").html("");
    $("#tableName").val(t);
    $.post("mysql/service_tables.php", { table: t }, function(data) {
        $(".tableDump").html(data);
    });
}

function getDatabase(o, s) {
    $.post("side/settings.php", { option: o, settings: s }, function() {
        window.location = "service.php";
    });
}

function setDatabase() {
    $(".dataDump").html("");
    $('#getTable').removeAttr("disabled");
}

function deleteDatabase() {
    var conf = confirm("Do you really want to delete this database?");
    
    if (conf == true) {
        $.post("mysql/service_del_db.php", { conf:conf }, function() {});
        window.location = "service.php";
    }
}

function deleteTable() { // možná změnit na SESSION current_table
    var conf = confirm("Do you really want to delete this table?");
    
    if (conf == true) {
        var t = document.getElementById("getTable").value;
        $.post("mysql/service_main_del_table.php", { table: t }, function() {});
        window.location = "service.php";
    }
}

function setSettings(o, s) {
    $.post("side/settings.php", { option: o, settings: s }, function() { });
    setTimeout(function(){
        window.location = "service.php";
    }, 150);
}

function addDatabase() {
    $('.addDump').html('');
    $.post('mysql/service_add_database.php', function(data) {
        $('.addDump').html(data);
    });
}

function addTable() {
    $('.addDump').html('');
    $.post('mysql/service_add_table.php', function(data) {
        $('.addDump').html(data);
    });
}

function addQuery() {
    $('.addDump').html('');
    $.post('mysql/service_add_query.php', function(data) {
        $('.addDump').html(data);
    });
}

function selectQuery() {
    $('.addDump').html('');
    $.post('mysql/service_select_query.php', function(data) {
        $('.addDump').html(data);
    });
}

function selectMainQuery(q) {
    $('.dataDump').html('');
    $('.addDump').html('');
    $.post('mysql/service_main_select_query.php', {selectQuery:q}, function(data){
        $('.tableDump').html(data);
    });
}

function selectTable() {
    $('.addDump').html('');
    $.post('mysql/service_del_table.php', function(data) {
        $('.addDump').html(data);
    });
}

var rows = 0;
function setRow(num){
    if(num == 1){
        rows += 1;
        var string = '<div id=\"row\">#' + rows + ' Column Name:<input type=\"text\" name=\"colName' + rows + '\">Type: <select name=\"type' + rows + '\"><option value=\"INT\">INT</option><option value=\"VARCHAR\">VARCHAR</option><option value=\"FLOAT\">FLOAT</option><option value=\"TEXT\">TEXT</option><option value=\"DATE\">DATE</option></select> Length: <input class=\"parLen\" type=\"number\" name=\"len' + rows + '\" value=\"1\"> NULL: <input type=\"checkbox\" name=\"null' + rows + '\"> A_I: <input type=\"checkbox\" name=\"ai' + rows + '\"> KEY? <input type=\"radio\" name=\"key\" value=\"' + rows + '\"></div>';
        var string = '<div><div class=\"row\"><div class=\"input-field col s12\"><input name=\"colName' + rows + '\" id=\"colName' + rows + '\" type=\"text\"><label for=\"colName' + rows + '\">#' + rows + ' Column Name</label></div></div><div class=\"row\"><select name=\"type' + rows + '\"><option value=\"INT\" selected>INT</option><option value=\"VARCHAR\">VARCHAR</option><option value=\"FLOAT\">FLOAT</option><option value=\"TEXT\">TEXT</option><option value=\"DATE\">DATE</option></select></div><div class=\"row\"><div class=\"input-field col s12\"><input name=\"len' + rows + '\" id=\"parLen' + rows + '\" type=\"number\" value=\"1\"><label for=\"parLen' + rows + '\">Length</label></div></div><div class=\"row\"><div class=\"input-field col s3\"><input type=\"checkbox\" name=\"null' + rows + '\" id=\"null' + rows + '\"><label for=\"null' + rows + '\">NULL</label></div><div class=\"input-field col s3\"><input type=\"checkbox\" name=\"ai' + rows + '\" id=\"ai' + rows + '\"><label for=\"ai' + rows + '\">A_I</label></div><div class=\"input-field col s5\"><input type=\"radio\" name=\"key\" id=\"key' + rows + '\" value=\"' + rows + '\"><label for=\"key' + rows + '\">PRIMARY KEY?</label></div></div><hr><hr><hr></div>';
        
        $('#body').append(string);
        Materialize.updateTextFields();
    } else {
        rows -= 1;
        if(rows < 0){
            rows = 0;
        }
        var setRows = document.getElementById('body');
        setRows.removeChild(setRows.lastChild);
    }
    
    $('#length').val(rows);
}