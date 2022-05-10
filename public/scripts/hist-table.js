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
    var stacks = document.getElementsByClassName("stack");
    console.log(stacks);
    for (var i=0; i<stacks.length; i++) {
        stacks[i].style.height = "calc(" + 100/req_count + "% + 0.25px)";
    }
}