/// <reference path="../p5.global-mode.d.ts" />

// canvas variables
let gst_w, gst_h, gst_canvas;
let gst_game;

function preload(){
    UNREVEALED_BLOCK = loadImage(BLOCKS_TEXTURES_PATH + "/unrevealed.png");
    BLOCKS = loadJSON(BLOCKS_JSON, function(){
        for(let k of Object.keys(BLOCKS)){
            BLOCKS[k].image = loadImage(BLOCKS_TEXTURES_PATH + "/" + k + ".png");
        }
    });

    CLASSES = loadJSON(CLASSES_JSON, function(){
        for(let k of Object.keys(CLASSES)){
            CLASSES[k].image = loadImage(CLASSES_TEXTURES_PATH + "/" + k + ".png");
        }
    });

    ITEMS = loadJSON(ITEMS_JSON);

    // controls
    for(let k of Object.keys(ARROWS)){
        let ks = k.toLowerCase();
        let path = CONTROLS_TEXTURES + "/arrows";
        let enImgPath = path + "/arrow_" + ks + "_enabled.png";
        let hoImgPath = path + "/arrow_" + ks + "_hovered.png";
        let diImgPath = path + "/arrow_" + ks + "_disabled.png";

        ARROWS[k].enabledImage = loadImage(enImgPath);
        ARROWS[k].hoveredImage = loadImage(hoImgPath);
        ARROWS[k].disabledImage = loadImage(diImgPath);
    }

    LEVELS = loadJSON(LEVELS_JSON);
}

function setup(){
    gst_game = new Game(windowWidth, windowHeight);

    let startLevel = LEVELS[0];
    gst_game.prepareBoardByLevel(startLevel);
    // gst_game.prepareBoard(10, 10);

    // setting canvas resolution
    gst_w = WINDOW_WIDTH === -1 ? windowWidth : WINDOW_WIDTH;
    gst_h = WINDOW_HEIGHT === -1 ? windowHeight : WINDOW_HEIGHT;
    gst_canvas = createCanvas(gst_w, gst_h);

    controls.prepare();
    controls.setArrows(ARROWS);

    hud.prepare();

    rectMode(CENTER);
}

function draw(){
    background(GAME_BACKGROUND);

    gst_game.update();
    gst_game.show();
    gst_game.showHUD(hud);

    controls.update();
    controls.show();
}

function mousePressed(){
    if(controls instanceof Controls && !Skeleton.isObjectEmpty(controls.arrows)){
        for(let k of Object.keys(controls.arrows)){
            let arrow = controls.arrows[k];

            if(arrow.isMouseOver(mouseX, mouseY) && arrow.enabled){
                Skeleton.movePlayer(gst_game.player, arrow.def.rDir, arrow.def.cDir);
            }
        }
    }
}

function windowResized(){
    gst_w = WINDOW_WIDTH === -1 ? windowWidth : WINDOW_WIDTH;
    gst_h = WINDOW_HEIGHT === -1 ? windowHeight : WINDOW_HEIGHT;
    resizeCanvas(gst_w, gst_h);

    Skeleton.updateOffsetsPositions(gst_game.board);
    Skeleton.updateOffsetsPositions(controls);
    Skeleton.updateOffsetsPositions(hud);

}