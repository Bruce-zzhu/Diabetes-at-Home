function stackToggleComment(stack) {
    var comment = stack.querySelector(".stack-comment");
    var name = stack.querySelector(".stack-name");
    var value = stack.querySelector(".stack-value");
    if (comment.style.display === "none") {
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