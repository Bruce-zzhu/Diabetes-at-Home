document.getElementById("nav-back").setAttribute('href', document.referrer);
var pathname = window.location.pathname;

// show simplified nav unless on landing/patient/clinician pages
if (pathname === "/" ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/clinician")) {
    document.getElementById("simple-nav").remove()

    // depending on logged-in status/user type, change nav bar buttons/links
    if (pathname === "/") {
        var links = document.getElementById("nav-links");
        links.innerHTML = "";
        links.style.width = "16px";
        
        var newEntry = document.getElementById("nav-entry-div");
        if (newEntry) {
            newEntry.remove;
        }
    }
} else {
    document.getElementById("normal-nav").remove()
}

var drops = document.getElementsByClassName("dropdown-content");
for (var i=drops.length; i>0; i--) {
    drops[i-1].style.right = 25 * (drops.length - (i+1)) + "px";
}

// New Entry Header Button Clicked
var newEntryBtn = document.getElementById("new-entry-button-header");
if (newEntryBtn != undefined) {
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
}


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