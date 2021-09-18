/// <reference path="./p5.global-mode.d.ts" />

function charCode(char, upper=true){
    char = char.toUpperCase();
    return char.charCodeAt(0);
}

// PLAY NOTES RELATED OBJECTS
class Settings {
    // note settings (those things going down)
    static NOTE_SPEED = 5;
    static NOTE_START_Y = -20;
    static NOTE_PADDING = 3; // how far each note to be to other
    static NOTE_OFFSET = 0.25; // offset to synchronize with music
    static NOTE_HEIGHT = 25;

    // height of rendered button blocks (like ASDFGHJKL)
    static PLAY_NOTE_HEIGHT = 200;

    // time to get ready (countdown)
    static GET_READY_TIME = 5;

    // note music trigger (note getting to point where music hits)
    static NOTE_MUSIC_TRIGGER = Settings.PLAY_NOTE_HEIGHT;
}
class UserSettings {
    constructor(){
        this.NOTE_SPEED = Settings.NOTE_SPEED;
        this.NOTE_START_Y = Settings.NOTE_START_Y;
        this.NOTE_PADDING = Settings.NOTE_PADDING;
        this.NOTE_OFFSET = Settings.NOTE_OFFSET;
        this.NOTE_HEIGHT = Settings.NOTE_HEIGHT;
        this.PLAY_NOTE_HEIGHT = Settings.PLAY_NOTE_HEIGHT;
        this.GET_READY_TIME = Settings.GET_READY_TIME;
        this.NOTE_MUSIC_TRIGGER = Settings.NOTE_MUSIC_TRIGGER;
        this.COLORS = null;
        this.NOTE_WIDTH = null;
    }
}
class PlayNotes {
	constructor(num){
        this.x_pos = width / 4;
        this.width = width / 2;
        this.height = height;

		this.numberOfNotes = num;
		this.keys = "ASJKL";
		this.keynotes = this.setupKeyNotes(this.numberOfNotes);

        // current notes
        this.settings = new UserSettings();
        this.settings.COLORS = this.generateColors(this.numberOfNotes);
        this.settings.NOTE_MUSIC_TRIGGER = this.height - this.settings.PLAY_NOTE_HEIGHT + this.settings.NOTE_HEIGHT;

        this.noteWidth = this.width / this.numberOfNotes;
        this.notes = [];
        
        // currentTime (the real time OR countdown)
        // -5 - five seconds before start
        this.get_ready_time = this.settings.GET_READY_TIME;

        // music time (howler.seek())
        this.musicTime = 0;

        // last pressed key
        // this.pressed = { is: false, count: 0 };
        this.pressed = { is: false, keys: [] };

        // other
        this.gameStarted = false;
        this.isPlaying = false; // when countdown hits 0
        this.isCountdown = false;

        // game related variables
        this.score = 0;
        this.health = 99;
    }
    getReadyTime(){
        return this.get_ready_time < 0 ? 0 : this.get_ready_time;
    }
    countdown(){
        // COUNTDOWN
        if(this.get_ready_time <= this.settings.NOTE_OFFSET){
            this.isCountdown = false;
            this.gameStarted = true;
        } else {
            this.get_ready_time -= 1 / frameRate();

            textSize(64);
            fill(120, 50, 220);
            textAlign(CENTER, CENTER);
            let readyText = round(this.get_ready_time);
            text(readyText, width / 2, height / 2);
        }
    }
    loadNotes(realNotes){
        this.notes = [];
        for(let note of realNotes){
            let realNote = new Note(note);
            realNote.color = this.settings.COLORS[note.way];
            realNote.width = this.noteWidth;
            this.notes.push(realNote);
        }
    }

    setupKeyNotes(how_many){
        let keynotes = [];
        for(let k = 0; k < how_many; k++){
            // key => character making keyNote react
            // pressed => when pressed (true) or released (false)
            // noted => when pressed on note (true), else (false)
            keynotes.push({ index: k, key: this.keys[k], pressed: false, noted: false });
        }
        return keynotes;
    }
    
    generateColors(how_many){
        let colors = [];
        for(let c = 0; c < how_many; c++){
            colors.push(color(random(255),random(255),random(255)));
        }
        return colors;
    }

