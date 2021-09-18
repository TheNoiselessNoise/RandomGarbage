class HUD {
    constructor(){
        this.ww = null;
        this.wh = null;
        this.startX = null;
        this.startY = null;
    }

    prepare(){
        Skeleton.updateOffsetsPositions(this);
    }

    showPlayerDefinition(o){
        let def = null;

        if(o instanceof Player){
            def = o.def;
        }

        if(!(o instanceof Player) && o instanceof Object){
            def = o;
        }

        textSize(HUD_FONT_SIZE);
        textAlign(null, CENTER);

        // show health
        let health = "HEALTH: " + def.health + " / " + def.maxHealth;
        text(health, this.startX, this.startY);

        let dmg = "DMG: " + def.damage;
        text(dmg, this.startX, this.startY + HUD_DEF_PADDING);

        let int = "INT: " + def.intelligence;
        text(int, this.startX, this.startY + (HUD_DEF_PADDING * 2));

        let res = "RES: " + def.resistance;
        text(res, this.startX, this.startY + (HUD_DEF_PADDING * 3));
    }
}