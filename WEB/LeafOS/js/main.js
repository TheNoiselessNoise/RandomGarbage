let os;
let g_int;

window.addEventListener("DOMContentLoaded", function(){
    os = new LeafOS(document.body);
    os.boot();

    g_int = setInterval(function(){ os.update(); }, 50);
});