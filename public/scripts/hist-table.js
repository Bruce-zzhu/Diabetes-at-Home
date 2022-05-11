// display/hide a stack's comment/name & value
function stackToggleComment(stack) {
    var comment = stack.querySelector(".stack-comment");
    var name = stack.querySelector(".stack-name");
    var value = stack.querySelector(".stack-value");
    if (comment.style.display != "block") {
        stack.style.gridTemplateColumns = "1.5fr 4fr";
        stack.style.gridTemplateAreas = '"st-icon st-comment"';
        comment.style.display = "block";
        name.style.display = "none";
        value.style.display = "none";
    } else {
        stack.style.gridTemplateColumns = "1.5fr 2fr 2fr";
        stack.style.gridTemplateAreas = '"st-icon st-name st-value"';
        comment.style.display = "none";
        name.style.display = "block";
        value.style.display = "block";
    }
}

function adjust_histTable(req_count) {
    // Adjust stacks height
    var stacks = document.getElementsByClassName("stack");
    console.log(stacks);
    for (var i=0; i<stacks.length; i++) {
        stacks[i].style.height = "calc(" + 100/req_count + "% + 0.25px)";
    }
    
    // Adjust hist-table date box
    var dateArea = document.getElementsByClassName("date-area");
    var dayText = document.getElementsByClassName("date-day");
    var todayDateBox = document.getElementById("hist-today").querySelector(".date-area");
    var avgDateBox = document.getElementById("hist-7days").querySelector(".date-area");
    switch(req_count) {
        case 4:
            for (i=0; i<dateArea.length; i++) {
                dateArea[i].style.minHeight = "200px";
            }
            break;
        case 3:
            for (i=0; i<dateArea.length; i++) {
                dateArea[i].style.minHeight = "150px";
            }
            for (i=0; i<dayText.length; i++) {
                dayText[i].style.fontSize = "1.5em";
            }
            break;
        case 2:
            for (i=0; i<dateArea.length; i++) {
                dateArea[i].style.minHeight = "100px";
            }
            for (i=0; i<dayText.length; i++) {
                dayText[i].style.fontSize = "1.25em";
            }

            avgDateBox.querySelector(".date-from .date-day").innerHTML += 
                " ~ " + avgDateBox.querySelector(".date-to .date-day").innerHTML;
            avgDateBox.querySelector(".date-to").remove();
            break;
        case 1:
            for (i=0; i<dateArea.length; i++) {
                dateArea[i].style.minHeight = "50px";
            }
            for (i=0; i<dayText.length; i++) {
                dayText[i].style.fontSize = "1em";
            }
            var monthText = document.getElementsByClassName("date-month");
            for (i=0; i<monthText.length; i++) {
                monthText[i].style.fontSize = "1em";
            }

            todayDateBox.querySelector(".date-month").innerHTML +=
            "/ " + todayDateBox.querySelector(".date-year").innerHTML;
            todayDateBox.querySelector(".date-year").remove()

            avgDateBox.querySelector(".date-month").innerHTML +=
            "/ " + avgDateBox.querySelector(".date-year").innerHTML;
            avgDateBox.querySelector(".date-year").remove()

            avgDateBox.querySelector(".date-from .date-day").innerHTML += 
            " ~ " + avgDateBox.querySelector(".date-to .date-day").innerHTML;
            avgDateBox.querySelector(".date-to").remove();
            break;
        default:

    }
}