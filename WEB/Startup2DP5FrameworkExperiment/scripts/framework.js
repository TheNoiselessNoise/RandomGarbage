class Framework {
    constructor() {
        this.canvas = null;
        this.keys = {}; // loaded keyboards keys to use
        this.mouse = new InputMouse(); // mouse input
        this.images = {}; // loaded images to use

        this.views = {};
        this.currentViewId = null;
    }

    /*
    Sets current view id
     */
    setCurrentViewId(id){
        this.currentViewId = id;
    }

    getCurrentView(){
        return this.currentViewId ? this.views[this.currentViewId] : null;
    }

    /*
    Gets view by id
     */
    getViewById(id){
        if(Object.keys(this.views).includes(id)){
            return this.views[id];
        }
    }

    /*
    Gets view/s by name
     */
    getViewsByName(name){
        let views = [];
        for(let vk of Object.keys(this.views)){
            if(name === this.views[vk].name){
                views.push(this.views[vk]);
            }
        }
        return views;
    }

    /*
    Gets last initialized view
     */
    getLastView(){
        let key = Object.keys(this.views).splice(-1, 1);
        return this.views[key];
    }

    createView(id, name, options={}){
        this.views[id] = new View(id, name, options);
    }

    createCanvas(w = null, h = null){
        this.canvas = createCanvas(w || windowWidth, h || windowHeight);
    }

    setBackground(background) {
        this.background = background;
    }

    update(){
        this.mouse.update();

        if(this.currentViewId){
            this.views[this.currentViewId].update();
        }
    }

    /*
    Keys to check if pressed
     */
    isKeyPressed(k){
        k = k.toUpperCase();
        if(Object.keys(this.keys).includes(k)){
            return this.keys[k].isPressed();
        }
        return false;
    }

    /*
    Keys separated by space to check if are pressed
     */
    keysArePressed(ks){
        let keysAre = true;
        for(let k of ks.split(" ")){
            if(!Object.keys(this.keys).includes(k)){
                keysAre = false;
            } else {
                keysAre = this.keys[k].isPressed();
            }

            if(!keysAre){
                return false;
            }
        }
        return true;
    }

    /*
    Initialize keyboards keys to use
    @param string  -  space separated keys to use
     */
    loadKeys(keys){
        this.keys = {};

        let usedKeys = [];
        for(let k of keys.split(" ")){
            k = k.toUpperCase();

            if(!usedKeys.includes(k)) {
                usedKeys.push(k);
                this.keys[k] = new InputKey(k);
            }
        }
    }

    /*
    Loads images
    - then you can reference them with this.images[IMAGE_NAME]
     */
    loadImages(images){
        this.images = {};

        for(let imageKey of Object.keys(images)){
            if(images[imageKey] instanceof XImage){
                this.images[imageKey] = images[imageKey];
            }
        }
    }

    getImageByName(name){
        name = name.toUpperCase();
        if(Object.keys(this.images).includes(name)){
            return this.images[name];
        }
        return null;
    }

    showImage(name){
        let image = this.getImageByName(name);
        if(image){
            image.show();
        }
    }
}