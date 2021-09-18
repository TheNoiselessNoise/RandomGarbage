let combatStyles;
let combatStylesBool = 0;
let combatTurn = 0; // player
let player, enemy;

$(document).ready(function(){
    combatStyles = {
        LOGIN: [
            ["html, body", "width: 100%; height: 100%; display: table"],
            ["body", "display: table-cell; vertical-align: middle"]
        ],
        COMBAT: [
            //["html, body", "width: auto; height: auto; display: block"],
            ["html, body", "position: fixed; top: 0; bottom: 0; left: 0; right: 0"],
            ["#split", "display: block; width: 5%; background: #4F4F4F"],
            ["#combat", "display: flex; height: 100%"],
            ["#combat #champ", "flex: 1 1 1em; text-align: center"],
            ["#combat #champ h3", "text-align: center; padding: .5em; font-size: 5vw"],
            ["#combat #champ span", "padding: .5em 0; background: #1F1F1F; color: #FFF"],
            ["#combat #champ #inventory", "display: block; height: 100%; width: 100%; margin: 0 auto; background: #1F1F1F; line-height: 100%; font-size: 5vw; color: #FFF"],
            ["#combat #champ:first-child", "background: dodgerblue"],
            ["#combat #champ:last-child", "background: #ff0000"],
            ["#combat #champ progress", "border: 1px solid #000"],
            ["#combat #champ img", "margin: 0 auto; padding: 1em 0"]
        ]
    };
    player = document.querySelector("#champ.player");
    enemy = document.querySelector("#champ.enemy");

    $("input[type='text']").on("keydown change", function(){
        enableDisableButton($(this));
    });

    if(document.querySelectorAll("#champ").length == 2){
        changeStyles();
        startGame();
    }
});

let autoInterval;
function startGame(){
    $($(player).children()[1]).html("ATTACKING!");
    $($(enemy).children()[1]).html("SLEEPING!");
    $($(player).children()[1]).css({"background":"#4F4F4F"});
    $($(enemy).children()[1]).css({"background":"#1F1F1F"});

    autoInterval = setInterval(function(){
        changeTurn();

        if(currentChampion.isDead()){
            currentChampion.bury(player);
            clearInterval(autoInterval);
        }

        if(enemyChampion.isDead()){
            enemyChampion.bury(enemy);
            clearInterval(autoInterval);
        }
    }.bind(this), 250);
}

function changeTurn(){
    combatTurn = (combatTurn == 0) ? 1 : 0;

    if(!combatTurn){
        $($(player).children()[1]).html("SLEEPING!");
        $($(enemy).children()[1]).html("ATTACKING!");
        $($(player).children()[1]).css({"background":"#1F1F1F"});
        $($(enemy).children()[1]).css({"background":"#4F4F4F"});
        enemyChampion.damage(currentChampion);
    } else {
        $($(player).children()[1]).html("ATTACKING!");
        $($(enemy).children()[1]).html("SLEEPING!");
        $($(player).children()[1]).css({"background":"#4F4F4F"});
        $($(enemy).children()[1]).css({"background":"#1F1F1F"});
        currentChampion.damage(enemyChampion);
    }

    refresh();
}

function refresh(){
    $("#champ.player #armor").val(currentChampion.stats.armor);
    $("#champ.player #armor").attr("data-value", currentChampion.stats.armor);
    $("#champ.player #hp").val(currentChampion.stats.hp);
    $("#champ.player #hp").attr("data-value", currentChampion.stats.hp);
    //$("#champ.player #mp").val(currentChampion.stats.mp);

    $("#champ.enemy #armor").val(enemyChampion.stats.armor);
    $("#champ.enemy #armor").attr("data-value", enemyChampion.stats.armor);
    $("#champ.enemy #hp").val(enemyChampion.stats.hp);
    $("#champ.enemy #hp").attr("data-value", enemyChampion.stats.hp);
    //$("#champ.enemy #mp").val(enemyChampion.stats.mp);
}

function enableDisableButton(el=null){
    if(el != null){
        if(el.val().length >= 4){
            $($(el).siblings()[1]).removeAttr("disabled");
        } else {
            $($(el).siblings()[1]).attr("disabled", "disabled");
        }
        console.log($(el).siblings());
    } else {
        return;
    }
}

function changeStyles(styles=null){
    if(styles == null){
        if(!!+combatStylesBool){
            combatStylesBool = 0;
        } else {
            combatStylesBool = 1;
        }
    }

    let key = Object.keys(combatStyles)[combatStylesBool];
    styles = (styles == null) ? combatStyles[key] : styles;

    let tmp;
    for(let style of styles){
        let elmnt = style[0];
        let elmnt_styles = {};
        for(let css of (style[1].includes("; ") ? style[1].split("; ") : [style[1]])){
            let parts = css.split(": ");
            elmnt_styles[parts[0]] = parts[1];
        }
        tmp = elmnt_styles;
        $(elmnt).css(elmnt_styles);
    }
    console.log(tmp);
}