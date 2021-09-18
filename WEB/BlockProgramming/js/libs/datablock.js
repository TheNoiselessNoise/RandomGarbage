class DataBlock {
    constructor(){
        this.id = null;
        this.type = null;
        this.attrs = null;
    }
}

class FunctionBlock extends Block {
    constructor() {
        super();
        this.id = ID_FUNCTION;
        this.value = null;
    }

}

class AlertBlock extends FunctionBlock {
    constructor(){
        super();
        this.value = "alert";
    }
}

class PromptBlock extends FunctionBlock {
    constructor(){
        super();
        this.value = "prompt";
    }
}