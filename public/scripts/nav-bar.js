var pathname = window.location.pathname;

// depending on logged-in status/user type, change nav bar buttons/links
if (pathname === "/") {
    var links = document.getElementById("nav-links");
    links.innerHTML = "";
    links.style.width = "32px";
}
if (!pathname.includes("patient/dashboard")) {
    var newEntry = document.getElementById("nav-entry-div");
    if (newEntry) {
        newEntry.remove();
    }
}

// adjusts dropdown gap from right side of screen
var drops = document.querySelectorAll(".desktop .dropdown-content")
for (var i=drops.length; i>0; i--) {
    drops[i-1].style.right = 25 * (drops.length - (i)) + "px";
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
    // show correct date on title
    var date = new Date().toDateString().split(" ").slice(1, 3);
    document.getElementById("todayDate").innerHTML = date[0] + " " + date[1];
    
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