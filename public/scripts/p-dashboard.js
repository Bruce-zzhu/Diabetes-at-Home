var tb = document.getElementById("full-history");
for (var stat in required) {
    // rm item if the property is not required
    if (required[stat] === false) {
        var stat_objs = tb.getElementsByClassName(stat);
        for (var i=0; i<stat_objs.length; i++) {
            stat_objs[i].style.display = "none";
        }
    }
}

var req_count = Object.values(required).reduce((req_count, stat) => (req_count += stat));

switch (window.innerWidth <= 375) {
    
    case true:
        mobile_adjust_histTable(req_count);

        break;

    case false:
        tab_desk_adjust_histTable(req_count);
        break;

    default:
        // pass
}

