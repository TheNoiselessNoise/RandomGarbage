$(document).ready(function(){
    let hash = window.location.hash;
    if(!hash){
        window.location = window.location + "#about";
    }

    // check tabs against navigation
    checkTabsNav(hash);

    // handle tabs when clicking on navigation items
    // if any 'a' in 'nav' clicked
    $("nav > a").on("click", function(e){
        // on any item clicked, remove class and reset background
        for(let a of $("nav > a")){
            $(a).removeClass('active');
            $(a).css({"background":"none"});
        }

        // on current item, set class
        $(e.currentTarget).addClass('active');

        // and check tabs against navigation
        checkTabsNav();
    });

    // on hover of item, show it's real color
    $("nav > a").hover(function(e){
        let curr = e.currentTarget;
        $(curr).css({
            "background":$(curr).attr('data-color')
        });
    }).mouseleave(function(e){ // on hover out, remove color
        let curr = e.currentTarget;
        if($(curr).attr('class') != 'active'){
            $(curr).css({"background":"none"});
        }
    });

    // Search through projects if keyup on projectsSearch
    $("#projectsSearch").on("keyup", function(e){
        let search = e.currentTarget.value.toLowerCase();
        let trs = $("#projects_table tr");
        for(let tr of trs){
            // hide only TD elements
            let first = $(tr).children()[0];
            if($(first).is("td")){
                $(tr).css({"display":"none"});
            }

            if($(tr).children().length > 1){
                let second = $(tr).children()[1];
                if($(first).text().toLowerCase().includes(search) ||
                   $(second).text().toLowerCase().includes(search) ||
                   search === "") {
                    $(tr).css({"display":"table-row"});
                }
            }
        }
    });

    // open about me tab on load
    $("nav > a:first-child").trigger("click");
});

function checkTabsNav(activate=null){
    let nav = $("nav");
    let tabs = $("#tabs");

    if(activate === "#life"){
        createLifeGame();
    }

    if(activate){
        activate = activate.replace("#", "#tab_");
    }

    for(let nav_item of $(nav).find("a")){
        let cls = $(nav_item).attr('class');
        let href = $(nav_item).attr('href');
        href = href.replace("#", "#tab_");

        if(cls || href === activate){
            $(tabs).find(href).css("display", "block");
            $(nav_item).css({
                "background": $(nav_item).attr('data-color')
            });
            $("body").css({
                "background": $(nav_item).attr('data-color')
            });
        } else {
            $(tabs).find(href).css("display", "none");
        }
    }
}

// --------------------------------- LIFE GAME
function cele(e){
    return document.createElement(e);
}

let LIFE_GAME = {
    CURRENT: 0,
    LEVELS: [
        [5, 5, 10], // 5 rows, 5 cols, 30 seconds
        [10, 10, 20], // 10 rows, 10 cols, 60 seconds
        [10, 25, 30], // 10 rows, 25 cols, 90 seconds
        [10, 35, 50] // 10 rows, 35 cols, 120 seconds
    ],
    SCORE: 0,
    INTERVAL: null,
    TIME_STARTED: false
};
function createLifeGame(){
    let lifetable = cele("table");
    lifetable.current = 0;
    let rows = LIFE_GAME.LEVELS[LIFE_GAME.CURRENT][0];
    let cols = LIFE_GAME.LEVELS[LIFE_GAME.CURRENT][1];
    let seconds = LIFE_GAME.LEVELS[LIFE_GAME.CURRENT][2];

    let progress = cele("progress");
    progress.setAttribute("id", "lifeProgress");
    progress.value = LIFE_GAME.CURRENT;
    progress.max = LIFE_GAME.LEVELS.length;

    let time = cele("progress");
    time.setAttribute("id", "lifeTime");
    time.value = seconds;
    time.max = seconds;

    let score = cele("span");
    score.setAttribute("id", "lifeScore");
    score.textContent = "Score: " + LIFE_GAME.SCORE;

    for(let r = 0; r < rows; r++){
        let row = cele("tr");
        for(let c = 0; c < cols; c++){
            let col = cele("td");
            let rand = Math.round(Math.random() * cols);
            col.textContent = rand;
            col.current = rand;
            col.clickable = false;
            col.clicked = false;
            col.addEventListener("click", function(e){
                if(!this.clickable)return;
                if(!LIFE_GAME.TIME_STARTED){
                    LIFE_GAME.TIME_STARTED = true;
                    LIFE_GAME.INTERVAL = setInterval(function(){
                        time.value--;
                        if(time.value === 0){
                            LIFE_GAME.CURRENT = 0;
                            LIFE_GAME.SCORE = 0;
                            LIFE_GAME.TIME_STARTED = false;
                            clearInterval(LIFE_GAME.INTERVAL);
                            createLifeGame();
                        }
                    }, 1000);
                }

                let table = $("#life_game table")[0];
                let currValue = table.current;

                for(let tr of $("#life_game table tr")){
                    for(let td of $(tr).find("td")){
                        if(currValue == td.current){
                            td.clicked = true;
                            td.clickable = false;
                            $(td).css({"background":"orange"});

                            // update score
                            LIFE_GAME.SCORE += td.current == 0 ? 1 : td.current;
                        }
                    }
                    $("#lifeScore").text("Score: " + LIFE_GAME.SCORE);
                }
                if(currValue>=cols){
                    progress.value++;
                    LIFE_GAME.CURRENT++;
                    LIFE_GAME.TIME_STARTED = false;
                    clearInterval(LIFE_GAME.INTERVAL);

                    if(LIFE_GAME.CURRENT === LIFE_GAME.LEVELS.length){
                        let finish_btn = cele("button");
                        finish_btn.onclick = function(){ alert("YIKES! So much effort and nothing you get. How sad :-("); };
                        finish_btn.textContent = "FINISH";
                        finish_btn.style.margin = "0 auto";
                        finish_btn.style.outline = "none";
                        finish_btn.style.background = "dodgerblue";
                        finish_btn.style.border = "0";
                        finish_btn.style.display = "block";
                        finish_btn.style.cursor = "pointer";
                        $("#life_game").append(finish_btn);
                    } else {
                        createLifeGame();
                    }
                    return;
                }

                table.current++;
                this.clickable = false;
                this.clicked = true;
                this.style.background = "none";

                let next = null;
                while(next == null){
                    let rr = Math.round(Math.random() * (rows - 1));
                    let cr = Math.round(Math.random() * (cols - 1));
                    let rcell = lifetable.childNodes[rr].childNodes[cr];
                    if(!rcell.clicked){
                        next = rcell;
                    }
                }
                next.clickable = true;
                next.style.background = "dodgerblue";
                // next.style.background = "#14c5dd";

                for(let tr of $("#life_game table tr")){
                    for(let td of $(tr).find("td")){
                        if(td.clicked && td.current <= currValue && td != next){
                            td.clicked = true;
                            td.clickable = false;
                            $(td).css({"background":"orange"});
                        }
                    }
                }
            });
            row.appendChild(col);
        }
        lifetable.appendChild(row);
    }

    let rr = Math.round(Math.random() * (rows - 1));
    let cr = Math.round(Math.random() * (cols - 1));
    let rcell = lifetable.childNodes[rr].childNodes[cr];
    rcell.clickable = true;
    rcell.style.background = "dodgerblue";
    // rcell.style.background = "#14c5dd";

    $("#life_game").html(progress);
    $("#life_game").append(time);
    $("#life_game").append(lifetable);
    $("#life_game").append(score);
};