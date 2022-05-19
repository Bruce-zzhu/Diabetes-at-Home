console.log(allPatEgmts);

var placing = document.getElementsByClassName("placing")
for (var i=0; i<placing.length; i++) {
    var pName = placing[i].querySelector(".place-name");
    var pNum = placing[i].querySelector(".place-number");
    if (pName.innerHTML > 10) {
        pName.innerHTML = pName.innerHTML.slice(0, 7) + "...";
    }
    placing[i].querySelector(".place-number").innerHTML = pNumFill(i);
}

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