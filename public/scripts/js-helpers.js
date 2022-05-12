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
        cell.style.borderLeft = "1px solid var(--border-color)";
        cell.style.borderRight = "1px solid var(--border-color)";
    } else {
        comment.style.display = "none";
        value.style.display = "block";
        cell.style.background = "var(--secondary-color)";
        cell.style.borderLeft = "0";
        cell.style.borderRight = "0";
    }
}

function setTheme(themeName) {
    var rootStyle = document.documentElement.style;
    switch (themeName) {
        case "default":
            rootStyle.setProperty("--bg-color", "var(--offWhite-color)");
            rootStyle.setProperty("--border-color", "var(--grey-color)");
            rootStyle.setProperty("--text-color", "black");
            rootStyle.setProperty("--alt-text-color", "white");
            rootStyle.setProperty("--button-color", "var(--lightBlue-color)");
            rootStyle.setProperty("--primary-color", "var(--blue-color)");
            rootStyle.setProperty("--secondary-color", "var(--offGrey-color)");
            rootStyle.setProperty("--tertiary-color", "white");
            var logos = document.getElementsByClassName("logo");
            for (var i=0; i<logos.length; i++) {
                logos[i].src = "/images/logo-white.svg"
            }
            break;
        case "dark":
            rootStyle.setProperty("--bg-color", "var(--grey-color)");
            rootStyle.setProperty("--border-color", "var(--offWhite-color)");
            rootStyle.setProperty("--text-color", "white");
            rootStyle.setProperty("--alt-text-color", "white");
            rootStyle.setProperty("--button-color", "var(--grey-color)");
            rootStyle.setProperty("--primary-color", "var(--offBlack-color");
            rootStyle.setProperty("--secondary-color", "var(--grey-color)");
            rootStyle.setProperty("--tertiary-color", "var(--lightGrey-color)");
            var logos = document.getElementsByClassName("logo");
            for (var i=0; i<logos.length; i++) {
                logos[i].src = "/images/logo-white.svg"
            }
            break;
        case "light":
            rootStyle.setProperty("--bg-color", "white");
            rootStyle.setProperty("--border-color", "var(--grey-color)");
            rootStyle.setProperty("--text-color", "black");
            rootStyle.setProperty("--alt-text-color", "black");
            rootStyle.setProperty("--button-color", "white");
            rootStyle.setProperty("--primary-color", "white");
            rootStyle.setProperty("--secondary-color", "var(--offWhite-color)");
            rootStyle.setProperty("--tertiary-color", "white");
            var logos = document.getElementsByClassName("logo");
            for (var i=0; i<logos.length; i++) {
                logos[i].src = "/images/logo-black.svg"
            }
    }

    

    // TODO: change patient theme val in db
}

function calcEngagement(patient) {
    // TODO logic
    return 80;
}

module.exports = {
    logOut,
    consolelogs,
    isSameDay,
    getDateInfo,
    tableToggleComment,
    setTheme,
    calcEngagement
};
