function logOut() {
    login = false;
    console.log("User has logged out");
    window.location.replace(window.location.origin + "/");
}

function consolelogs() {
    console.log("User creating new entry");
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth();
  }

module.exports = {
    logOut,
    consolelogs,
    isSameDay
}