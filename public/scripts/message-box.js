// displays unread notif if any unread messages present
var unread = document.getElementsByClassName("unread");
if (unread.length === 0) {
    var notif = document.getElementById("unread-notif");
    if (notif) {notif.remove();}
}
