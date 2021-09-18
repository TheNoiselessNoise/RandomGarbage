class BackgroundType {
    static get RECT(){return 0;}
    static get ELLIPSE(){return 1;}
    static get LINES(){return 2;}
    static get RANDOM(){return 3;}
}

class BackgroundObject {
    constructor(t, x, y, w, h, c, s){
        this.type = t;
        this.w = w ? w : random(50, 150);
        this.h = h ? h : this.w;
        this.pos = new p5.Vector(
            round(random(this.w, width - this.w)),
            round(random(this.h, height - this.h))
        );
        this.acc = new p5.Vector(
            round(random(-s, s)),
            round(random(-s, s))
        );
        this.c = c ? c : color(220, 220, 220, 150);
    }

    update(){
        this.pos.add(this.acc);

        if(this.type === BackgroundType.LINES){
            if(this.pos.x < 0 || this.pos.x > width - this.w){ this.acc.x *= -1; }
            if(this.pos.y < 0 || this.pos.y > height - this.h){ this.acc.y *= -1; }
        } else {
            let tmpW = int(this.w / 2);
            let tmpH = int(this.h / 2);

            if(this.pos.x < tmpW || this.pos.x > width - tmpW){ this.acc.x *= -1; }
            if(this.pos.y < tmpH || this.pos.y > height - tmpH){ this.acc.y *= -1; }
        }
    }
}

class BackgroundRect extends BackgroundObject {
    constructor(t, x, y, w, h, c, speed=5){
        super(t, x, y, w, h, c, speed);
    }

    show(){
        fill(this.c);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
}

class BackgroundEllipse extends BackgroundObject {
    constructor(t, x, y, w, h, c, speed=5){
        super(t, x, y, w, h, c, speed);
    }

    show(){
        fill(this.c);
        ellipse(this.pos.x, this.pos.y, this.w, this.h);
    }
}

class BackgroundLine extends BackgroundObject {
    constructor(t, x, y, w, h, c, speed=5){
        super(t, x, y, w, h, c, speed);
        this.w = w ? w : random(0, 150);
        this.h = h ? h : random(0, 150);
        this.pos = new p5.Vector(
            round(random(this.w, width - this.w)),
            round(random(this.h, height - this.h))
        );
    }

    show(){
        // push();
        // stroke(255);
        // strokeWeight(3);
        // line(
        //     this.pos.x,
        //     this.pos.y,
        //     this.pos.x + this.w,
        //     this.pos.y + this.h
        // );
        // pop();
    }
}

class BackgroundBinType {
    static get BASIC_TO_LOWER(){return 0;}
    static get BASIC_TO_UPPER(){return 1;}
    static get LOWER_AND_UPPER(){return 2;}
    static get DOUBLE(){return 3;}
    static get FULLSCREEN(){return 4;}
}

class Background {
    constructor(type=BackgroundType.LINES, count=random(0, 10)){
        this.type = type;
        this.count = count;
        this.objects = [];
        this.showBins = {
            show: true,
            color: [220, 220, 220]
        };

        // song visual
        this.songDuration = round(sound.duration());
        this.currentDuration = this.getCurrentDuration();
        this.songPart = round(width / this.songDuration);
        this.currentPart = 0;

        for(let i = 0; i < this.count; i++){
            switch(this.type){
                case BackgroundType.RECT:
                    this.objects.push(new BackgroundRect(this.type));
                    break;
                case BackgroundType.ELLIPSE:
                    this.objects.push(new BackgroundEllipse(this.type));
                    break;
                case BackgroundType.LINES:
                    this.objects.push(new BackgroundLine(this.type));
                    break;
                case BackgroundType.RANDOM:
                    let r = Math.random();
                    if(r < 0.33){
                        this.objects.push(new BackgroundRect(this.type));
                    } else if(r < 0.66){
                        this.objects.push(new BackgroundEllipse(this.type));
                    } else {
                        this.objects.push(new BackgroundLine(this.type));
                    }
                    break;
            }
        }
    }

