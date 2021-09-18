class ViewWrapModes {
    static get DESTROY_WRAP(){ // destroys objects if over boundaries of window
        return -1;
    }

    static get NO_WRAP(){ // blocks objects when hits boundaries of window
        return 0;
    }

    static get WRAP(){ // wraps objects to boundaries of windows -> x < 0 => width,...
        return 1;
    }
}