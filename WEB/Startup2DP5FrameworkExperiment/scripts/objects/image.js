class XImage {
    constructor(path, w=null, h=null, x=null, y=null){
        this.self = loadImage(path);
        this.x = x || round(windowWidth / 2);
        this.y = y || round(windowHeight / 2);
        this.w = w || 64;
        this.h = h || 64;
    }

    setWidth(w){
        this.w = w || this.getOriginalWidth();
    }

    getOriginalWidth(){
        return this.self.width;
    }

    getCurrentWidth(){
        return this.w;
    }

    setHeight(h){
        this.h = h || this.getOriginalHeight();
    }

    getOriginalHeight(){
        return this.self.height;
    }

    getCurrentHeight(){
        return this.h;
    }

    showAtPosition(x, y, useCurrentSize = true){
        if(useCurrentSize){
            image(
                this.self,
                x || this.x,
                y || this.y,
                this.w,
                this.h
            );
        } else {
            image(
                this.self,
                x || this.x,
                y || this.y,
                this.self.width,
                this.self.height
            );
        }
    }

    show(useCurrentSize = true){
        this.showAtPosition(this.x, this.y, useCurrentSize);
    }
}