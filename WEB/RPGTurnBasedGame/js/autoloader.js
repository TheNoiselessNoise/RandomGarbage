window.addEventListener("DOMContentLoaded", function(){
    let scripts = [
        "js/libs/p5.min.js",
        "js/libs/p5.sound.min.js",
        "js/scripts/game.skeleton.js",
        "js/scripts/game.imgmgr.js",
        "js/scripts/game.lvlmgr.js",
        "js/scripts/game.invmgr.js",
        "js/scripts/game.player.js",
        "js/scripts/game.defaults.js",
        "js/scripts/game.main.js",
        "js/scripts/game.start.js"
    ];

    let head = document.head;

    for(let script of scripts){
        let s = document.createElement("script");
        s.src = script;

        head.appendChild(s);
    }
});