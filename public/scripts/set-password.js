function emailWithValue(){
    if (document.getElementById("email").value != ""){
        document.getElementById("email-submit").style.backgroundColor = "var(--green-color)"
        document.getElementById("email-submit").style.cursor = "pointer"
    } else{
        document.getElementById("email-submit").style.backgroundColor = "var(--border-color)"
        document.getElementById("email-submit").style.cursor = "default"
    }
}

function passwordWithValue(){
    var pw1 = document.getElementById("password").value;
    var pw2 = document.getElementById("second-password").value;
    if ((pw1 != "") && (pw2 != "") && (pw1 === pw2)) {
        document.getElementById("reset-submit").style.backgroundColor = "var(--green-color)"
        document.getElementById("reset-submit").style.cursor = "pointer"
    } else {
        document.getElementById("reset-submit").style.backgroundColor = "var(--border-color)"
        document.getElementById("reset-submit").style.cursor = "default"
    }
}