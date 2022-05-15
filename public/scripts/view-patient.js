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

function newTextEntry(id) {
    document.getElementById(id).style.display = "block";
    var scroll = document.getElementsByClassName("scroll");
    for (var i=0; i<scroll.length; i++) {
        scroll[i].scrollTop = 0;
    }
}

function cancelTextEntry(id) {
    const entry = document.getElementById(id);
    const fields= document.querySelectorAll("input");
    for (var i=0; i<fields.length; i++) {
        fields[i].value = "";
    }
    entry.style.display = "none";
}

function sendMsg(msgInput) {
    var msg = document.getElementById(msgInput).value;
    // TODO: add msg - pntId, clinId, msg, date
    // TODO: refresh scroll box
    // cancelTextEntry("new-message");
}

function addNote(topicInput, bodyInput) {
    var topic = document.getElementById(topicInput).value;
    var body = document.getElementById(bodyInput).value;
    // TODO: add note to patient - clinId, topic, body, date
    // TODO: refresh scroll box
    cancelTextEntry("new-note");
}

module.exports = {
    viewPatient,
    newTextEntry,
    cancelTextEntry,
    sendMsg,
    addNote
}