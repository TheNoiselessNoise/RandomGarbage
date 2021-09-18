/// <reference path="./p5.global-mode.d.ts" />

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

// ---------------------------------------------------------------------------

// OTHER STUFF

class TestBallLifespan {
    constructor(x=-1,y=-1,r=-1,c=-1,l=-1){
        this.r = r !== -1 ? r : 15;
        this.x = x !== -1 ? x : random(this.r, width - this.r);
        this.y = y !== -1 ? y : random(this.r, height - this.r);
        this.c = c !== -1 ? c : color(random(255), random(255), random(255));
        this.l = l !== -1 ? l : 255;
    }
    update(){ this.show(); this.l--; if(this.l <= 0){ this.remove(); }}
    show(){ fill(this.c); ellipse(this.x, this.y, this.r * 2); }
    remove(){ testBalls.splice(testBalls.indexOf(this), 1); }
}
class TestBall {
    constructor(x=-1,y=-1,r=-1,c=-1,v=-1){
        this.r = r !== -1 ? r : 15;
        this.x = x !== -1 ? x : random(this.r, width - this.r);
        this.y = y !== -1 ? y : random(this.r, height - this.r);
        this.c = c !== -1 ? c : color(random(255), random(255), random(255));
        this.value = v !== -1 ? v : 0.05;
        this.startAnimation = false;
        this.anim_lifespan = 25;
    }
    isOverMe(x){
        return x > this.x;
    }
    changeMe(){
        this.c = color(random(255),random(255),random(255));
        this.startAnimation = true;
    }
    animation(){
        this.x += this.x * 0.15;
        this.y += this.y * 0.15;
        this.anim_lifespan -= 2;

        this.r *= (abs(this.value) + 1) * 0.75;

        if(this.anim_lifespan <= 0){
            this.remove();
        }
    }
    update(){ if(this.startAnimation){ this.animation(); } this.show(); }
    show(){
        if(this.startAnimation){
            strokeWeight(16);

            let alpha = map(this.anim_lifespan, 0, 25, 0, 255);
            let cr = this.c.levels;
            let newColor = color(cr[0], cr[1], cr[2], alpha);
            fill(newColor);
            ellipse(this.x, this.y, this.r * 2);
        }
        else {
            fill(this.c);
            ellipse(this.x, this.y, this.r * 2);
        }
    }
    remove(){ testBalls.splice(testBalls.indexOf(this), 1); }
}