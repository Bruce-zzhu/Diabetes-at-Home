// toggle to display/hide the three menus within page
function viewPatient(id) {
    var reqCon = document.getElementById("require-container");
    var msgCon = document.getElementById("message-container");
    var ntsCon = document.getElementById("note-container");

    switch (id) {
        case "require":
            reqCon.style.display = "block";
            msgCon.style.display = "none";
            ntsCon.style.display = "none";
            break;
        case "message":
            reqCon.style.display = "none";
            msgCon.style.display = "block";
            ntsCon.style.display = "none";
            break;
        case "note":
            reqCon.style.display = "none";
            msgCon.style.display = "none";
            ntsCon.style.display = "block";
            break;
    }
}

// show new note/message entry option
function newTextEntry(id) {
    document.getElementById(id).style.display = "block";
    var scroll = document.getElementsByClassName("scroll");
    for (var i=0; i<scroll.length; i++) {
        scroll[i].scrollTop = 0;
    }
}

// hide new note/message entry option
function cancelTextEntry(id) {
    const entry = document.getElementById(id);
    const fields= document.querySelectorAll("input");
    for (var i=0; i<fields.length; i++) {
        fields[i].value = "";
    }
    entry.style.display = "none";
}

module.exports = {
    viewPatient,
    newTextEntry,
    cancelTextEntry,
}