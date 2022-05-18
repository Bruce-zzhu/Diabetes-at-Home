var badge = document.getElementById("profile-badge");
var base = document.getElementById("progress-base");
var bar = document.getElementById("progress-bar");
var valText = document.getElementById("egmt-val");

if (egmt > 80) {
    badge.style.display = "block";
} else {
    badge.style.display = "none";
}

var pg_bar = document.getElementById("progress-bar");
pg_bar.style.width = egmt + "%";
pg_bar.setAttribute("aria-valuenow", egmt);

valText.innerHTML = `${egmt.toFixed(2)}` + "%";

if (egmt > 65) {
    valText.style.color = "white";
}