	checkKey(k, turnOn){
        k = k.toUpperCase();
        for(let keyNote of this.keynotes){
            if(k == keyNote.key){
                keyNote.pressed = turnOn;
            }
        }
	}

	showControl(){
		for(var i = 0; i < this.numberOfNotes + 1; i++){
			// splitting lines
			let offset = this.x_pos + (this.width / 2) * (i / this.numberOfNotes) * 2;
			line(offset, this.settings.NOTE_START_Y, offset, this.height);

			if(i < this.numberOfNotes){
                let pnh = this.settings.PLAY_NOTE_HEIGHT;

				if(this.keynotes[i].pressed){
                    let cl = this.settings.COLORS[i].levels;
                    let stripeColor = color(cl[0], cl[1], cl[2], 50);
                    fill(stripeColor);
                    rect(offset, 0, this.noteWidth, this.height - pnh);

                    fill(this.settings.COLORS[i]);
                    rect(offset, this.height - pnh, this.noteWidth, pnh);
				} else {
					fill(120);
                    rect(offset, this.height - pnh, this.noteWidth, pnh);
                }
                
                stroke(0);
                fill(255);
                textSize(32);
                textAlign(CENTER, CENTER);
                text(this.keys[i], offset + (this.noteWidth / 2), this.height - (pnh / 2));
			}
        }
    }

    renderMusicTriggerLine(){
        push();
        let x = this.x_pos;
        let y = this.settings.NOTE_MUSIC_TRIGGER;
        fill(255, 120, 50, 100);
        rect(x, y, this.width, -this.settings.NOTE_HEIGHT);
        pop();
    }
    
    removeNote(note){
        this.notes.splice(this.notes.indexOf(note), 1);
    }

    showPlayerInfo(){
        fill(0);
        textSize(24);
        textAlign(LEFT);
        text("Health: " + this.health, 50, 50);
        text("Score: " + this.score, 50, 100);
        this.renderMusicTriggerLine();
    }

