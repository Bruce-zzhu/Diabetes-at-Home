function emailWithValue(){
    var subBtn = document.getElementById("email-submit");
    if (document.getElementById("email").value != ""){
        subBtn.style.backgroundColor = "var(--green-color)"
        subBtn.style.color = "white"
        subBtn.style.cursor = "pointer"
        subBtn.disabled = false;
    } else{
        subBtn.style.backgroundColor = "var(--border-color)"
        subBtn.style.color = "var(--altText-color)"
        subBtn.style.cursor = "default"
        subBtn.disabled = true;
    }
}

function passwordWithValue(){
    var pw1 = document.getElementById("password").value;
    var pw2 = document.getElementById("second-password").value;
    var subBtn = document.getElementById("reset-submit");
    if ((pw1 != "") && (pw2 != "") && (pw1 === pw2)) {
        subBtn.style.backgroundColor = "var(--green-color)"
        subBtn.style.color = "white"
        subBtn.style.cursor = "pointer"
        subBtn.disabled = false;
    } else {
        subBtn.style.backgroundColor = "var(--border-color)"
        subBtn.style.color = "var(--altText-color)"
        subBtn.style.cursor = "default"
        subBtn.disabled = true;
    }
}