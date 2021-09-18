class Attribute {
    constructor(what = null, text = null){
        this.what = null;
        this.text = null;
        this.hint = null;
    }

    render(){
        let e = c("div", {
            class: "attr",
            "data-what": this.what
        });

        if(this.hint){
            e.append(c("sup", {
                class: "attr-text",
                text: this.hint
            }));
        }

        return e;
    }
}

class BooleanAttribute extends Attribute {
    constructor() {
        super();
        this.what = "boolean";
    }

}

class NumberAttribute extends Attribute {
    constructor() {
        super();
        this.what = "number";
    }

}

class StringAttribute extends Attribute {
    constructor() {
        super();
        this.what = "string";
    }

}

class TextAttribute extends Attribute {
    constructor(text) {
        super(null, text);
    }
}