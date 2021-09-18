/// <reference path="./p5.global-mode.d.ts" />

class LIVEMUSIC {
    constructor(path) {
        this.path = path;
        this.request = new XMLHttpRequest();

        // context variables
        this.buffer = null;
        this.bufferData = null; // all data from all channels [channel 0 => Float32Array()]
        this.isBuffered = false;

        this.filteredBuffer = null; // low-pass filtered
        this.filteredBufferData = null; // all data from all channels [channel 0 => Float32Array()]
        this.isFilteredBuffered = false;

        this.howl = new Howl({
            src: [this.path]
        });

        this.node = this.howl._sounds[0]._node;
        this.context = this.node.context;

        // data
        this.input1 = null;
        this.input2 = null;
        this.output1 = null;

        // oncreate functions
        this.loadBuffer();

        this.notes = null;
        this.notesAvg = [];
        this.overallAvg = 0;
        // template: {time: 1.23,type: "NEED_TO_DEFINE"},
        this.realNotes = [];
    }
    loadBuffer(){
        this.request.open("GET", this.path, true);
        this.request.responseType = "arraybuffer";

        var _this = this;
        this.request.onload = function(){
            _this.context.decodeAudioData(_this.request.response, function(buffer){
                _this.buffer = buffer;
                _this.bufferData = _this.getFullData();
                _this.isBuffered = true;
                console.log("-- BUFFERED --");
                _this.lowPassBuffer();

                // MaxPeakProvider();
                // RmsPeakProvider(200);
                // SamplingPeakProvider(200); 
                // AveragePeakProvider(4);
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
            });
        };

        this.request.send();
    }
    lowPassBuffer(){
        var offlineContext = new OfflineAudioContext(1, this.buffer.length, this.buffer.sampleRate);
        var source = offlineContext.createBufferSource();
        source.buffer = this.buffer;
        var filter = offlineContext.createBiquadFilter();
        filter.type = "lowpass";
        source.connect(filter);
        filter.connect(offlineContext.destination);
        source.start(0);
        offlineContext.startRendering();

        var _this = this;
        offlineContext.oncomplete = function(e) {
            var filteredBuffer = e.renderedBuffer;
            _this.filteredBuffer = filteredBuffer;
            _this.filteredBufferData = _this.getFullData(filteredBuffer);
            _this.isFilteredBuffered = true;
            _this.c("BUFFER LOW-PASSed");
            // _this.noteManager = new NoteManager();
            // _this.noteManager.loadBuffer(_this.buffer);
            _this.notes = _this.getDataToNotes();

            // GETTING AVERAGE VALUE FROM _this.getDataToNotes()
            // (sampleRate/100) values for 1 millisecond
            for(let s = 0; s < _this.notes.length; s++){
                _this.notesAvg[s] = [];
                for(let ms = 0; ms < _this.notes[s].length; ms++){
                    let current = _this.notes[s][ms];
                    _this.notesAvg[s][ms] = abs(current.reduce((a,b)=>a+b,0));
                }
            }

            // GETTING OVERALL AVERAGE NUMBER
            let realNumbers = 0;
            let sum = 0;
            for(let s = 0; s < _this.notesAvg.length; s++){
                for(let ms = 0; ms < _this.notesAvg[s].length; ms++){
                    realNumbers++;
                    sum += _this.notesAvg[s][ms];
                }
            }
            _this.overallAvg = round(sum / realNumbers);

            if(_this.overallAvg < 25){
                _this.overallAvg = 25;
            }

            // GENERATING REAL NOTES #2
            let notePadd = 15; // the lower the faster
            let lastPadd = 0;
            let currentImag = -1; // -1 or 1, does not matter
            let currentImagCount = 0;
            for(let s = 0; s < _this.notesAvg.length; s++){
                for(let ms = 0; ms < _this.notesAvg[s].length; ms++){
                    let currentArray = _this.notes[s][ms];

                    let maxPeak = _this.maxPeakProvider.ComputeFor(currentArray);
                    let rmsPeak = _this.rmsPeakProvider.ComputeFor(currentArray);
                    let samPeak = _this.samPeakProvider.ComputeFor(currentArray);
                    let avgPeak = _this.avgPeakProvider.ComputeFor(currentArray);

                    notePadd = map((samPeak.max+rmsPeak.max)/2, 0, 1, _this.overallAvg, 0);
                    // notePadd = map((avgPeak.max-maxPeak.max+rmsPeak.max-samPeak.max)/2, 0, 1, _this.overallAvg, 0);
                    // notePadd = map((avgPeak.max-maxPeak.max+rmsPeak.max-samPeak.max)/(maxPeak.min), 0, 1, _this.overallAvg, 0);

                    let mostOf = _this.inArrayMostOf(currentArray);
                    if(mostOf == currentImag){
                        currentImag = mostOf;
                        currentImagCount = 0;
                    } else {
                        currentImagCount++;
                    }

                    let current_time = round(s + (ms / 100), 2);
                    if(
                        lastPadd >= notePadd && 
                        currentImagCount < lastPadd &&
                        (
                            // maxPeak.max != 0 &&
                            // rmsPeak.max != 0 &&
                            samPeak.max != 0 &&
                            // avgPeak.max != 0 &&
                            maxPeak.max < avgPeak.max
                        )
                    ){
                        let noteWay = round(random(1, 4));
                        _this.realNotes.push({ 
                            start: current_time, 
                            time: current_time, 
                            way: round(noteWay) 
                        });

                        if(round(rmsPeak.max, 2) === round(samPeak.max, 2)){
                            let nextWay = abs(round(random(1, 4)) - noteWay) + 1; 
                            _this.realNotes.push({ 
                                start: current_time, 
                                time: current_time, 
                                way: round(nextWay) 
                            });
                        }
                        lastPadd = 0;
                    } else {
                        lastPadd++;
                    }
                }
            }
            _this.c("NOTES GENERATEd");
            _this.play();

            // GENERATING REAL NOTES
            // from _this.notesAvg
            // let notePadd = 15; // the lower the faster
            // let lastPadd = 0;
            // for(let s = 0; s < _this.notesAvg.length; s++){
            //     for(let ms = 0; ms < _this.notesAvg[s].length; ms++){
            //         lastPadd++;
            //         let current = _this.notesAvg[s][ms];

            //         if(current){
            //             let current_time = round(s + (ms / 100), 2);

            //             if(lastPadd >= notePadd && current > (_this.overallAvg - notePadd)){
            //                 let noteWay = round(random(1, 4));
            //                 _this.realNotes.push({ time: current_time, way: noteWay });
            //                 lastPadd = 0;
            //             }
            //         }
            //     }
            // }
        };
    }
    addTimeToNotes(seconds=0, setSeek=false){
        for(let note of this.realNotes){
            note.time += seconds;
        }
        if(setSeek){ this.seek(seconds); }
    }
    subTimeToNotes(seconds=0, setSeek=false){
        for(let note of this.realNotes){
            note.time -= seconds;
        }
        if(setSeek){ this.seek(seconds); }
    }
    setTimeToNotes(seconds=0, setSeek=false){
        for(let note of this.realNotes){
            let note_time = (note.time * 100);
            note.time = round((note_time - seconds) / 100, 2);
        }
        if(setSeek){ this.seek(seconds); }
    }
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
        // let data = this.filteredBufferData[0].data;
        let sampleRate = this.buffer.sampleRate;
        let start = sampleRate * time;
        let end = start + sampleRate;
        return data.slice(start, end);
    }
    getDataToNotes(){
        let notes = [];
        let rate = this.filteredBuffer.sampleRate;
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
    // used to get filtered minimals and maximals
    getData(time=0, channel=0, bufferSize=2048, buffer=this.buffer){
        let data = new Float32Array(bufferSize);
        buffer.copyFromChannel(data, channel, buffer.sampleRate * time);
        return data;
    }
    getTempo(fr=-2, to=2, buffer=this.buffer){
        let channelData = this.getFullData(buffer)[0].data;
        let peaks = this.getPeaksAtThreshold(channelData, fr, to);
        let intervals = this.countIntervalsBetweenNearbyPeaks(peaks);
        let groupedNeighbors = this.groupNeighborsByTempo(intervals);
        let groupedTempos = this.groupTempos(groupedNeighbors);
        return this.getMostFrequentTempo(groupedTempos);
    }
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
    userInput(){
        // mouse click + Q change currentTime
        if(keyIsDown(81) && mouseIsPressed){
            let newTime = map(mouseX, 0, width, 0, this.duration());
            this.howl.seek(newTime);
            this.setTimeToNotes(newTime / 10);
        }
    }
    NEW_STUFF(){
        // maxPeak => weird
        // rmsPeak => maybe useful
        // samPeak => on lsd
        // avgPeak => for sure useful
        // let avgPeak = this.avgPeakProvider.GetPeakAt(current);
    }
    renderMusicTest(){
        // SHOW NOTES BASED ON CURRENT TIME (this.seek())
        let ct = round(this.seek(), 2);
        for(let note of this.realNotes){
            let note_time = note.time;
            let note_way = note.way;
            let maxPadd = 5;

            if(note_time > ct && note_time < (ct + maxPadd)){
                let diff = note_time - ct;
                let note_pos_x = width / 16 * note_way;
                let note_pos_y = map(diff, maxPadd, 0, -(height/2)*4, height / 2);
                if(note_pos_y > 0 && note_pos_y < height / 2){
                    fill(255, 0, 0);
                    ellipse(note_pos_x, note_pos_y, 15);
                }
            }
        }


        /*
        let currentTime = round(this.seek(), 2);
        let currentMiliSecond = round((currentTime-floor(currentTime)) * 100); // 0.85 => 85, 24.12 => 12
        let currentSecond = round(currentTime);
        
        let subKeys = Object.keys(this.notes);
        if(!subKeys.includes(String(currentSecond))){
            return;
        }

        let currentNote = this.notes[currentSecond];
        let currentNotes = currentNote[currentMiliSecond];

        let rw = width / currentNotes.length;
        for(let i = 0; i < currentNotes.length; i++){
            let val = currentNotes[i];
            let rx = rw * i;

            let mapped = map(val, -1, 1, -255, 255);
            rect(rx, height / 2, rw, -mapped);
        }

        let peakForNotes = this.maxPeakProvider.ComputeFor(currentNotes);
        stroke(0);
        fill(255);
        text("Min: " + peakForNotes.min, width / 2, height / 4);
        text("Max: " + peakForNotes.max, width / 2, height / 3.5);
        */
    }
    render(){
        music.renderMusicTest();

        let currentTime = this.seek();
        let duration = this.duration();
        
        // line accross the height
        let lineX = width / round(duration) * currentTime;
        strokeWeight(1);
        stroke(255, 0, 0);
        rect(lineX, 0, 1, height);

        // line accross the width
        stroke(255);
        strokeWeight(5);
        line(0, height / 2, width, height / 2);

        noStroke();
        textSize(42);
        fill(255);

        let formattedTime = this.formatTime(currentTime, true, true, 2);
        text(round(lineX) + "[" + formattedTime + "]", lineX + 25, height - 25);
    }
    formatTime(seconds, secs=true, mins=true, roundSecs=0){
        let realSeconds = 0;
        let realMinutes = 0;
        while(seconds >= 60){
            realMinutes++;
            seconds -= 60;
        }
        realSeconds = roundSecs ? round(seconds, roundSecs) : round(seconds);

        if(mins && secs){
            return realMinutes + ":" + realSeconds;
        } else if(mins){
            return realMinutes + " min.";
        } else if(secs){
            return realSeconds + " secs.";
        }
        return false;
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

    getPeaksAtThreshold(data, fr=0.5, to=1) {
        var peaksArray = [];
        var length = data.length;
        for(var i = 0; i < length;) {
            if (fr <= data[i] && data[i] <= to) {
                peaksArray.push(i);
                // Skip forward ~ 1/4s to get past this peak.
                i += 12000;
            }
            i++;
        }
        return peaksArray;
    }
    countIntervalsBetweenNearbyPeaks(peaks) {
        var intervalCounts = [];
        peaks.forEach(function(peak, index) {
            for(var i = 0; i < 10; i++) {
                var interval = peaks[index + i] - peak;
                var foundInterval = intervalCounts.some(function(intervalCount) {
                    if (intervalCount.interval === interval)
                        return intervalCount.count++;
                });
                if (!foundInterval) {
                    intervalCounts.push({
                        interval: interval,
                        count: 1
                    });
                }
            }
        });
        intervalCounts = intervalCounts.filter(function(p){
            if(!isNaN(p.interval) && p.interval)
                return p;
        });
        return intervalCounts;
    }
    groupNeighborsByTempo(intervalCounts) {
        var tempoCounts = [];
        intervalCounts.forEach(function(intervalCount, i) {
            // Convert an interval to tempo
            var theoreticalTempo = 60 / (intervalCount.interval / 48000 );
    
            // Adjust the tempo to fit within the 90-180 BPM range
            while (theoreticalTempo < 90) theoreticalTempo *= 2;
            while (theoreticalTempo > 180) theoreticalTempo /= 2;
    
            var foundTempo = tempoCounts.some(function(tempoCount) {
                if (tempoCount.tempo === theoreticalTempo)
                    return tempoCount.count += intervalCount.count;
            });
            if (!foundTempo) {
                tempoCounts.push({
                    tempo: round(theoreticalTempo),
                    count: intervalCount.count
                });
            }
        });
        return tempoCounts;
    }
    groupTempos(neighbors){    
        let groupedTempos = [];
        for(let neighbor of neighbors){
            var foundTempo = false;
    
            for(let tempo of groupedTempos){
                if (tempo.tempo === neighbor.tempo){
                    tempo.count += neighbor.count;
                    foundTempo = true;
                }
            }
    
            if (!foundTempo) {
                groupedTempos.push({
                    tempo: neighbor.tempo,
                    count: neighbor.count
                });
            }
        }
        return groupedTempos;
    }
    getMostFrequentTempo(tempos){
        let current = {tempo: 0, count: 0};
        for(let tempo of tempos){
            if(tempo.count > current.count){
                current = tempo;
            }
        }
        return current;
    }
}