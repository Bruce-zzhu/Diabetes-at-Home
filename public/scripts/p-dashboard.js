var req_count = Object.values(required).reduce((req_count, stat) => (req_count += stat));

switch (window.innerWidth <= 380) {
    
    case true:
        mobile_adjust_histTable(req_count);

        break;

    case false:
        tab_desk_adjust_histTable(req_count);
        break;

    default:
        // pass
}

if (){
    document.getElementById("unread-notif").remove();
}

