// display/hide a data table cell's comment/value
function tableToggleComment(cell) {
    var comment = cell.querySelector(".tb-comm"); 
    var value = cell.querySelector(".tb-value");
    if (comment.style.display != "block") {
        comment.style.display = "block";
        value.style.display = "none";
        cell.style.background = "white";
        cell.style.borderLeft = "1px solid var(--brown-color)";
        cell.style.borderRight = "1px solid var(--brown-color)";
    } else {
        comment.style.display = "none";
        value.style.display = "block";
        cell.style.background = "var(--tertiary-color)";
        cell.style.borderLeft = "0";
        cell.style.borderRight = "0";
    }
}