NodeList.prototype.indexOf = function(x){
    let index = 0;
    for(let y of this){
        if(y === x){
            return index;
        }

        index++;
    }

    return -1;
};

NodeList.prototype.filter = function(x){
    let y = [];
    for(let z of this){
        if(z instanceof x){
            y.push(z);
        }
    }

    return y;
};

function get_date(){
    let d = new Date();
    return [
        d.getDate(),
        d.getMonth() + 1,
        d.getFullYear()
    ].map(x => x < 9 ? "0" + x : String(x));
}

function get_time(){
    let d = new Date();
    return [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ].map(x => x < 9 ? "0" + x : String(x));
}

function c(tag, attrs={}, callbacks={}){
    let e = document.createElement(tag);

    if(Object.keys(attrs).length) {
        for (let key of Object.keys(attrs)) {
            if (key === "tag") {
                e.appendChild(attrs[key]);
            } else if (key === "tags" && attrs[key] instanceof Array) {
                for (let x of attrs[key]) {
                    if(x instanceof HTMLElement){
                        e.appendChild(x);
                    } else if(typeof x === "string") {
                        e.appendChild(new Text(x));
                    }
                }
            } else if (key === "text" || key === "textContent") {
                e.textContent = attrs[key];
            } else if (key === "class" || key === "className") {
                e.className = attrs[key];
            } else if (key === "html" || key === "innerHTML") {
                e.innerHTML = attrs[key];
            } else {
                e.setAttribute(key, attrs[key]);
            }
        }
    }

    if(Object.keys(callbacks).length) {
        for (let key of Object.keys(callbacks)) {
            e.addEventListener(key, callbacks[key]);
        }
    }

    return e;
}

function s(selector, one=true){
    if(one){
        return document.querySelector(selector);
    }
    return document.querySelectorAll(selector);
}

function EW(s){
    return new ElementWrapper(s);
}

class ElementWrapper {
    constructor(e){
        if(e instanceof HTMLElement){
            this.e = e;            
        } else {
            this.e = s(e);
        }
    }

    height(h=null){
        if(h === null){
            return this.e.offsetHeight;
        }

        this.e.style.height = h + "px";
    }

    html(h=null){
        if(h === null){
            return this.e.innerHTML;
        }

        this.e.innerHTML = h;
    }

    append(a=null){
        if(a !== null){
            if(a instanceof HTMLElement){
                this.e.append(a);
            }

            if(a instanceof ElementWrapper){
                this.e.append(a.e);
            }
        }
    }
}