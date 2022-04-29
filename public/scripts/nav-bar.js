document.getElementById("nav-back").setAttribute('href', document.referrer);
var pathname = window.location.pathname;

// show simplified nav unless on landing/patient/clinician pages
if (pathname === "/" ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/clinician")) {
    document.getElementById("simple-nav").remove()

    // depending on logged-in status/user type, change nav bar buttons/links
    if (pathname === "/") {
        document.getElementById("nav-entry-div").remove();
    } else if (pathname.startsWith("/patient")) {
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

// link logo <a> href to landing//patient/client dashboard depending on user type
const names = document.getElementsByClassName("nav-name");
if (pathname != ("/")) {
    const pre_login = document.getElementsByClassName("pre-login");
    for (var i=0; i<pre_login.length; i++) {
        pre_login[i].remove();
        pre_login[i].innerHTML = "";
    }
    if (document.referrer.startsWith(window.location.origin + "/patient") || pathname.startsWith("/patient")) {
        for (i=0; i<names.length; i++) {
            names[i].href = "/patient/dashboard"
        }
    } else if (document.referrer.startsWith("/clinician") || pathname.startsWith("/clinician")) {
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

// New Entry Header Button Clicked
document.getElementById("new-entry-button-header").onclick = function changeContent() {
    var dbBody = document.getElementById("dashboard-body");
    var popup = document.getElementById("popup-overlay");
    var ftr = document.getElementById("simple-footer");
    // Fix dashboard body and hide footer when popup is open
    dbBody.style.position = "fixed";
    ftr.style.display = "none";
    // Show Popup Body and shader-overlay background
    if (popup.style.display != "block") {
        popup.style.display = "block";
    } 
    else {
        popup.style.display = "none";
    }
};


// Window onload functions
window.onload = function() {
    // Escape By clicking outside popup window
    (document.getElementById("escape-popup").onclick = function closePopup() {
        var dbBody = document.getElementById("dashboard-body");
        var popup = document.getElementById("popup-overlay");
        var ftr = document.getElementById("simple-footer");
        // Fix dashboard body & footer when popup is open
        ftr.style.display = "initial";
        dbBody.style.position = "initial";
        // Show Popup Body and shader-overlay background
        if (popup.style.display === "none") {
            popup.style.display = "block";
        } 
        else {
            popup.style.display = "none";
        }
    });
    // Escape by clicking cancel button
    (document.getElementById("cancel-button").onclick = function closePopup() {
        var dbBody = document.getElementById("dashboard-body");
        var popup = document.getElementById("popup-overlay");
        var ftr = document.getElementById("simple-footer");
        // Fix dashboard body & footer when popup is open
        dbBody.style.position = "initial";
        ftr.style.display = "initial";
        // Show Popup Body and shader-overlay background
        if (popup.style.display === "none") {
            popup.style.display = "block";
        } 
        else {
            popup.style.display = "none";
        }
    });
    // Comment Prompt
    // (document.getElementById("bloodGlucose.comment").onclick = function commentPrompt() {
    //     let comment = prompt("Please enter a comment")
    // });
};