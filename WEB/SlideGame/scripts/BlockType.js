class BlockType {
    static get LIST(){
        return Object.entries(Object.getOwnPropertyDescriptors(this))
        .filter(([key, descriptor]) => typeof descriptor.get === 'function')
        .map(([key]) => key).splice(1)
    }

    static get PLAYER(){ return {
        id: 0,
        name: "PLAYER",
        color: "dodgerblue",
        text: "",
        stepable: true,
        actionable: false
    }}
    
    static get WALL(){ return {
        id: 1,
        name: "WALL",
        color: "red",
        text: "",
        stepable: false,
        actionable: false
    }}
    
    static get PATH(){ return {
        id: 2,
        name: "PATH",
        color: "grey",
        text: "",
        stepable: true,
        actionable: false
    }}
    
    static get STEPPED(){ return {
        id: 3,
        name: "STEPPED",
        color: "green",
        text: "",
        stepable: false,
        actionable: false
    }}

    static get ENEMY(){ return {
        id: 9,
        name: "ENEMY",
        color: "brown",
        text: "",
        stepable: true,
        actionable: true
    }}

    static get TRAP(){ return {
        id: 10,
        name: "TRAP",
        color: "maroon",
        text: "",
        stepable: true,
        actionable: false
    }}

    static get FINISH(){ return {
        id: 20,
        name: "FINISH",
        color: "lightgreen",
        text: "",
        stepable: true,
        actionable: true
    }}

    static get KEY(){ return {
        id: 24,
        name: "KEY",
        color: null,
        text: "",
        stepable: true,
        actionable: true
    }}

    static get DOOR(){ return {
        id: 25,
        name: "DOOR",
        color: null,
        text: "",
        stepable: false,
        actionable: false
    }}

    static get EMPTY(){ return {
        id: 30,
        name: "EMPTY",
        color: "grey",
        // text: "♻",
        text: "",
        stepable: true,
        actionable: false
    }}

    static get SWITCH(){ return {
        id: 40,
        name: "SWITCH",
        color: "yellow",
        // text: "↔",
        text: "",
        stepable: true,
        actionable: true
    }}

    static get TRAMPOLIN(){ return {
        id: 50,
        name: "TRAMPOLIN",
        color: "orange",
        // text: "♻",
        text: "",
        stepable: true,
        actionable: true
    }}

    static get RESET(){ return {
        id: 60,
        name: "RESET",
        color: "white",
        // text: "♻",
        text: "",
        stepable: true,
        actionable: true
    }}

    static get TELEPORT(){ return {
        id: 99,
        name: "TELEPORT",
        color: "magenta",
        // text: "♻",
        text: "",
        stepable: true,
        actionable: true
    }}

    static get TIMER(){ return {
        id: 100,
        name: "TIMER",
        color: "yellow",
        text: "",
        stepable: true,
        actionable: false
    }}
}