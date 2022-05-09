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