// console.log(required);

// hide non-required stats
for (var stat in required) {
    // console.log(stat);
    // console.log(required[stat]);

    // rm item if the property is not required
    if (required[stat] === false) {
        var stat_objs = document.getElementsByClassName(stat);
        for (var i=0; i<stat_objs.length; i++) {
            stat_objs[i].style.display = "none";
        }
    }
}

var req_count = Object.values(required).reduce((req_count, stat) => (req_count += stat));

adjust_histTable(req_count);