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


module.exports = {
    logOut,
    consolelogs,
    isSameDay,
    getDateInfo
};
