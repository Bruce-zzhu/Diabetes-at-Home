// changes stack styling depending on number of stacks shown
var req_count = Object.values(required).reduce((req_count, stat) => (req_count += stat));
switch (window.innerWidth <= 380) {
    case true:
        mobile_adjust_histTable(req_count);
        break;
    case false:
        tab_desk_adjust_histTable(req_count);
        break;
}

// truncate nicknames that are long enough to be disruptive to UI
var nicks = document.getElementsByClassName("nickname");
for (n of nicks) {
    if (n.innerHTML.length > 12) {
        n.innerHTML = n.innerHTML.slice(0, 9) + "..."
    }
}
