function consolelogs() {
    console.log('User creating new entry');
}

function isSameDay(d1, d2) {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth()
    );
}

function getDateInfo(date) {
    var localDate = date.toLocaleString("en-AU", {"timeZone": "Australia/Melbourne"});
    var day = localDate.slice(0, 2);
    var month = localDate.slice(3, 5);
    var year = localDate.slice(6, 10);
    
    return [day, month, year]
}

function toMelbDate(date) {
    const newDate = new Date(date);
    return newDate.toLocaleString("en-AU", {"timeZone": "Australia/Melbourne"}).slice(0, 10);
}

// display/hide a data table cell's comment/value
function tableToggleComment(cell) {
    var comment = cell.querySelector(".tb-comm"); 
    var value = cell.querySelector(".tb-value");
    if (comment.style.display != "block") {
        comment.style.display = "block";
        value.style.display = "none";
        cell.style.background = "white";
        cell.style.borderLeft = "1px solid var(--grey-color)";
        cell.style.borderRight = "1px solid var(--grey-color)";
    } else {
        comment.style.display = "none";
        value.style.display = "block";
        cell.style.background = "var(--secondary-color)";
        cell.style.borderLeft = "0";
        cell.style.borderRight = "0";
    }
}

function getTheme(theme) {
    if (theme == undefined) {return;}

    var rootStyle = document.documentElement.style;

    for (var key in theme.colors) {
        rootStyle.setProperty("--"+key+"-color", theme.colors[key]);
    }

    var logos = document.getElementsByClassName("logo");
    for (var i=0; i<logos.length; i++) {
        logos[i].src = theme.logoPath;
    }
}



function isNotBounded(value, low, high) {
    return low <= value <= high;
}

function toggleChart() {
    var btn = document.getElementById("toggleChart");
    var table = document.getElementById("full-history");
    var chart = document.getElementById("full-hist-chart");
    if (table.style.display == "block") {
        btn.innerHTML = "Show Table";
        table.style.display = "none";
        chart.style.display = "block";
    } else {
        btn.innerHTML = "Show Chart";
        table.style.display = "block";
        chart.style.display = "none";
    }
}

module.exports = {
    consolelogs,
    isSameDay,
    getDateInfo,
    tableToggleComment,
    getTheme,
    toMelbDate,
    isNotBounded,
    toggleChart

};
