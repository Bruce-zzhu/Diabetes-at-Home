document.getElementById("nav-back").setAttribute('href', document.referrer);
var pathname = window.location.pathname;

function showChgNick() {
    var toHide = document.querySelector("#s-change-info .field-btn:nth-child(2)");
    var toShow = document.querySelector("#s-change-info form");
    toHide.style.display = "none";
    toShow.style.display = "flex";
}