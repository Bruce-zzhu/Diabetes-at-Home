var placing = document.getElementsByClassName("placing")
for (var i=0; i<placing.length; i++) {
    var pNum = placing[i].querySelector(".place-number");
    placing[i].querySelector(".place-number").innerHTML = pNumFill(i);
}

// renders a medal image or a place number given a place
function pNumFill(pNum) {
    var fill;
    switch (pNum) {
        case 0:
            fill = "<img class='medal place-number' alt='gold medal' src='https://uxwing.com/wp-content/themes/uxwing/download/24-sport-and-awards/gold-medal.svg'>";
            break;
        case 1:
            fill = "<img class='medal place-number' alt='silver medal' src='https://uxwing.com/wp-content/themes/uxwing/download/24-sport-and-awards/silver-medal.svg'>";
            break;
        case 2:
            fill = "<img class='medal place-number' alt='bronze medal' src='https://uxwing.com/wp-content/themes/uxwing/download/24-sport-and-awards/bronze-medal.svg'>";
            break;
        default:
            fill = `<h5 class='place-number'>${pNum+1}th</h5>`;
    }
    return fill;
}

// change "behind other user" comment based on other patients ranked before logged-in patient
var comm = document.getElementById("egmt-comm");
var rank = getIdxByNick(pntNick, allPatEgmts);
console.log(rank);
if (rank == 0) {
    comm.innerHTML = "You're in first place!";
} else {
    var diff = parseFloat(allPatEgmts[rank-1].egmtRate) - parseFloat(allPatEgmts[rank].egmtRate);
    comm.innerHTML = `${diff.toFixed(2)}% behind ${allPatEgmts[rank-1].nickName}!`;
}

function getIdxByNick(nickName, nameArray) {
    var idx = 0;
    for (n of nameArray) {
        if (n.nickName == nickName) {
            return idx;
        } else {
            idx++;
        }
    }
}