    updateNotes(time){
        if(keyIsPressed){
            if(!this.pressed.is){
                this.pressed.is = true;
            }
        } else {
            this.pressed.is = false;
        }

        // let nearest = this.getNearestNoteToBound();
        // nearest.color = color(0, 0, 255);
        // if(this.pressed.is){
        //     // CHECK IF KEY IS PRESSED
        //     // GET NEAREST NOTE TO HEIGHT dist(note.x, note.y, note.x, height) AND HIGHER THEN (height - Settings.PLAY_NOTE_HEIGHT)
        //     // IF NOTE.TYPE (DOUBLE)
        //     // IF PRESSED ON NOTE AND NO NOTE, SUBSTRACT LIFE, DONT ADD SCORE
        //     // IF PRESSED ON WHEN NO NOTE, SUBSTRACT LIFE
        //     // IF PRESSED ON NOTE, ADD SCORE

        //     // -----------------------------------------------------
        //     if(this.isNotePressable(nearest)){
        //         let nearestKey = this.getKeyOfNote(nearest); // { index: k, key: this.keys[k], pressed: false, noted: false }
        //         let pressedKeys = this.getPressedKeyNotes();

        //         // REMOVING NOTE BASED ON PRESSED KEY
        //         if(this.isKeyInArrayKeys(nearestKey, pressedKeys)){
        //             this.removeNote(nearest);
        //             this.score += 25;
        //         }
        //     }
            
        //     this.pressed.is = false;
        //     // -----------------------------------------------------
        // }

        for(let note of this.notes){
            let note_time = note.time;
            let note_way = note.way;
            let maxPadd = this.settings.NOTE_PADDING;

            if(note_time > time && note_time < (time + maxPadd)){
                let noteOffset = this.settings.NOTE_OFFSET;
                let diff = (note_time-noteOffset) - time;
                
                let offset = this.x_pos + (this.width / 2) * (note_way / this.numberOfNotes) * 2;
                note.x = offset;
                note.y = map(diff, maxPadd, 0, -(height / 2) * 4, this.settings.NOTE_MUSIC_TRIGGER);
                note.shown = true;
                if(note.y > 0 && note.y < height){
                    note.show();

                    let y = this.settings.NOTE_MUSIC_TRIGGER;
                    let offset = this.x_pos + (this.width / 2) * (note.way / this.numberOfNotes) * 2;
                    let pnh = this.settings.PLAY_NOTE_HEIGHT;
                    if(note.y < y && note.y > y - this.settings.NOTE_HEIGHT){
                        let cl = this.settings.COLORS[note.way].levels;
                        let stripeColor = color(cl[0], cl[1], cl[2], 220);
                        fill(stripeColor);
                        rect(offset, 0, this.noteWidth, this.height - pnh);
    
                        fill(this.settings.COLORS[note.way]);
                        rect(offset, this.height - pnh, this.noteWidth, pnh);
                    }
                }
            }

            // REMOVING OUT OF BOUND NOTE ... 
            // if(((note_time - time) < 0 && note.shown) || note.y > height){
            //     this.removeNote(note);
            // }
        }
    }
    isKeyInArrayKeys(k, a){
        for(let x of a){
            if(x.index === k.index){
                return true;
            }
        }
        return false;
    }
    getPressedKeyNotes(){
        let pressedKeys = [];
        for(let kn of this.keynotes){
            if(kn.pressed){
                pressedKeys.push(kn);
            }
        }
        return pressedKeys;
    }
    getKeyOfNote(note){
        let keynote = null;
        for(let kn of this.keynotes){
            if(kn.index === note.way){
                keynote = kn;
            }
        }
        return keynote;
    }
    isNotePressable(note){
        return note.y >= (this.height - this.settings.PLAY_NOTE_HEIGHT) && note.y < this.height;
    }
    getNearestNoteToBound(){
        let closest = null;
        let time = this.musicTime;
        for(let note of this.notes){
            let note_time = note.time;
            let note_way = note.way;
            let maxPadd = this.settings.NOTE_PADDING;

            if(note_time > time && note_time < (time + maxPadd)){
                let noteOffset = this.settings.NOTE_OFFSET;
                let diff = (note_time-noteOffset) - time;
                
                let xPos = this.x_pos + (this.width / 2) * (note_way / this.numberOfNotes) * 2;
                note.x = xPos;
                note.y = map(diff, maxPadd, 0, -(height / 2) * 4, this.settings.NOTE_MUSIC_TRIGGER);

                if(!closest){
                    closest = note;
                } else {
                    if(note.y > closest.y){
                        closest = note;
                    }
                }
            }
        }
        closest = closest ? closest : random(this.notes);
        return closest;
    }
}

class Note {
	constructor(note){
        this.start = note.start;
        this.time = note.start;
        this.way = note.way;
        this.type = note.type;

        this.x = 0;
        this.y = Settings.NOTE_START_Y;
        this.width = null;
        this.color = null;
        this.tapped = false;
        this.shown = false;
	}

	show(){
        push();
        noStroke();
        if(this.color){
            fill(this.color);
        } else if(this.type){
            fill(0, 255, 0);
        } else {
            fill(255, 0, 0);
        }
        rect(this.x, this.y, this.width, Settings.NOTE_HEIGHT);
        pop();
	}
}

// BUFFER RELATED OBJECS

class PeakInfo {
    // float, float
    constructor(min, max){
        this.max = max;
        this.min = min;
    }

    Min(value){
        if(value) this.min = value;
        return this.min;
    }

    Max(value){
        if(value) this.max = value;
        return this.max;
    }
}
class PeakProvider {
    constructor(){
        this.buffer = null;
        this.info = null;
    }

    // Load the float[] data
    LoadBuffer(buffer){
        this.buffer = buffer;
    }

    LoadInfo(info){
        this.info = info;
    }

    ReadAt(time=0){
        if(!this.info || !this.buffer) return;
        let sampleRate = this.info.sampleRate;
        let start = sampleRate * time;
        let end = start + sampleRate;
        return this.buffer.slice(start, end);
    }

    Sum(array){
        return array.reduce((a,b) => a + b, 0);
    }

    SumAbs(array){
        return array.reduce((a,b) => Math.abs(a) + Math.abs(b), 0);
    }

