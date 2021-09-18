class XYZT {
    constructor(){
        this.host = window.location.host;
        this.DEV = this.host === "localhost" || "127.0.0.1" === this.host;
        this.BIN_PAD = 3;
        this.BIN_BOR = false;
        this.POTATO_PC = true;

        // fft related properties
        this.FFT_BINS_DEFAULTS = [64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384];
        this.FFT_BINS_DEF = 6;
        this.FFT_SLICE_FROM = 0;
        this.FFT_SLICE_TO = 55;
        this.FFT_SMOOTH_DEF = 0.90;

        // effects related properties
        this.RGB_R_DEFAULT = 150;
        this.RGB_G_DEFAULT = 109;
        this.RGB_B_DEFAULT = 120;
        this.BEAT_DETECT_DEFAULT = 100;

        this.RGB_R = this.RGB_R_DEFAULT;
        this.RGB_G = this.RGB_G_DEFAULT;
        this.RGB_B = this.RGB_B_DEFAULT;
        this.RGB = [this.RGB_R, null, this.RGB_B];
        this.RGB_V = 1;
        this.RGB_FRAMES_CHANGED = 0;
        this.BEAT_DETECT = this.BEAT_DETECT_DEFAULT;

        // inputs
        this.isRotated = false;
        this.isDoubled = false;
        this.isBacked = true;
        this.I_LIKE_THESE_COLORS = false;

        // functional properties
        this.lastPlayedNamed = null;
        this.music = false;
        this.isLoading = false;
        this.fft = new p5.FFT(
            this.FFT_SMOOTH_DEF, 
            this.FFT_BINS_DEFAULTS[this.FFT_BINS_DEF]
        );
        this.amp = new p5.Amplitude();
        this.bins = [];

        this.canUpdateDuration = false;
        this.musicDuration = 0;
        this.currentDuration = 0;
    }

    updateFFT(s=this.FFT_SMOOTH_DEF, b=this.FFT_BINS_DEFAULTS[this.FFT_BINS_DEF]){
        this.fft = new p5.FFT(s, b);
    }

    getFileName(path, len=42, suffix="..."){
        if(path.includes("/")){
            path = path.split("/").reverse()[0];
        }

        path = path.split(".")[0];
        
        if(path.length > len){
            path = path.slice(0, len - 1) + " " + suffix;
        }

        return path;
    }

    loadMusic(src=null, random=false){
        this.RGB_R = this.RGB_R_DEFAULT;
        this.RGB_B = this.RGB_B_DEFAULT;
        this.RGB_FRAMES_CHANGED = 0;
        this.BEAT_DETECT = this.BEAT_DETECT_DEFAULT;
    
        this.isLoading = true;
        this.currentDuration = 0;
        this.canUpdateDuration = false;

        if(this.playing()){
            this.stop();
        }

        src = this.decodeHtml(src);

        if(random){
            return $.get("index.php?_rm=1", function(d){
                this.loadMusic(d, false);
            }.bind(this));
        }

        let _this = this;

        $("span#song_name").html("Loading");
        console.log("loading: " + src);

        this.music = new p5.SoundFile(src, function(){
            _this.isLoading = false;
            _this.canUpdateDuration = true;
            _this.musicDuration = _this.music.duration();

            _this.amp.connect(_this.music);
            _this.music.play();

            let a = "<a target='_blank' href='https://www.youtube.com/channel/UCvSMLAQ8-6Fmj68haqD_J2Q' id='songlink'>MISERY</a>";
            let sn = _this.getFileName(src) + "<br>by [ " + a + " ]";
            $("span#song_name").html(sn);
        }, function(){
            return false;
        }, function(p){
            let mp = round(map(p, 0, 1, 0, 100));
            $("span#song_name").html(mp + " %");
        });
    }
    
    getAmpLevel(from, to){
        if(from && to){
            return map(this.amp.getLevel(), 0, 1, from, to);
        }
        return this.amp.getLevel();
    }

    update(){
        if(this.canUpdateDuration){
            this.currentDuration = this.music.currentTime();
        }

        if(this.DEV){
            textSize(32);
            fill(255);
            text(this.durationFormat(this.musicDuration), 50, 50);
            text(this.durationFormat(this.currentDuration), 50, 100);
        }

        // if(this.currentDuration + .1 >= this.musicDuration){
        //     this.loadMusic(null, true);
        // }
    }

    beatDetect(){
        if(this.I_LIKE_THESE_COLORS){
            return;
        }
        
        let filtered = this.bins.filter(function(v){ return v; });
        let sum = filtered.reduce(function(a, b){ return a + b; }, 0);
        sum /= filtered.length;

        if((sum-5) > this.BEAT_DETECT){
            this.BEAT_DETECT = sum-3;
        }

        if(sum >= (this.BEAT_DETECT-5) && this.RGB_FRAMES_CHANGED === 0){
            this.RGB_FRAMES_CHANGED = 60;
            background(52);

            this.RGB_R = random(0, 255);
            this.RGB_G = random(0, 255);
            this.RGB_B = random(0, 255);

            if(this.rand(0.5)){
                if(this.rand(0.5)){
                    let tmp = this.RGB_R;
                    this.RGB_R = this.RGB_B;
                    this.RGB_B = tmp;
                } else {
                    let tmp = this.RGB_G;
                    this.RGB_G = this.RGB_B;
                    this.RGB_B = tmp;
                }
            } else {
                let tmp = this.RGB_B;
                this.RGB_B = this.RGB_R;
                this.RGB_R = tmp;
            }

            let o = this.rand(0.5);
            let p = this.rand(0.5);
            let k = this.rand(0.5);
            let l = this.rand(0.5);
            let m = this.rand(0.5);

            if(o){
                if(p){
                    this.RGB = [this.RGB_R, this.RGB_G, this.RGB_B];
                } else {
                    this.RGB = [this.RGB_G, this.RGB_B, this.RGB_R];
                }
            } else if (k){
                this.RGB = [this.RGB_B, this.RGB_R, this.RGB_G];
            } else {
                if(l){
                    if(m){
                        this.RGB = [this.RGB_R, this.RGB_B, this.RGB_G];
                    } else {
                        this.RGB = [this.RGB_G, this.RGB_R, this.RGB_B];
                    }
                } else {
                    this.RGB = [this.RGB_B, this.RGB_G, this.RGB_R];
                }
            }

            this.RGB_V = round(random(0, 2));

            let q = this.RGB;
            q[this.RGB_V] = this.getAmpLevel(0, 255);

            $("nav, section, div#song_control").css({
                "border-left": "1vw solid rgb("+q[0]+","+q[1]+","+q[2]+")",
                "border-right": "1vw solid rgb("+q[0]+","+q[1]+","+q[2]+")"
            });

            $("nav h1, section h1, section h3").css({
                "background": "rgb("+q[0]+","+q[1]+","+q[2]+")",
            });

            $("#songlink").css("color", GLOBAL_COLOR);
        }

        if(this.RGB_FRAMES_CHANGED > 0){
            this.RGB_FRAMES_CHANGED--;
        }
    }

    renderBins(){
        if(this.doubled()){
            this.drawBinsWithinArea(this.bins,
                0, 0, width, 0,
                width, height / 2 + 100, 0, height / 2 + 100, 
                this.rotated(), true
            );

            this.drawBinsWithinArea(this.bins,
                0 , height / 2 - 100, width, height / 2 - 100,
                width, height, 0, height, 
                this.rotated(), true
            );
        } else {
            this.drawBinsWithinArea(this.bins,
                0, 0, width, 0,
                width, height, 0, height, 
                this.rotated(), true
            );
        }
    }

    updateBins(){
        let tf = this.FFT_SLICE_FROM;
        let tt = this.FFT_SLICE_TO;
        if(tf > tt){
            let temp = tf;
            tf = tt;
            tt = temp;
        }

        let bins = this.fft.analyze();
        this.bins = bins.slice(tf, tt).filter(function(v){ return v; });
    }

    rotated(){
        return this.isRotated;
    }

    doubled(){
        return this.isDoubled;
    }

    loading(){
        return this.isLoading;
    }

    playing(){
        if(this.music){
            return this.music.isPlaying();
        }
        return false;
    }

    play(){
        this.music.play();
    }

    stop(){
        this.music.stop();
    }

    decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    rand(val, lessthan=true){
        if(lessthan){
            return Math.random() < val;
        }
        return Math.random() > val;
    }

    durationFormat(d){
        let dm = 0;
        let ds = 0;
        let dms;
    
        while(d >= 60) { dm++; d -= 60; }
        while(d >= 1) { ds++; d -= 1; }
        dms = abs(float(d.toFixed(3)));
        dms = str(dms).split(".")[1];
    
        dm = dm < 10 ? "0" + dm : dm;
        ds = ds < 10 ? "0" + ds : ds;
    
        if(dms !== undefined){
            return dm + ":" + ds + "." + dms;
        }
        return dm + ":" + ds;
    }

    clamp(w, m){
        if(w > m){
            return m;
        }
        return w;
    }

    drawBinsWithinArea(bins, ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4, rotated=false, mirrored=false){
        // let nr = norm(rgb_r + b, 0, 255);
        // let nb = norm(rgb_b - b,  0, 255);
        // fill(nr, bins[b], nb);
        
        let w = abs(ax2 - ax4);
        let h = abs(ay2 - ay4);

        for(let b = 0; b < bins.length; b++){
            let rgb_v = map(bins[b], 0, 255, 25, 230);

            let q = this.RGB;
            q[this.RGB_V] = rgb_v;

            let alpha = this.getAmpLevel() * 1.75;
            alpha = this.clamp(alpha, 1);
            alpha = map(alpha, 0, 1, 0, 255);

            let balpha = this.getAmpLevel(0, 255);
            balpha = map(balpha, 0, 255, 222, 75);

            q.push(alpha);

            fill(color(q[0], q[1], q[2], q[3]));

            if(this.BIN_BOR){
                strokeWeight(1);
                stroke(balpha);
            } else {
                noStroke();
            }

            let pad = this.BIN_PAD;

            if(rotated){
                let bW = h / bins.length;
                let bX = ay1 + bW * b + (bW / 2);
                let bY = ax1 + w / 2;
                let bH = map(bins[b], 0, 255, 10, w);
    
                // bH = map(bH, 0, bH, 0, bH / 1.2);
                rect(bY, bX, bH, bW);

                if(!this.POTATO_PC){
                    fill(color(q[0], q[1], q[2], balpha + 30));

                    // AT TOP (dev)
                    

                    // WITHIN AREA
                    rect(bY, bX - bW / pad, bH, -bW / pad);
                    rect(bY, bX + bW / pad, bH, bW / pad);
                }

                if(mirrored){
                    let bX2 = h - bX;
                    fill(color(q[0], q[1], q[2], q[3]));
                    rect(bY, bX2, bH, bW);

                    if(!this.POTATO_PC){
                        fill(color(q[0], q[1], q[2], balpha + 30));
                        rect(bY, bX2 - bW / pad, bH, -bW / pad);
                        rect(bY, bX2 + bW / pad, bH, bW / pad);
                    }
                }
            } else {
                let bW = w / bins.length;
                let bX = ax1 + (bW * b) + (bW / 2);
                let bY = ay1 + h / 2;
                let bH = map(bins[b], 0, 255, 10, h);
    
                rect(bX, bY, bW, bH);

                if(!this.POTATO_PC){
                    fill(color(q[0], q[1], q[2], balpha + 30));
                    rect(bX, bY - bH / pad, bW, -bH / pad);
                    rect(bX, bY + bH / pad, bW, bH / pad);
                }
            
                if(mirrored){
                    let bX2 = ax1 + w - bX;
                    fill(color(q[0], q[1], q[2], q[3]));
                    rect(bX2, bY, bW, bH);
                    
                    if(!this.POTATO_PC){
                        fill(color(q[0], q[1], q[2], balpha + 30));
                        rect(bX2, bY - bH / pad, bW, -bH / pad);
                        rect(bX2, bY + bH / pad, bW, bH / pad);
                    }
                }
            }
        }
    }
}