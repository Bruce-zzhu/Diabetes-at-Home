var badge = document.getElementById("profile-badge");
if (egmt > 80) {
    badge.style.display = "block";
} else {
    badge.style.display = "none";
}

var pg_bar = document.getElementById("progress-bar");
pg_bar.style.width = egmt + "%";
pg_bar.setAttribute("aria-valuenow", egmt);

document.getElementById("egmt-val").innerHTML = egmt + "%";
