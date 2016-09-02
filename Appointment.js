/*
    This js file contail all logic to create, delete 
    and update appointments.
*/

var db = openDatabase("Appintment", "1.0", "Appintment Book", 200000);

$(document).ready(function () {

    initDatabase();
    showAppointments();

    $(".days li").click(function (e) {
        daysClick(e);
    });
});

function daysClick(e) {
    var $clicked = $(e.target);
    createAppointment($clicked.text());
}


function initDatabase()
{
    try {

        if (!window.openDatabase)
            alert('Databases are not supported in this browser.');
        else
            createTable();

    }catch (e) {
        if (e == 2)
            console.log("Invalid database version.");
        else
            console.log("Unknown error " + e + ".");

        return;
    }
}

function createTable()
{
    var createTbl = "CREATE TABLE IF NOT EXISTS calender (id INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT, DESCRIPTION TEXT)";
    db.transaction(function (tx) { tx.executeSql(createTbl, [], showAppointments, onError); });
}

function showAppointments() {
    var selectAllStatement = "SELECT * FROM calender";

    db.transaction(function (tx) {
        tx.executeSql(selectAllStatement, [], function (tx, result) {
            dataset = result.rows;

            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);

                var day = item.DATE.split("-")[2];
                $(".days li").filter(function () { return $(this).text() == day; }).append('<a class="appointment" >' + item.DESCRIPTION + '</a>');
            }
        });
    });
}

function createAppointment(day) {
    var desc = "testing appointment";
    var date = "2016-09-" + day;
    var insertStatement = "INSERT INTO calender (DESCRIPTION, DATE) VALUES (?, ?)";

    db.transaction(function (tx) { tx.executeSql(insertStatement, [desc, date], showAppointments, onError); });
}

function deleteAppointment(id) {
    var deleteStatement = "DELETE FROM calender WHERE id=?";
    var iddelete = id.toString();

    db.transaction(function (tx) { tx.executeSql(deleteStatement, [iddelete], showAppointments, onError); alert("Delete Sucessfully"); });
}

function updateAppointment() {
    var updateStatement = "UPDATE calender SET DESCRIPTION = ? WHERE id=?";
    var desc = "";
    var idupdate = 0;
    db.transaction(function (tx) { tx.executeSql(updateStatement, [desc, Number(idupdate)], showAppointments, onError); });
}

function onError(tx, error) {
    console.log(error.message);
}