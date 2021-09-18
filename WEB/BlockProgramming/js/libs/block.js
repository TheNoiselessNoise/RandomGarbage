class BlockRow {
    constructor(){
        this.e = c("div", { class: "row" });
        this.blocks = [];
    }

    reset(){
        this.e.innerHTML = "";
    }

    render(){
        for(let b of this.blocks){
            this.e.append(b.render());
        }
    }
}

class Block {
    constructor(){
        this.id = null;
        this.value = null;
        this.start = {
            text: null,
            attrs: []
        };
        this.inner1 = [];
        this.middle = null;
        this.inner2 = [];
        this.end = true;
    }

    render(){
        let div_block = c("div", {
            class: "block",
            "data-id": this.id
        });

        if(this.value){
            div_block.setAttribute("data-value", this.value);
        }

        let start_block = c("div", {
            class: "start-block",
            tag: c("span", {
                class: "block-text",
                text: this.start.text
            })
        });

        if(this.start.attrs instanceof Array && this.start.attrs.length){
            let attrs = [];
            for(let a of this.start.attrs){
                attrs.push(a.render());
            }
            let attrs_block = c("div", {
                class: "attrs",
                tags: attrs
            });
            start_block.appendChild(attrs_block);
        }

        div_block.append(start_block);
        let inner1 = c("div", { class: "inner-blocks" });
        div_block.append(inner1);

        if(this.middle !== null){
            let middle_block = c("div", {
                class: "middle-block",
                tag: c("span", {
                    class: "block-text",
                    text: this.middle.text
                })
            });

            if(this.middle.attrs instanceof Array && this.middle.attr.length){
                let attrs = [];
                for(let a of this.middle.attrs){
                    attrs.push(a.render());
                }
                let attrs_block = c("div", {
                    class: "attrs",
                    tags: attrs
                });
                middle_block.appendChild(attrs_block);
            }

            div_block.append(middle_block);
            let inner2 = c("div", { class: "inner-blocks" });
            div_block.append(inner2);
        }

        if(this.end){
            let end_block = c("div", { class: "end-block" });
            div_block.append(end_block);
        }

        return div_block;
    }
}

class EventBlock extends Block {
    constructor(text="on page load", value="window.onload"){
        super();
        this.id = "event";
        this.value = value;
        this.start.text = text;
    }
}

class IfBlock extends Block {
    constructor(){
        super();
        this.id = "if";
        this.value = null;
        this.start.text = "if";
        this.start.attrs = [
            new BooleanAttribute()
        ];
    }
}

class IfElseBlock extends Block {
    constructor(){
        super();
        this.id = "if-else";
        this.value = null;
        this.start.text = "if";
        this.start.attrs = [
            new BooleanAttribute()
        ];
        this.middle = {
            text: "else"
        };
    }
}