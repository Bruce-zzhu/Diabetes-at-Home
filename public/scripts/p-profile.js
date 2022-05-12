var engagement = 90;// = calcEngagement(patient);


var badge = document.getElementById("profile-badge");
if (engagement > 80) {
    badge.style.display = "block";
} else {
    badge.style.display = "none";
}

var pg_bar = document.getElementById("progress-bar");
pg_bar.style.width = engagement + "%";
pg_bar.setAttribute("aria-valuenow", engagement);

document.getElementById("egmt-val").innerHTML = engagement + "%";
