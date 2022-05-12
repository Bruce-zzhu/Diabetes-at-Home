var engagement = 80;
var pg_bar = document.getElementById("progress-bar");
pg_bar.style.width = engagement + "%";
pg_bar.setAttribute("aria-valuenow", engagement);
document.getElementById("egmt-val").innerHTML = engagement + "%";