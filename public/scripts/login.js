function withValue(){
    if ((document.getElementById("email").value != "") && (document.getElementById("password").value != "")){
        document.getElementById("login-submit").style.backgroundColor = "var(--deepBlue-color)"
        document.getElementById("login-submit").style.cursor = "pointer"
    } else{
        document.getElementById("login-submit").style.backgroundColor = "var(--border-color)"
        document.getElementById("login-submit").style.cursor = "default"
    }
}