    Min(array){
        return Math.min(...array);
    }

    Max(array){
        return Math.max(...array);
    }
}
class MaxPeakProvider extends PeakProvider {
    constructor(){
        super();
    }

    GetPeakAt(time=0){
        var partBuffer = this.ReadAt(time);
        var samplesRead = partBuffer.length;
        var max = (samplesRead == 0) ? 0 : this.Max(partBuffer);
        var min = (samplesRead == 0) ? 0 : this.Min(partBuffer);
        return new PeakInfo(min, max);
    }

    ComputeFor(array){
        var samplesRead = array.length;
        var max = (samplesRead == 0) ? 0 : this.Max(array);
        var min = (samplesRead == 0) ? 0 : this.Min(array);
        return new PeakInfo(min, max);
    }
}
class RmsPeakProvider extends PeakProvider {
    // int
    constructor(blockSize){
        super();
        this.blockSize = blockSize;
    }
    
    GetPeakAt(time=0){
        var partBuffer = this.ReadAt(time);
        var samplesRead = partBuffer.length;

        var max = 0;
        for (let x = 0; x < samplesRead; x += this.blockSize){
            var total = 0;
            for (let y = 0; y < this.blockSize && x + y < samplesRead; y++){
                total += partBuffer[x + y] * partBuffer[x + y];
            }
            var rms = Math.sqrt(total / this.blockSize);

            max = Math.max(max, rms);
        }

        return new PeakInfo(0 - max, max);
    }

    ComputeFor(array){
        var samplesRead = array.length;

        var max = 0;
        for (let x = 0; x < samplesRead; x += this.blockSize){
            var total = 0;
            for (let y = 0; y < this.blockSize && x + y < samplesRead; y++){
                total += array[x + y] * array[x + y];
            }
            var rms = Math.sqrt(total / this.blockSize);

            max = Math.max(max, rms);
        }

        return new PeakInfo(0 - max, max);
    }
}
class AveragePeakProvider extends PeakProvider {
    // float
    constructor(scale){
        super();
        this.scale = scale;
    }

    GetPeakAt(time=0){
        var partBuffer = this.ReadAt(time);
        var samplesRead = partBuffer.length;
        var sum = (samplesRead == 0) ? 0 : this.SumAbs(partBuffer);
        var average = sum / samplesRead;
        return new PeakInfo(average * (0 - this.scale), average * this.scale);
    }

    ComputeFor(array){
        var samplesRead = array.length;
        var sum = (samplesRead == 0) ? 0 : this.SumAbs(array);
        var average = sum / samplesRead;
        return new PeakInfo(average * (0 - this.scale), average * this.scale);
    }

}
class SamplingPeakProvider extends PeakProvider {
    // int
    constructor(sampleInterval){
        super();
        this.sampleInterval = sampleInterval;
    }

    GetPeakAt(time=0){
        var partBuffer = this.ReadAt(time);
        var samplesRead = partBuffer.length;

        var max = 0;
        var min = 0;
        for (let x = 0; x < samplesRead; x += this.sampleInterval)
        {
            max = Math.max(max, partBuffer[x]);
            min = Math.min(min, partBuffer[x]);
        }

        return new PeakInfo(min, max);
    }

    ComputeFor(array){
        var samplesRead = array.length;

        var max = 0;
        var min = 0;
        for (let x = 0; x < samplesRead; x += this.sampleInterval)
        {
            max = Math.max(max, array[x]);
            min = Math.min(min, array[x]);
        }

        return new PeakInfo(min, max);
    }
}
class DecibelPeakProvider {
    constructor(sourceProvider, dynamicRange)
    {
        this.sourceProvider = sourceProvider;
        this.dynamicRange = dynamicRange;
    }

    GetPeakAt(time=0){
        var peak = sourceProvider.GetPeakAt(time);
        var decibelMax = 20 * Math.log10(peak.Max());
        if (decibelMax < 0 - dynamicRange) decibelMax = 0 - dynamicRange;
        var linear = ((dynamicRange + decibelMax) / dynamicRange);
        return new PeakInfo(0 - linear, linear);
    }
}