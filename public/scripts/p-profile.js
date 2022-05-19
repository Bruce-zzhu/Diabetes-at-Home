var badge = document.getElementById("profile-badge");
var base = document.getElementById("progress-base");
var bar = document.getElementById("progress-bar");
var valText = document.getElementById("egmt-val");

// hide/show engagement badge
if (egmt > 80) {
    badge.style.display = "block";
} else {
    badge.style.display = "none";
}

// adjusts & displays engagement progress bar
var pg_bar = document.getElementById("progress-bar");
pg_bar.style.width = egmt + "%";
pg_bar.setAttribute("aria-valuenow", egmt);
valText.innerHTML = `${egmt.toFixed(2)}` + "%";
if (egmt > 65) {
    valText.style.color = "white";
}