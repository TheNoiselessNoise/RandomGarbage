class Champion {
    constructor(stats){
        this.stats = stats;
    }

    damage(who){ // damage champion
        let damage = this.stats.attackdamage;
        if(who.stats.armor > damage){
            who.stats.armor -= damage;
            damage = 0;
        } else {
            damage -= who.stats.armor;
            who.stats.armor -= damage / 10;
        }
        
        who.stats.hp -= damage;
        refresh();
    }

    bury(who){ // make champion dead
        for(let el of $(who).children()){
            if($(el).is("img")){
                $(el).attr("src", "https://cdn0.iconfinder.com/data/icons/medicine-10/100/017_-_Coffin-512.png");
                $(el).css({"width":"120px", "height":"120px"});
            } else if($(el).is("#action")){
                $(el).html("!!! DEAD !!!");
            }
        }
    }

    isDead(){
        return this.stats.hp <= 0;
    }
}