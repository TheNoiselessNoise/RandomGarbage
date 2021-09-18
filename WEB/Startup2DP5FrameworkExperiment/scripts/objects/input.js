class InputKey {
    constructor(k){
        this.text = k;
        this.charCode = this.text.charCodeAt(0);
    }

    /*
    Gets character representation as text
     */
    getKey(){
        return this.text;
    }

    /*
    Gets character representation as ASCII code
     */
    getChar(){
        return this.charCode;
    }

    isPressed(){
        return keyIsDown(this.charCode);
    }
}

class InputMouse {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.pressed = false;
    }

    /*
    Gets x position of mouse
     */
    getX(){
        return this.x;
    }

    /*
    Gets y position of mouse
     */
    getY(){
        return this.y;
    }

    /*
    Gets pressed event of mouse
     */
    isPressed(){
        return this.pressed;
    }

    /*
    Updates mouse event
     */
    update(){
        this.x = mouseX;
        this.y = mouseY;
        this.pressed = mouseIsPressed;
    }
}