class View {
    constructor(id, name, options={}){
        this.id = id;
        this.name = name;
        this.background = color(51, 51, 51); // color of background
        this.objects = []; // all objects in game

        this.getOptions(options);
    }

    getOptions(options){
        if(options["objects"]){
            this.objects = options["objects"];
        }
    }

    removeObject(obj){
        if(!isNaN(obj)){ // is integer, use as index
            this.objects.splice(obj, 1);
        } else { // it is object, use indexOf
            this.objects.splice(this.objects.indexOf(obj), 1);
        }
    }

    addObject(obj){
        this.objects.push(obj);
    }

    objectOutOfBounds(obj){
        if(obj instanceof Circle){

        } else if(obj instanceof Square){

        }
    }

    checkViewWrapMode(mode, obj){
        switch(mode){
            case ViewWrapModes.DESTROY_WRAP:

                break;
            case ViewWrapModes.NO_WRAP:
                break;
            case ViewWrapModes.WRAP:
                break;
            default:
                return;
        }
        return;
    }

    update(){
        background(this.background);
        for(let object of this.objects){
            object.update();
            object.show();
        }
    }
}