document.getElementById("nav-back").setAttribute('href', document.referrer);
var pathname = window.location.pathname;

if (pathname === "/" ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/clinician")) {
    document.getElementById("simple-nav").remove()
    if (window.location.pathname.startsWith("/patient")) {
        const clinLinks = document.getElementsByClassName("nav-clinician");
        for (var i=0; i<clinLinks.length; i++) {
            clinLinks[i].style.display = "none";
        }
    } else {
        const patLinks = document.getElementsByClassName("nav-patient");
        for (var i=0; i<patLinks.length; i++) {
            patLinks[i].style.display = "none";
        }
    }
} else {
    document.getElementById("normal-nav").remove()
}

const names = document.getElementsByClassName("nav-name");
if (window.location.pathname != ("/")) {
    const pre_login = document.getElementsByClassName("pre-login");
    for (var i=0; i<pre_login.length; i++) {
        pre_login[i].remove();
        pre_login[i].innerHTML = "";
    }
    if (document.referrer.startsWith(window.location.origin + "/patient") || window.location.pathname.startsWith("/patient")) {
        for (i=0; i<names.length; i++) {
            names[i].href = "/patient/dashboard"
        }
    } else if (document.referrer.startsWith("/clinician") || window.location.pathname.startsWith("/clinician")) {
        for (i=0; i<names.length; i++) {
            names[i].href = "/clinician/dashboard"
        }
    }
} else {
    const post_login = document.getElementsByClassName("post-login");
    for (i=0; i<post_login.length; i++) {
        post_login[i].remove();
        post_login[i].innerHTML = "";
    }
    for (i=0; i<names.length; i++) {
        names[i].href = "/"
    }
}

if (window.location.pathname == "/") {
    document.getElementById("nav-entry-div").remove();
}

// New Entry Header Button Clicked
document.getElementById("new-entry-button-header").onclick = function changeContent() {
var dbBody = document.getElementById("dashboard-body");
var popup = document.getElementById("popup-overlay");
    // Fix dashboard body when popup is open
    dbBody.style.position = "fixed";
    // Show Popup Body and shader-overlay background
    if (popup.style.display === "none") {
        popup.style.display = "block";
    } 
    else {
        popup.style.display = "none";
    }
};

// Close Popup
window.onload = function() {
    document.getElementById("escape-popup").onclick = function closePopup() {
    var dbBody = document.getElementById("dashboard-body");
    var popup = document.getElementById("popup-overlay");
        // Fix dashboard body when popup is open
        dbBody.style.position = "initial";
        // Show Popup Body and shader-overlay background
        if (popup.style.display === "none") {
            popup.style.display = "block";
        } 
        else {
            popup.style.display = "none";
        }
    };
};
/*window.onload = function() {
    document.getElementById("cancel-button").onclick = function closePopup2() {
    var dbBody = document.getElementById("dashboard-body");
    var popup = document.getElementById("popup-overlay");
        // Fix dashboard body when popup is open
        dbBody.style.position = "initial";
        // Show Popup Body and shader-overlay background
        if (popup.style.display === "none") {
            popup.style.display = "block";
        } 
        else {
            popup.style.display = "none";
        }
    };
};*/