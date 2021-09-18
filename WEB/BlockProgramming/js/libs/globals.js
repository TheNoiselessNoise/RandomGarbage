const ID_EVENT = "event";
const ID_STRING = "string";
const ID_NUMBER = "number";
const ID_FUNCTION = "function";
const VAR_NAME_REGEX = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

function c(tag, attrs={}, callbacks={}){
    let e = document.createElement(tag);

    if(Object.keys(attrs).length) {
        for (let key of Object.keys(attrs)) {
            if (key === "tag" && attrs[key] instanceof HTMLElement) {
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