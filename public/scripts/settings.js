document.getElementById("nav-back").setAttribute('href', document.referrer);
var pathname = window.location.pathname;

if (document.referrer.startsWith(window.location.origin + ("/patient"))) {
    const clinSets = document.getElementsByClassName("set-clinician");
    for (var i=0; i<clinSets.length; i++) {
        clinSets[i].style.display = "none";
    }
} else if (document.referrer.startsWith(window.location.origin + ("/clinician"))) {
    const patSets = document.getElementsByClassName("set-patient");
    for (var i=0; i<patSets.length; i++) {
        patSets[i].style.display = "none";
    }
}