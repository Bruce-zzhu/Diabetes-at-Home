function logOut() {
    login = false;
    console.log("User has logged out");
}

function newEntry() {
    console.log("User creating new entry");
}

module.exports = {
    logOut,
    newEntry
}