function logOut() {
    console.log('User has logged out');
    window.location.replace(window.location.origin + '/');
}

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

function getDateInfo(dateString) {
    var localDate = new Date(dateString.getTime() - dateString.getTimezoneOffset() * 60000).toISOString();
    var year = localDate.slice(0, 4);
    var month = localDate.slice(5, 7);
    var day = localDate.slice(8, 10);

    return [day, month, year]
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
    if (!theme) {return;}

    var rootStyle = document.documentElement.style;

    for (var key in theme.colors) {
        rootStyle.setProperty("--"+key+"-color", theme.colors[key]);
    }

    var logos = document.getElementsByClassName("logo");
    for (var i=0; i<logos.length; i++) {
        logos[i].src = theme.logoPath;
    }
}

module.exports = {
    logOut,
    consolelogs,
    isSameDay,
    getDateInfo,
    tableToggleComment,
    getTheme
};
