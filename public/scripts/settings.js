// show change nickname input box
function showChgNick() {
    var toHide = document.querySelector("#s-change-info .field-btn:nth-child(2)");
    var toShow = document.querySelector("#s-change-info form");
    toHide.style.display = "none";
    toShow.style.display = "flex";
}

// truncate nicknames long enough to be disruptive
var nick = document.getElementById("s-nick");
console.log(nick.innerHTML.length);
if (nick.innerHTML.length > 23) {
    nick.innerHTML = nick.innerHTML.slice(0, 20) + "..."
}