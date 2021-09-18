// VARIABLES

let WINDOW_WIDTH = -1;
let WINDOW_HEIGHT = -1;
let GAME_BOARD_WIDTH = 640; // -1 half the width of the window
let GAME_BOARD_HEIGHT = 640; // -1 half the height of the window
let GAME_BOARD_BORDER = 12; // -1 half the height of the window
let GAME_BLOCK_WIDTH = 64;
let GAME_BLOCK_HEIGHT = 64;
let GAME_BACKGROUND = [52, 52, 52];
let HUD_FONT_SIZE = 16;
let HUD_DEF_PADDING = 16;
let BLOCKS_TEXTURES_PATH = "images/textures/blocks";
let CLASSES_TEXTURES_PATH = "images/textures/classes";
let CONTROLS_TEXTURES = "images/textures/controls/";

let ITEMS_JSON = "structure/items.json";
let BLOCKS_JSON = "structure/blocks.json";
let CLASSES_JSON = "structure/classes.json";
let LEVELS_JSON = "structure/levels.json";

let PRESERVED_DEFINITIONS = {
    revealed: undefined
};

// JSON STUFF
let BLOCKS = {};
let UNREVEALED_BLOCK = null;

let ITEMS = {};
let CLASSES = {};
let LEVELS = {};
let ARROWS = {
    UP: { rDir: -1, cDir: 0, x: 1, y: 0 },
    DOWN: { rDir: 1, cDir: 0, x: 1, y: 1 },
    LEFT: { rDir: 0, cDir: -1, x: 0, y: 1 },
    RIGHT: { rDir: 0, cDir: 1, x: 2, y: 1 }
};

// CLASSES
let controls = new Controls();
let hud = new HUD();
let lvlmgr = new LevelManager();
let invmgr = new InventoryManager();

// FUNCTIONS