    getCurrentDuration(){
        let tmpDuration = this.songDuration;
        let duration = {
            h: 0,
            m: 0,
            s: 0
        };

        while(tmpDuration > 0){
            if(tmpDuration >= 3600){
                tmpDuration -= 3600;
                duration.h++;
            } else if(tmpDuration >= 60){
                tmpDuration -= 60;
                duration.m++;
            } else {
                duration.s = tmpDuration;
                tmpDuration = 0;
            }
        }

        return duration;
    }

    updateBinColor(avg){
        let newColor = getRandomColor(avg, avg, avg);
        let ac = newColor.levels;
        this.showBins.color = [ac[0], ac[1], ac[2]];
    }

    update(bins){
        if(frameCount % 60 === 0 && sound.isPlaying() && this.currentDuration.s > 0){
            this.currentPart++;
            this.currentDuration.s--;

            if(this.currentDuration.s < 0){
                this.currentDuration.s = 59;

                if(this.currentDuration.m > 0){
                    this.currentDuration.m--;
                }
            }

            if(this.currentDuration.m < 0){
                this.currentDuration.m = 0;

                if(this.currentDuration.h > 0){
                    this.currentDuration.h--;
                }
            }
        }

        // for(let obj of this.objects){
        //     switch(this.type) {
        //         case BackgroundType.RECT || BackgroundType.ELLIPSE:
        //             let avg = getAverageFromBins(bins);
        //             let randW = map(avg, 0, 255, 10, 150);
        //             let randH = map(avg, 0, 255, 10, 150);
        //             obj.w = round(randW);
        //             obj.h = round(randH);
        //             break;
        //         case BackgroundType.LINES:
        //             let oIndex = this.objects.indexOf(obj);
        
        //             if (oIndex !== this.objects.length - 1 && oIndex % 2 === 0) {
        //                 let next = this.objects[oIndex + 1];

        //                 push();
        //                 stroke(0);
        //                 strokeWeight(1);
        //                 // line from line1 x,y to line2 x,y
        //                 line(obj.pos.x, obj.pos.y, next.pos.x, next.pos.y);
        //                 // line from line2 x+w,h+y to line2 x+w,y+h
        //                 line(
        //                     obj.pos.x + obj.w,
        //                     obj.pos.y + obj.h,
        //                     next.pos.x + next.w,
        //                     next.pos.y + next.h
        //                 );
        //                 pop();

        //                 push();
        //                 fill(color(
        //                     this.showBins.color[0],
        //                     this.showBins.color[1],
        //                     this.showBins.color[2],
        //                     50
        //                 ));
        //                 beginShape();
        //                 vertex(obj.pos.x, obj.pos.y);
        //                 vertex(next.pos.x, next.pos.y);
        //                 vertex(next.pos.x + next.w, next.pos.y + next.h);
        //                 vertex(obj.pos.x + obj.w, obj.pos.y + obj.h);
        //                 endShape(CLOSE);
        //                 pop();
        //             }
        //             break;
        //     }
        //     obj.update();
        // }
        this.show(bins);

        // show music duration
        fill(255);
        rect(width / 2, height, this.songPart * this.currentPart, 50);
        fill(0);
        textSize(12);
        text(this.getMusicTime(), width / 2 - 20, height - 8);
    }

    getMusicTime(){
        return Object.values(backEnvironment.currentDuration)
            .map((item) => item < 10 ? String("0"+item) : String(item)).join(":");
    }

    show(bins){
        if(this.showBins.show){
            let notZeroBins = bins.splice(0, 85);
            notZeroBins = notZeroBins.filter(x => x !== 0);

            let binWidth = round(width / notZeroBins.length);

            for(let b = 0; b < notZeroBins.length; b++){
                push();
                let alpha = map(notZeroBins[b], 0, 255, 0, 255);
                fill(color(
                    this.showBins.color[0],
                    this.showBins.color[1],
                    this.showBins.color[2],
                    alpha
                ));
                stroke(0);
                strokeWeight(1);

                let mh = map(notZeroBins[b], 0, 255, 3, height - notZeroBins[b]);
                rect(
                    binWidth * b + round(binWidth / 2),
                    round(height / 2),
                    binWidth,
                    mh
                );
                pop();
            }
        }

        for(let obj of this.objects){
            obj.show();
        }
    }
}