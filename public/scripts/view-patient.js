function viewPatient(id) {
    var reqCon = document.getElementById("require-container");
    var msgCon = document.getElementById("message-container");
    var ntsCon = document.getElementById("notes-container");

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
        case "notes":
            reqCon.style.display = "none";
            msgCon.style.display = "none";
            ntsCon.style.display = "block";
            break;
    }
}

module.exports = {
    viewPatient
}