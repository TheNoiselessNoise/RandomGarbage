/// <reference path="./p5.global-mode.d.ts" />

class LIVEMUSIC {
    constructor(path) {
        this.path = path;
        this.request = new XMLHttpRequest();

        // context variables
        this.buffer = null;
        this.bufferData = null; // all data from all channels [channel 0 => Float32Array()]
        this.buffered = false;

        // howl related variables
        this.howl = new Howl({
            src: [this.path]
        });
        this.node = this.howl._sounds[0]._node;
        this.context = this.node.context;

        // peak providers
        this.maxPeakProvider = null;
        this.rmsPeakProvider = null;
        this.samPeakProvider = null;
        this.avgPeakProvider = null;

        // ----------------------------------------
        // play your music setup variables
        this.sampledBuffer = null; // (sampleRate/100) values for 1 millisecond
        this.sampledBufferAvg = []; // average on every sampledBuffer[second][millisecond]
        this.overallAvg = 0; // overall average value from whole sampledBuffer

        // play your music variables
        this.realNotes = []; // data of notes
        this.playNotes = new PlayNotes(5);
        this.readyKey = {name: "ENTER", key: 13}; // when ready, on ENTER press, starts game
        this.gameStarted = false;
        // ----------------------------------------

        // oncreate functions
        this.loadBuffer();
    }
    loadBuffer(){
        this.request.open("GET", this.path, true);
        this.request.responseType = "arraybuffer";

        var _this = this;
        this.request.onload = function(){
            _this.context.decodeAudioData(_this.request.response, function(buffer){
                _this.buffer = buffer;
                _this.bufferData = _this.getFullData();
                console.log("-- BUFFERED --");

                // load peak providers
                let buff = _this.getFullDataFromChannel(0);
                let info = {
                    sampleRate: _this.buffer.sampleRate,
                    duration: _this.buffer.duration
                };

                _this.maxPeakProvider = new MaxPeakProvider();
                _this.maxPeakProvider.LoadBuffer(buff);
                _this.maxPeakProvider.LoadInfo(info);
                _this.rmsPeakProvider = new RmsPeakProvider(200);
                _this.rmsPeakProvider.LoadBuffer(buff);
                _this.rmsPeakProvider.LoadInfo(info);
                _this.samPeakProvider = new SamplingPeakProvider(200);
                _this.samPeakProvider.LoadBuffer(buff);
                _this.samPeakProvider.LoadInfo(info);
                _this.avgPeakProvider = new AveragePeakProvider(4);
                _this.avgPeakProvider.LoadBuffer(buff);
                _this.avgPeakProvider.LoadInfo(info);

                // generate notes based on this.buffer
                _this.generateNotes();
            });
        };

        this.request.send();
    }
    generateNotes(){
        this.sampledBuffer = this.getDataToNotes();

        // GETTING AVERAGE VALUE FROM this.getDataToNotes()
        for(let s = 0; s < this.sampledBuffer.length; s++){
            this.sampledBufferAvg[s] = [];
            for(let ms = 0; ms < this.sampledBuffer[s].length; ms++){
                let current = this.sampledBuffer[s][ms];
                this.sampledBufferAvg[s][ms] = abs(current.reduce((a,b)=>a+b,0));
            }
        }

        // GETTING OVERALL AVERAGE NUMBER
        let realNumbers = 0;
        let sum = 0;
        for(let s = 0; s < this.sampledBufferAvg.length; s++){
            for(let ms = 0; ms < this.sampledBufferAvg[s].length; ms++){
                realNumbers++;
                sum += this.sampledBufferAvg[s][ms];
            }
        }
        this.overallAvg = round(sum / realNumbers);

        if(this.overallAvg < 25){
            this.overallAvg = 25;
        }

        // GENERATING REAL NOTES #2
        let notePadd = 12; // the lower the faster
        let lastPadd = 0;
        let currentImag = -1; // -1 or 1, does not matter
        let currentImagCount = 0;
        for(let s = 0; s < this.sampledBufferAvg.length; s++){
            for(let ms = 0; ms < this.sampledBufferAvg[s].length; ms++){
                let currentArray = this.sampledBuffer[s][ms];

                let maxPeak = this.maxPeakProvider.ComputeFor(currentArray);
                let rmsPeak = this.rmsPeakProvider.ComputeFor(currentArray);
                let samPeak = this.samPeakProvider.ComputeFor(currentArray);
                let avgPeak = this.avgPeakProvider.ComputeFor(currentArray);

                notePadd = map((samPeak.max+rmsPeak.max)/(maxPeak.max), 2, 0, 8, this.overallAvg);

                let mostOf = this.inArrayMostOf(currentArray);
                if(mostOf != currentImag){
                    currentImag = mostOf;
                    currentImagCount = 0;
                } else {
                    currentImagCount++;
                }

                let current_time = round(s + (ms / 100), 2);
                if(
                    lastPadd >= notePadd && 
                    currentImagCount <= lastPadd &&
                    (
                        maxPeak.max != 0 &&
                        rmsPeak.max != 0 &&
                        samPeak.max != 0 &&
                        avgPeak.max != 0
                    )
                ){
                    let noteWay = round(random(0, 4));
                    if(round(rmsPeak.max, 2) === round(samPeak.max, 2)){
                        this.realNotes.push({ 
                            start: current_time, 
                            time: current_time, 
                            way: round(noteWay),
                            type: true
                        });
                        
                        let nextWay = abs(4 - (noteWay+1)) + 1; 
                        this.realNotes.push({ 
                            start: current_time, 
                            time: current_time, 
                            way: round(nextWay),
                            type: true
                        });
                    } else {
                        this.realNotes.push({ 
                            start: current_time, 
                            time: current_time, 
                            way: round(noteWay),
                            type: false
                        });
                    }

                    lastPadd = 0;
                } else {
                    lastPadd++;
                }
            }
        }
        this.playNotes.loadNotes(this.realNotes);
        this.buffered = true;
        this.c("NOTES GENERATEd");
    }
    updatePlayNotes(){
        let currentTime = round(this.seek(), 2) + -this.playNotes.getReadyTime();
        this.playNotes.showControl();
        this.playNotes.updateNotes(currentTime);
        this.playNotes.showPlayerInfo();
    }
    update(){
        this.playNotes.musicTime = this.seek();

        if(this.gameStarted){
            if(!this.playNotes.gameStarted){
                this.playNotes.isCountdown = true;
                this.playNotes.countdown();
            }

            if(this.playNotes.gameStarted && !this.playNotes.isPlaying){
                this.playNotes.isPlaying = true;
                this.play();
            }
        }

        if((this.isBuffered() && this.isPlaying()) || this.isCountdown() || this.node.paused){
            this.updatePlayNotes();
        }

		this.render();
    }
    userInput(){
        if(this.isBuffered() && !this.gameStarted){
            if(keyIsDown(this.readyKey.key)){
                this.gameStarted = true;
            }
        }
    }
    // render methods
    showReady(){
        textSize(32);
        textAlign(CENTER, CENTER);
        let readyText = "Press ["+this.readyKey.name+"] when ready";
        text(readyText, width / 2, height / 2);
    }
    showLoading(){
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Loading ...", width / 2, height / 2);
    }
    render(){
        // let ct = round(this.seek(), 2);
        // for(let note of this.realNotes){
        //     let note_time = note.time;
        //     let note_way = note.way;
        //     let maxPadd = 5;

        //     if(note_time > ct && note_time < (ct + maxPadd)){
        //         let diff = note_time - ct;
        //         let note_pos_x = width / 16 * note_way;
        //         let note_pos_y = map(diff, maxPadd, 0, -(height/2)*4, height);
        //         if(note_pos_y > 0 && note_pos_y < height){
        //             fill(255, 0, 0);
        //             ellipse(note_pos_x, note_pos_y, 15);
        //         }
        //     }
        // }
    }
    // howler methods and simple methods
    isBuffered(){
        return this.buffered;
    }
    isPlaying(){
        return this.howl.playing();
    }
    duration(){
        return this.howl.duration();
    }
    seek(x){
        return this.howl.seek(x);
    }
    pause(){
        this.howl.pause();
    }
    play(){
        this.howl.play();
    }
    stop(){
        this.howl.stop();
    }
    // other methods
    c(w=null,t=null,j=null){
        if(w !== null && t === null){
            console.log("-- " + w + " --");
        } else if(j !== null){
            console.log(w + j + t);
        } else {
            console.log("--- " + w + " ---");
            console.log(t);
        }
    }
    // other MAIN methods
    inArrayMostOf(array){
        let minCount = 0;
        let maxCount = 0;
        for(let i = 0; i < array.length; i++){
            if(array[i] < 0) minCount++;
            if(array[i] > 0) maxCount++;
        }
        return minCount > maxCount ? -1 : 1;
    }
    getDataByTime(time=0){
        let data = this.bufferData[0].data;
        let sampleRate = this.buffer.sampleRate;
        let start = sampleRate * time;
        let end = start + sampleRate;
        return data.slice(start, end);
    }
    getDataToNotes(){
        let notes = [];
        let rate = this.buffer.sampleRate;
        let ratePart = rate / 100;
        for(let s = 0; s < round(this.duration()); s++){
            let sdata = this.getDataByTime(s); // Float32Array(48000)
            let noteSecond = [];

            for(let x = 0; x <= 99; x++){ // 480 for each 0.01
                let start = x * ratePart;
                let end = start + ratePart;
                noteSecond[x] = sdata.slice(start, end);
            }
            notes[s] = noteSecond;
        }

        return notes;
    }
    getFullData(buffer=this.buffer){
        let fulldata = [];
        let bufferLength = round(buffer.sampleRate * buffer.duration);
        let data = new Float32Array(bufferLength);

        for(let channel = 0; channel < buffer.numberOfChannels; channel++){
            buffer.copyFromChannel(data, channel, 0);
            fulldata.push({ channel: channel, data: data });
        }

        return fulldata;
    }
    getFullDataFromChannel(channel=0, buffer=this.buffer){
        let data = new Float32Array(buffer.length);
        buffer.copyFromChannel(data, channel, 0);
        return data;
    }
    // PLAYNOTES related methods
    isCountdown(){
        return this.playNotes.isCountdown;
    }
}