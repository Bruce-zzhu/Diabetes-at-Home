// toggle to display/hide the three menus within page
function viewPatient(id) {
    var reqCon = document.getElementById("require-container");
    var msgCon = document.getElementById("message-container");
    var ntsCon = document.getElementById("note-container");
    const buttons = document.getElementsByClassName("nav-links");
    var reqBut = buttons.item(0);
    var msgBut = buttons.item(1);
    var ntsBut = buttons.item(2);

    switch (id) {
        case "require":
            reqCon.style.display = "block";
            reqBut.style.backgroundColor = "var(--lightBlue-color)";
            document.getElementById("require").style.filter= "invert(100%)"
            msgCon.style.display = "none";
            msgBut.style.backgroundColor = "var(--tertiary-color)";
            document.getElementById("message").style.filter= "invert(0%)"
            ntsCon.style.display = "none";
            ntsBut.style.backgroundColor = "var(--tertiary-color)";
            document.getElementById("note").style.filter= "invert(0%)"
            break;
        case "message":
            reqCon.style.display = "none";
            reqBut.style.backgroundColor = "var(--tertiary-color)";
            document.getElementById("require").style.filter= "invert(0%)"
            msgCon.style.display = "block";
            msgBut.style.backgroundColor = "var(--lightBlue-color)";
            document.getElementById("message").style.filter= "invert(100%)"
            ntsCon.style.display = "none";
            ntsBut.style.backgroundColor = "var(--tertiary-color)";
            document.getElementById("note").style.filter= "invert(0%)"
            break;
        case "note":
            reqCon.style.display = "none";
            reqBut.style.backgroundColor = "var(--tertiary-color)";
            document.getElementById("require").style.filter= "invert(0%)"
            msgCon.style.display = "none";
            msgBut.style.backgroundColor = "var(--tertiary-color)";
            document.getElementById("message").style.filter= "invert(0%)"
            ntsCon.style.display = "block";
            ntsBut.style.backgroundColor = "var(--lightBlue-color)";
            document.getElementById("note").style.filter= "invert(100%)"
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