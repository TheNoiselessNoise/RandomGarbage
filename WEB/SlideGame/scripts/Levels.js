class Levels {
    /*
    static get <LEVEL_NAME>(){ return {
        player: [0, 0],
        map: [
            [2, 2, 2],
            [2, 2, 2],
            [2, 2, 2],
        ],
        data: {
            <block_id>: [<data>]
        }
    }}
    */
    static get LIST(){
        return Object.entries(Object.getOwnPropertyDescriptors(this))
        .filter(([key, descriptor]) => typeof descriptor.get === 'function')
        .map(([key]) => key).splice(1)
    }
    
    static get TUTORIAL(){ return {
        title: "TUTORIAL (W A S D, R = RESET LEVEL)",
        player: [0, 0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
            [2, 2, 2],
            [1, 1, 2],
            [20, 2, 2],
        ]
    }}
    
    static get ZIG_ZAG(){ return {
        title: "ZIG ZAG",
        player: [0, 0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
            [2, 1, 2, 2, 2],
            [2, 2, 2, 1, 2],
            [1, 1, 1, 2, 2],
            [20, 2, 1, 2, 1],
            [1, 2, 2, 2, 1]
        ]
    }}

    static get TWIST(){ return {
        title: "TWIST",
        player: [2, 2],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
            [20, 1, 2, 2, 2],
            [2, 1, 2, 1, 2],
            [2, 1, 2, 1, 2],
            [2, 2, 1, 2, 2],
            [1, 2, 2, 2, 1]
        ]
    }}

    static get SWITCHES(){ return {
        title: "SWITCHES",
        player: [2, 2],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
            [20, 1, 1, 40, 1],
            [2, 1, 40, 1, 2],
            [2, 1, 2, 1, 2],
            [2, 1, 1, 1, 40],
            [1, 40, 2, 2, 1]
        ],
        data: {
            40: [
                "RIGHT",
                "UP",
                "DOWN",
                "LEFT"
            ]
        }
    }}

    static get TELEPORTS(){ return {
        title: "TELEPORTS",
        player: [0, 0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
            [2, 2, 2, 2, 99],
            [1, 1, 1, 1, 1],
            [2, 2, 2, 2, 99],
            [1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2],
        ],
        data: {
            99: [
                [0, 2],
                [0, 4]
            ]
        }
    }}

    // static get CONVEYOR_BELT(){ return {
    //     title: "CONVEYOR BELT",
    //     player: [0, 0],
    //     map: [
    //         [2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 40],
    //         [2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1],
    //         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    //         [40, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2],
    //         [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    //         [2, 1, 2, 1, 40, 1, 40, 1, 40, 1, 40, 2, 2, 1, 2, 2],
    //         [2, 1, 2, 40, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2],
    //         [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2],
    //         [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    //         [1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2],
    //         [40, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 40]
    //     ],
    //     data: {
    //         40: [
    //             "DOWN", 
    //             "RIGHT", 
    //             "RIGHT", "RIGHT", "RIGHT", "RIGHT", 
    //             "UP", 
    //             "UP", "LEFT"
    //         ]
    //     }
    // }}

    static get SWITCHES_TWO(){ return {
        title: "SWITCHES 2",
        player: [0, 0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
            [2, 2, 40, 2, 2],
            [1, 1, 1, 1, 1],
            [2, 2, 40, 2, 2],
            [1, 1, 1, 1, 1],
            [2, 2, 40, 1, 2],
        ],
        data: {
            40: [
                [4, 0, BlockType.TELEPORT, [0, 2]],
                [4, 2, BlockType.TELEPORT, [0, 4]],
                "RIGHT" // or [3, 4, BlockType.PATH, null]
            ]
        }
    }}

    static get RESET(){ return {
        title: "RESET",
        player: [0, 0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
            [2, 2, 2],
            [2, 1, 2],
            [2, 1, 2],
            [2, 60, 2],
            [2, 2, 2],
        ]
    }}

    static get TRAMPOLINS(){ return {
        title: "TRAMPOLINS",
        player: [0, 0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
            [2, 2, 2, 2, 50],
            [50, 2, 2, 50, 2],
            [2, 50, 2, 2, 2],
            [2, 2, 2, 2, 2],
            [2, 2, 2, 2, 50]
        ],
        data: {
            // [<direction>, <number_or_boolean>] --> TRUE = full, FALSE = one
            50: [
                ["DOWN", true],
                ["RIGHT", true], ["DOWN", true],
                ["RIGHT", true],
                ["LEFT", true]
            ]
        }
    }}

    static get TEST(){ return {
        title: 'test',
        player: [0,0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 2], 
          [2, 2, 40, 2, 2], 
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 2]
        ],
        data: {"40":[[4,0,"BlockType.TRAMPOLIN",["DOWN",true]]]}
    }}

    static get TEST_TEST(){ return {
        title: 'test test',
        player: [0,0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
          [2, 50, 2, 2, 50], 
          [50, 2, 2, 50, 2], 
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 2], 
          [50, 2, 2, 2, 50]
        ],
        data: {
            "50":[
                ["RIGHT",true], ["DOWN",true],
                ["RIGHT",true], ["DOWN",true],
                ["UP",true], ["LEFT",true]
            ]
        }
    }}

    static get MAZE_ONE(){ return {
        title: 'maze one',
        player: [5,0],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
          [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1], 
          [1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1], 
          [1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1], 
          [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 99, 1, 2, 2, 2, 2, 2, 2, 1], 
          [2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1], 
          [1, 1, 1, 2, 1, 40, 40, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1], 
          [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1], 
          [1, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1], 
          [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 99, 1, 2, 2, 2, 1], 
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        data: {"40":["UP",[6,4,"BlockType.RESET",null]],"99":[[15,2],[11,3]]}
    }}

    static get TELEPORT_MADNESS(){ return {
        title: 'TELEPORT MADNESS',
        player: [0,12],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
          [1, 1, 99, 1, 99, 1, 99, 1, 99, 1, 99, 1, 2, 1, 1, 99, 1, 99, 1, 99, 1, 99, 1, 1, 1], 
          [1, 1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 2, 1, 1, 30, 1, 30, 1, 30, 1, 30, 1, 1, 1], 
          [1, 99, 30, 30, 30, 30, 30, 30, 30, 30, 2, 1, 2, 1, 2, 2, 30, 30, 30, 30, 30, 30, 30, 99, 1], 
          [1, 1, 30, 1, 30, 1, 30, 1, 30, 1, 2, 1, 2, 1, 1, 30, 1, 30, 1, 30, 1, 30, 1, 1, 1], 
          [1, 1, 99, 1, 99, 1, 99, 1, 99, 1, 2, 2, 2, 1, 1, 99, 1, 99, 1, 99, 1, 99, 1, 1, 1], 
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
          [1, 99, 1, 99, 1, 99, 1, 99, 1, 99, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], 
          [1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1], 
          [1, 30, 30, 30, 30, 30, 30, 30, 30, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 30, 30, 1, 2, 1], 
          [1, 30, 1, 30, 1, 30, 1, 30, 1, 30, 1, 1, 1, 1, 1, 2, 1, 2, 1, 30, 1, 30, 1, 2, 1], 
          [1, 99, 1, 99, 1, 99, 1, 99, 1, 99, 1, 1, 1, 1, 1, 2, 2, 2, 1, 99, 1, 99, 1, 2, 1], 
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        data: {"99":[[12,0],[12,0],[12,0],[12,0],[12,0],[12,0],[12,0],[12,0],[11,9],[12,0],[12,0],[12,0],[14,3],[12,0],[12,0],[12,0],[12,0],[12,0],[12,0],[12,0],[12,0],[12,0],[13,9],[12,0],[12,0],[12,0],[12,0],[12,0],[12,0],[23,11],[12,0]]}
    }}

    static get TEST_EVERYTHING(){ return {
        title: 'TEST EVERYTHING',
        player: [1,1],
        playerFill: true,
        steppedBlocksStepable: false,
        map: [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
          [1, 2, 2, 2, 50, 1, 2, 40, 1, 2, 1], 
          [1, 1, 1, 1, 2, 1, 1, 1, 1, 40, 1], 
          [1, 99, 1, 1, 2, 1, 99, 1, 1, 1, 1], 
          [1, 2, 2, 2, 50, 1, 2, 1, 40, 2, 1], 
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], 
          [1, 2, 40, 1, 2, 1, 2, 2, 2, 1, 2], 
          [1, 2, 2, 2, 50, 1, 1, 1, 2, 2, 1], 
          [40, 1, 2, 1, 1, 1, 40, 2, 2, 2, 1], 
          [2, 1, 50, 2, 99, 1, 1, 2, 2, 1, 99], 
          [2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2]
        ],
        data: {
            "40":[
                "RIGHT",
                [9, 1, "BlockType.TELEPORT", [9, 4]],
                "LEFT",
                "DOWN",
                [0, 9, "BlockType.TELEPORT", [9, 10]],
                [6, 7, "BlockType.TELEPORT", [1, 10]]
            ],
            "50":[
                ["DOWN", true],
                ["LEFT", false],
                ["LEFT", true],
                ["RIGHT", false]
            ],
            "99":[
                [6, 1],
                [4, 6],
                [6, 6],
                [10, 6]
            ]
        }
    }}

    static get TEST_FINISH(){ return {
        title: 'test finish',
        player: [0, 0],
        playerFill: false,
        steppedBlocksStepable: false,
        map: [
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 20]
        ],
        data: {},

        // enemies: [<row>, <col>, <move>, <one_or_full>]
        // move => the higher the slower
        enemies: [
            [2, 2, 10, true]
        ]
    }}

    static get TEST_STEPABLE(){ return {
        title: 'test stepable',
        player: [0, 0],
        playerFill: true,
        steppedBlocksStepable: true,
        map: [
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 2], 
          [2, 2, 10, 2, 2], 
          [2, 2, 2, 2, 2], 
          [2, 2, 2, 2, 2]
        ],
        data: {
            10: [
                5
            ]
        },
        enemies: []
    }}
}