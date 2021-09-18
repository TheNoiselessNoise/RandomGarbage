Element.prototype.remove = function(){
    this.parentNode.removeChild(this)
}

class BlockType {
    static get LIST(){
        return Object.entries(Object.getOwnPropertyDescriptors(this))
        .filter(([key, descriptor]) => typeof descriptor.get === 'function')
        .map(([key]) => key).splice(1)
    }
    
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
        color: "dodgerblue",
        text: "",
        stepable: false,
        actionable: false
    }}

    static get TRAP(){ return {
        id: 10,
        name: "TRAP",
        color: "maroon",
        text: "",
        stepable: true,
        actionable: false
    }}
    
    static get PLAYER(){ return {
        id: 0,
        name: "PLAYER",
        color: "green",
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
        actionable: false
    }}

    static get DOOR(){ return {
        id: 25,
        name: "DOOR",
        color: "blue",
        text: "",
        stepable: false,
        actionable: false
    }}

    static get EMPTY(){ return {
        id: 30,
        name: "EMPTY",
        color: "lightgrey",
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
}

let enemyCount = 0
let enemies = []
function addEnemy(){
    let enemy_row = Number(getEle("#enemy_row")[0].value)
    let enemy_col = Number(getEle("#enemy_col")[0].value)
    let enemy_move = Number(getEle("#enemy_move")[0].value)
    let enemy_typemove = getEle("#enemy_typemove")[0].value == "true"

    let exists = false
    if(enemies.length != 0){
        for(let enemy of enemies){
            if(enemy[0] == enemy_row && enemy[1] == enemy_col){
                exists = true
                break
            }
        }
    }

    if(!exists){
        enemies.push([enemy_row, enemy_col, enemy_move, enemy_typemove])
        enemyCount++

        let type_mov = enemy_typemove ? "FULL" : "ONE"
        let enemy = `
            <div id='enemy'>
                <div id='enemyInfo'>ROW:&nbsp;`+enemy_row+`</div>
                <div id='enemyInfo'>COL:&nbsp;`+enemy_col+`</div>
                <div id='enemyInfo'>MOV:&nbsp;`+enemy_move+`</div>
                <div id='enemyInfo'>MOV_TYPE:&nbsp;`+type_mov+`</div>
                <div id='enemyInfo' class='removeEnemy' onclick='removeEnemy(this)'>X</div>
            </div>`
        getEle("#enemies")[0].innerHTML += enemy
        getEle("#addEnemyButton")[0].textContent = "ADD ENEMY (" + (enemyCount + 1) + ")"
    }
}

function getChildNumber(node) {
    return Array.from(node.parentNode.children).indexOf(node);
}

function removeEnemy(rem){
    let index = getChildNumber(rem.parentNode)
    enemies.splice(index, 1)
    enemyCount--
    getEle("#addEnemyButton")[0].textContent = "ADD ENEMY (" + (enemyCount + 1) + ")"
    rem.parentNode.remove()
}

function createGrid(){
    if(!getEle("table")[0]){
        // undisable disabled inputs
        let player_row = getEle("#player_row")[0]
        player_row.value = 0
        player_row.disabled = false

        let player_col = getEle("#player_col")[0]
        player_col.value = 0
        player_col.disabled = false

        let block_type = getEle("#blockType")[0]
        let selected = block_type.options[block_type.selectedIndex]
        if(selected.value == ""){
            selected.remove()
            block_type.disabled = false
        }

        // undisable disabled enemy inputs
        let enemy_row = getEle("#enemy_row")[0]
        enemy_row.value = 0
        enemy_row.disabled = false

        let enemy_col = getEle("#enemy_col")[0]
        enemy_col.value = 0
        enemy_col.disabled = false

        let enemy_move = getEle("#enemy_move")[0]
        enemy_move.value = 10
        enemy_move.disabled = false

        let enemy_typemove = getEle("#enemy_typemove")[0]
        let typemove_selected = enemy_typemove.options[enemy_typemove.selectedIndex]
        if(typemove_selected.value == ""){
            typemove_selected.remove()
            enemy_typemove.disabled = false
        }

        let addEnemyButton = getEle("#addEnemyButton")[0]
        addEnemyButton.disabled = false
    } else {
        getEle("table")[0].remove()
    }
    
    let rows = getEle("#rows")[0]
    let cols = getEle("#cols")[0]
    
    let table = createEle("table")
    for(let r = 0; r < rows.value; r++){
        let tr = createEle("tr")
        for(let c = 0; c < cols.value; c++){
            let td = createEle("td")
            td.textContent = " "
            td["rowIndex"] = r
            td["colIndex"] = c
            td["data"] = BlockType.PATH

            td.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                return false
            })

            td.addEventListener("dragenter", (e) => {
                let select = getEle("#blockType")[0]
                let block_types = BlockType.LIST
                if(block_types.includes(select.value)){
                    let block = eval("BlockType." + select.value)
                    td["data"] = block
                    
                    updateBlocks()
                }
            })

            td.addEventListener("mousedown", (e) => {
                if(e.which === 1){ // LEFT CLICK
                    let select = getEle("#blockType")[0]
                    let block_types = BlockType.LIST
                    if(block_types.includes(select.value)){
                        let block = eval("BlockType." + select.value)
                        td["data"] = block
                        
                        updateBlocks()
                    }
                } else if(e.which === 2){ // MIDDLE CLICK
                    e.preventDefault()
                    td["data"] = BlockType.PATH
                    updateBlocks()
                } else if(e.which === 3){ // RIGHT CLICK
                    // show block settings
                    let blockSettings = getEle("#blockSettings")[0]
                    blockSettings.style.display = "block"

                    // change block name
                    let blockName = getEle("#blockName")[0]
                    blockName.textContent = td.data.name

                    // change block position
                    let block_row = getEle("#rowIndex")[0]
                    block_row.textContent = td["rowIndex"]

                    let block_col = getEle("#colIndex")[0]
                    block_col.textContent = td["colIndex"]

                    /*
                        TRAMPOLINS
                        -> [<direction>, <number_or_boolean>]
                    */
                    // show settings for block
                    let block = ""
                    let script = ""
                    if(td.data.name == "SWITCH"){
                        let direction = ""
                        let new_row = 0
                        let new_col = 0
                        let switch_block = "WALL"
                        let tel_row = 0
                        let tel_col = 0
                        if(td.tmpData){
                            if(td.tmpData.direction){
                                direction = td.tmpData.direction

                                script += `
                                    getEle('#switch_direction')[0].value = '` + direction + `'
                                `
                            } else {
                                new_row = td.tmpData.new_row
                                new_col = td.tmpData.new_col
                                switch_block = td.tmpData.block

                                script += `
                                    getEle('#switch_block_new_row')[0].value = '` + new_row + `'
                                    getEle('#switch_block_new_col')[0].value = '` + new_col + `'
                                    getEle('#switch_block')[0].value = '` + switch_block + `'`
                            }
                        }
                            
                        block += `
                            <h3>REMOVE BLOCK</h3>
                            <select id='switch_direction'>
                                <option value=''>DIRECTION</option>
                                <option value='UP'>UP</option>
                                <option value='LEFT'>LEFT</option>
                                <option value='DOWN'>DOWN</option>
                                <option value='RIGHT'>RIGHT</option>
                            </select>

                            <h3>CHANGE BLOCK</h3>
                            <label for='switch_block'>NEW BLOCK:</label>
                            <select id="switch_block">
                                <option value="WALL">WALL</option>
                                <option value="PATH">PATH</option>
                                <option value="TRAMPOLIN">TRAMPOLIN</option>
                                <option value="RESET">RESET</option>
                                <option value="TELEPORT">TELEPORT</option>
                            </select>

                            <label for='switch_block_new_row'>NEW BLOCK ROW:</label>
                            <input 
                                type='number' 
                                id='switch_block_new_row' 
                                value='0'
                                onfocus="colorPosition(this, getEle('#switch_block_new_col')[0])"
                                oninput="colorPosition(this, getEle('#switch_block_new_col')[0])"
                                onblur="updateBlocks()">
                            <br>

                            <label for='switch_block_new_col'>NEW BLOCK COL:</label>
                            <input 
                                type='number' 
                                id='switch_block_new_col' 
                                value='0'
                                onfocus="colorPosition(getEle('#switch_block_new_row')[0], this)"
                                oninput="colorPosition(getEle('#switch_block_new_row')[0], this)"
                                onblur="updateBlocks()">
                            <br>

                            <div id='other_block'></div>`

                        script += `
                            let sel = getEle('#switch_block')[0]
                            sel.addEventListener('change', () => {
                                let other = ''
                                if(sel.value == 'TELEPORT'){
                                    other = \`
                                        <label for='switch_block_teleport_row'>TELEPORT TO ROW:</label>
                                        <input 
                                            type='number' 
                                            id='switch_block_teleport_row' 
                                            value='0'
                                            onfocus='colorPosition(this, getEle(\"#switch_block_teleport_col\")[0])'
                                            oninput='colorPosition(this, getEle(\"#switch_block_teleport_col\")[0])'
                                            onblur='updateBlocks()'>
                                        <br>
        
                                        <label for='switch_block_teleport_col'>TELEPORT TO COL:</label>
                                        <input 
                                            type='number' 
                                            id='switch_block_teleport_col' 
                                            value='0'
                                            onfocus='colorPosition(getEle(\"#switch_block_teleport_row\")[0], this)'
                                            oninput='colorPosition(getEle(\"#switch_block_teleport_row\")[0], this)'
                                            onblur='updateBlocks()'>
                                    \`
                                } else if(sel.value == 'TRAMPOLIN'){
                                    other = \`
                                        <label for='trampolin_direction'>DIRECTION:</label>
                                        <select id='trampolin_direction'>
                                            <option value='UP'>UP</option>
                                            <option value='LEFT'>LEFT</option>
                                            <option value='DOWN'>DOWN</option>
                                            <option value='RIGHT'>RIGHT</option>
                                        </select>

                                        <label for='trampolin_blocks'>BLOCKS TO JUMP (if filled, MOVEMENT will be skipped):</label>
                                        <input type='number' id='trampolin_blocks'>
                                        
                                        <label for='trampolin_movement'>MOVEMENT:</label>
                                        <select id='trampolin_movement'>
                                            <option value='false'>ONE</option>
                                            <option value='true'>FULL</option>
                                        </select>\`
                                }

                                getEle("#other_block")[0].innerHTML = other
                            })
                        `
                    } else if(td.data.name == "TELEPORT"){
                        let teleport_row = 0
                        let teleport_col = 0
                        if(td.tmpData){
                            teleport_row = td.tmpData.rowIndex
                            teleport_col = td.tmpData.colIndex
                        }

                        block += `
                        <label for='teleport_block_row'>TELEPORT TO ROW:</label>
                        <input 
                            type='number' 
                            id='teleport_block_row' 
                            value='` + teleport_row + `'
                            onfocus="colorPosition(this, getEle('#teleport_block_col')[0])"
                            oninput="colorPosition(this, getEle('#teleport_block_col')[0])"
                            onblur="updateBlocks()">
                        <br>
                        
                        <label for='teleport_block_col'>TELEPORT TO COL:</label>
                        <input 
                            type='number' 
                            id='teleport_block_col' 
                            value='` + teleport_col + `'
                            onfocus="colorPosition(getEle('#teleport_block_row')[0], this)"
                            oninput="colorPosition(getEle('#teleport_block_row')[0], this)"
                            onblur="updateBlocks()">
                        `
                    } else if(td.data.name == "TRAMPOLIN"){
                        let direction = "UP"
                        let blocks = ""
                        if(td.tmpData){
                            direction = td.tmpData.direction
                            blocks = td.tmpData.blocks
                        }

                        block += `
                        <label for='trampolin_direction'>DIRECTION:</label>
                        <select id='trampolin_direction'>
                            <option value='UP'>UP</option>
                            <option value='LEFT'>LEFT</option>
                            <option value='DOWN'>DOWN</option>
                            <option value='RIGHT'>RIGHT</option>
                        </select>

                        <label for='trampolin_blocks'>BLOCKS TO JUMP (if filled, MOVEMENT will be skipped):</label>
                        <input type='number' id='trampolin_blocks'>
                        
                        <label for='trampolin_movement'>MOVEMENT:</label>
                        <select id='trampolin_movement'>
                            <option value='false'>ONE</option>
                            <option value='true'>FULL</option>
                        </select>`

                        script += `
                            getEle('#trampolin_direction')[0].value = '` + direction + `'
                        `

                        if(!isNaN(blocks)){
                            script += `
                                getEle('#trampolin_movement')[0].value = '` + blocks + `'
                            `
                        } else {
                            script += `
                                getEle('#trampolin_blocks')[0].value = '` + blocks + `'
                            `
                        }
                    } else if(td.data.name == "DOOR"){
                        let door_locked = ""
                        let key_row = 0
                        let key_col = 0
                        let display = "none"
                        if(td.tmpData){
                            door_locked = td.tmpData.door_locked ? "checked" : ""
                            display = td.tmpData.door_locked ? "block" : "none"
                            key_row = td.tmpData.key_row
                            key_col = td.tmpData.key_col
                        }
                        
                        block += `
                        <label for='door_locked'>Is door locked:</label>
                        <input type='checkbox' id='door_locked' onclick="showHideElement(getEle('#keyPosition')[0])" `+door_locked+`>

                        <div id='keyPosition' style='display:`+display+`'>
                            <label for='key_row'>KEY ROW:</label>
                            <input 
                                type='number' 
                                id='key_row'
                                value='` + key_row + `'
                                onfocus="colorPosition(this, getEle('#key_col')[0])"
                                oninput="colorPosition(this, getEle('#key_col')[0])"
                                onblur="updateBlocks()">

                            <label for='key_col'>KEY COL:</label>
                            <input 
                                type='number' 
                                id='key_col'
                                value='` + key_col + `'
                                onfocus="colorPosition(getEle('#key_row')[0], this)"
                                oninput="colorPosition(getEle('#key_row')[0], this)"
                                onblur="updateBlocks()">
                        </div>`
                    } else if(td.data.name == "TRAP"){
                        let trap_rate = 5
                        if(td.tmpData){
                            trap_rate = td.tmpData.trap_rate
                        }

                        block += `
                            <label for='trap_rate'>TRAP RATE (the lower the faster):</label>
                            <input
                                min='0'
                                max='10'
                                type='number' 
                                id='trap_rate'
                                value='` + trap_rate + `'>
                        `
                    }

                    block += "<button onclick='saveBlock(" + td["rowIndex"] + "," + td["colIndex"] + ")'>SAVE BLOCK</button>"

                    getEle("#block")[0].innerHTML = block
                    eval(script)
                }

            });
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
    
    getEle("#grid")[0].appendChild(table)
    updateBlocks()
}

function saveBlock(r, c){
    let table = getEle("table")[0]
    let table_row = table.childNodes[r]
    let td = table_row.childNodes[c]

    if(td.tmpData){
        td.tmpData = {}
    }

    if(td.data.name == "SWITCH"){
        let direction = getEle("#switch_direction")[0].value
        let new_row = getEle("#switch_block_new_row")[0].value
        let new_col = getEle("#switch_block_new_col")[0].value
        let block = getEle("#switch_block")[0].value
        if(direction != ""){
            td["tmpData"] = {
                direction: direction
            }
        } else {
            if(block == "TELEPORT"){
                let tel_row = getEle("#switch_block_teleport_row")[0].value
                let tel_col = getEle("#switch_block_teleport_col")[0].value
                td["tmpData"] = {
                    new_row: new_row,
                    new_col: new_col,
                    block: block,
                    tel_row: tel_row,
                    tel_col: tel_col
                }
            } else if(block == "TRAMPOLIN"){
                let direction = getEle("#trampolin_direction")[0].value
                let blocks = getEle("#trampolin_blocks")[0].value
                if(blocks == ""){
                    blocks = getEle("#trampolin_movement")[0].value
                }

                td["tmpData"] = {
                    new_row: new_row,
                    new_col: new_col,
                    block: block,
                    tram_direction: direction,
                    tram_blocks: blocks
                }
            } else {
                td["tmpData"] = {
                    new_row: new_row,
                    new_col: new_col,
                    block: block
                }
            }
        }
    } else if(td.data.name == "TELEPORT"){
        let teleport_row = getEle("#teleport_block_row")[0].value
        let teleport_col = getEle("#teleport_block_col")[0].value
        td["tmpData"] = {
            rowIndex: teleport_row,
            colIndex: teleport_col
        }
    } else if(td.data.name == "TRAMPOLIN"){
        let direction = getEle("#trampolin_direction")[0].value
        let blocks = getEle("#trampolin_blocks")[0].value
        if(blocks == ""){
            blocks = getEle("#trampolin_movement")[0].value
        }

        td["tmpData"] = {
            direction: direction,
            blocks: blocks
        }
    } else if(td.data.name == "DOOR"){
        let door_locked = getEle("#door_locked")[0].checked
        let key_row = getEle("#key_row")[0].value
        let key_col = getEle("#key_col")[0].value

        td["tmpData"] = {
            door_locked: door_locked,
            key_row: key_row,
            key_col: key_col
        }
    } else if(td.data.name == "TRAP"){
        let trap_rate = getEle("#trap_rate")[0].value

        td["tmpData"] = {
            trap_rate: trap_rate
        }
    }
}

function testLevel(){
    let level = saveLevel(true)
    level = level.split("return ")[1].replace("}}", "}")
    window.open("index.html?level=" + btoa(level), "_blank")
}

function saveLevel(ret = false){
    let levelFunc = getEle("#title")[0].value.toUpperCase()
    while(levelFunc.includes(" ")){
        levelFunc = levelFunc.replace(" ", "_")
    }
    
    let levelName = getEle("#title")[0].value
    let pr = getEle("#player_row")[0].value
    let pc = getEle("#player_col")[0].value
    let playerFill = getEle("#playerFill")[0].checked
    let steppedBlocksStepable = getEle("#steppedBlocksStepable")[0].checked

    // ------------------------------ MAP

    let map = "["
    let rows = getEle("table")[0].childNodes
    for(let row of rows){
        map += "\n      ["
        for(let cell of row.childNodes){
            map += cell.data.id
            if(cell != row.childNodes[row.childNodes.length - 1]){
                map += ", "
            }
        }
        map += "]"
        if(row != rows[rows.length - 1]){
            map += ", "
        } else {
            map += "\n"
        }
    }
    map += "    ]"

    // ------------------------------ DATA
    let actionables = ["SWITCH", "TELEPORT", "TRAMPOLIN", "DOOR", "TRAP"]
    let data = {}
    for(let row of rows){
        for(let td of row.childNodes){
            if(!Object.keys(data).includes(String(td.data.id)) && actionables.includes(td.data.name)){
                data[td.data.id] = []
            }

            if(td.data.name == "SWITCH"){
                if(td.tmpData.direction){
                    data[td.data.id].push(td.tmpData.direction)
                } else {
                    if(td.tmpData.block == "TELEPORT"){
                        data[td.data.id].push([
                            Number(td.tmpData.new_col),
                            Number(td.tmpData.new_row),
                            "BlockType." + td.tmpData.block,
                            [Number(td.tmpData.tel_col), Number(td.tmpData.tel_row)]
                        ])
                    } else if(td.tmpData.block == "TRAMPOLIN") {
                        let bool = false
                        if(isNaN(td.tmpData.tram_blocks)){
                            bool = td.tmpData.tram_blocks == "true"
                        } else {
                            bool = td.tmpData.tram_blocks
                        }

                        data[td.data.id].push([
                            Number(td.tmpData.new_col),
                            Number(td.tmpData.new_row),
                            "BlockType." + td.tmpData.block,
                            [td.tmpData.tram_direction, bool]
                        ])
                    } else {
                        data[td.data.id].push([
                            Number(td.tmpData.new_col),
                            Number(td.tmpData.new_row),
                            "BlockType." + td.tmpData.block,
                            null
                        ])
                    } 
                }
            } else if(td.data.name == "TELEPORT"){
                data[td.data.id].push([Number(td.tmpData.colIndex), Number(td.tmpData.rowIndex)])
            } else if(td.data.name == "TRAMPOLIN"){
                if(isNaN(td.tmpData.blocks)){
                    let bool = td.tmpData.blocks == "true"
                    data[td.data.id].push([td.tmpData.direction, bool])
                } else {
                    data[td.data.id].push([td.tmpData.direction, Number(td.tmpData.blocks)])
                }
            } else if(td.data.name == "DOOR"){
                let locked = false
                let key_row = null
                let key_col = null
                if(td.tmpData){
                    locked = td.tmpData.door_locked
                    key_row = td.tmpData.key_row
                    key_col = td.tmpData.key_col
                }

                if(locked){
                    data[td.data.id].push([locked, Number(key_row), Number(key_col)])
                } else {
                    data[td.data.id].push([locked, null, null])
                }
            } else if(td.data.name == "TRAP"){
                let trap_rate = 5
                if(td.tmpData){
                    trap_rate = td.tmpData.trap_rate
                }

                data[td.data.id].push(Number(trap_rate))
            }
        }
    }

    // ------------------------------ RESULT

    let level = `static get `+levelFunc+`(){ return {
    title: '`+levelName+`',
    player: [`+pr+`, `+pc+`],
    playerFill: ` + playerFill + `,
    steppedBlocksStepable: ` + steppedBlocksStepable + `,
    map: `+map+`,
    data: `+JSON.stringify(data)+`,
    enemies: `+JSON.stringify(enemies)+`
}}`

    if(ret){
        return level
    } else {
        let block = getEle("#result #code")[0]
        block.textContent = level
        hljs.highlightBlock(block)
    }
}

function updateBlocks(){
    let tds = getEle("table tr td")
    for(let td of tds){
        if(td.data){
            td.style.background = td.data.color
        }
    }
}

function createEle(name){
    return document.createElement(name)
}

function getEle(selector){
    return document.querySelectorAll(selector)
}

document.addEventListener("DOMContentLoaded", () => {

})

function colorPosition(r, c){
    let row = r
    let col = c
    
    let rowLength = getEle("table")[0].childNodes.length
    if(row.value >= rowLength){
        row.value = 0
    } else if(row.value < 0){
        row.value = rowLength - 1
    }
    
    let colLength = getEle("table")[0].childNodes[0].childNodes.length
    if(col.value >= colLength){
        col.value = 0
    } else if(col.value < 0){
        col.value = colLength - 1
    }
    
    for(let td of getEle("td")){
        if(td.data){
            td.style.background = td.data.color
        } else {
            td.style.background = "white"
        }
        td.style.border = "1px solid #000"
    }
    
    let table = getEle("table")[0]
    let table_row = table.childNodes[row.value]
    let table_cell = table_row.childNodes[col.value]
    table_cell.style.background = "wheat"
    table_cell.style.border = "3px outset solid #000"
}

function showTutorial(){
    let tut = `SETUP:
    -> FILL OUT 'TITLE', 'ROWS', 'COLS' and hit 'CREATE GRID' button

GRID:
    -> LEFT-CLICK = CHANGE BLOCK
    -> MIDDLE-CLICK = RESET BLOCK
    -> RIGHT-CLICK = CHANGE BLOCK SETTINGS
    -> HOLD LEFT-CLICK AND DRAG = FILL BLOCKS ON HOVER`

    alert(tut)
}

function showHideElement(element){
    if(element.style.display == "none"){
        element.style.display = "block"
    } else {
        element.style.display = "none"
    }
}