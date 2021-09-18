// START-XYZT-MAIN
var _X = {
    ALPHA: {
        // 97-122
        LOWER: "abcdefghijklmnopqrstuvwxyz",
        // 65-90
        UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        // 48-57
        NUMERIC: "0123456789",
        // 32-47,58-64,91-96,123-126
        SPECIAL: " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    },
    CONSTS: {
        COLOR_SELECT: "__X_COLOR_SELECT",
        COLOR_OPTION: "__X_COLOR_OPTION"
    },
    COLORS: {AliceBlue: '#F0F8FF',AntiqueWhite: '#FAEBD7',Aqua: '#00FFFF',Aquamarine: '#7FFFD4',Azure: '#F0FFFF',Beige: '#F5F5DC',Bisque: '#FFE4C4',Black: '#000000',BlanchedAlmond: '#FFEBCD',Blue: '#0000FF',BlueViolet: '#8A2BE2',Brown: '#A52A2A',BurlyWood: '#DEB887',CadetBlue: '#5F9EA0',Chartreuse: '#7FFF00',Chocolate: '#D2691E',Coral: '#FF7F50',CornflowerBlue: '#6495ED',Cornsilk: '#FFF8DC',Crimson: '#DC143C',Cyan: '#00FFFF',DarkBlue: '#00008B',DarkCyan: '#008B8B',DarkGoldenRod: '#B8860B',DarkGray: '#A9A9A9',DarkGrey: '#A9A9A9',DarkGreen: '#006400',DarkKhaki: '#BDB76B',DarkMagenta: '#8B008B',DarkOliveGreen: '#556B2F',DarkOrange: '#FF8C00',DarkOrchid: '#9932CC',DarkRed: '#8B0000',DarkSalmon: '#E9967A',DarkSeaGreen: '#8FBC8F',DarkSlateBlue: '#483D8B',DarkSlateGray: '#2F4F4F',DarkSlateGrey: '#2F4F4F',DarkTurquoise: '#00CED1',DarkViolet: '#9400D3',DeepPink: '#FF1493',DeepSkyBlue: '#00BFFF',DimGray: '#696969',DimGrey: '#696969',DodgerBlue: '#1E90FF',FireBrick: '#B22222',FloralWhite: '#FFFAF0',ForestGreen: '#228B22',Fuchsia: '#FF00FF',Gainsboro: '#DCDCDC',GhostWhite: '#F8F8FF',Gold: '#FFD700',GoldenRod: '#DAA520',Gray: '#808080',Grey: '#808080',Green: '#008000',GreenYellow: '#ADFF2F',HoneyDew: '#F0FFF0',HotPink: '#FF69B4',IndianRed : '#CD5C5C',Indigo  : '#4B0082',Ivory: '#FFFFF0',Khaki: '#F0E68C',Lavender: '#E6E6FA',LavenderBlush: '#FFF0F5',LawnGreen: '#7CFC00',LemonChiffon: '#FFFACD',LightBlue: '#ADD8E6',LightCoral: '#F08080',LightCyan: '#E0FFFF',LightGoldenRodYellow: '#FAFAD2',LightGray: '#D3D3D3',LightGrey: '#D3D3D3',LightGreen: '#90EE90',LightPink: '#FFB6C1',LightSalmon: '#FFA07A',LightSeaGreen: '#20B2AA',LightSkyBlue: '#87CEFA',LightSlateGray: '#778899',LightSlateGrey: '#778899',LightSteelBlue: '#B0C4DE',LightYellow: '#FFFFE0',Lime: '#00FF00',LimeGreen: '#32CD32',Linen: '#FAF0E6',Magenta: '#FF00FF',Maroon: '#800000',MediumAquaMarine: '#66CDAA',MediumBlue: '#0000CD',MediumOrchid: '#BA55D3',MediumPurple: '#9370DB',MediumSeaGreen: '#3CB371',MediumSlateBlue: '#7B68EE',MediumSpringGreen: '#00FA9A',MediumTurquoise: '#48D1CC',MediumVioletRed: '#C71585',MidnightBlue: '#191970',MintCream: '#F5FFFA',MistyRose: '#FFE4E1',Moccasin: '#FFE4B5',NavajoWhite: '#FFDEAD',Navy: '#000080',OldLace: '#FDF5E6',Olive: '#808000',OliveDrab: '#6B8E23',Orange: '#FFA500',OrangeRed: '#FF4500',Orchid: '#DA70D6',PaleGoldenRod: '#EEE8AA',PaleGreen: '#98FB98',PaleTurquoise: '#AFEEEE',PaleVioletRed: '#DB7093',PapayaWhip: '#FFEFD5',PeachPuff: '#FFDAB9',Peru: '#CD853F',Pink: '#FFC0CB',Plum: '#DDA0DD',PowderBlue: '#B0E0E6',Purple: '#800080',RebeccaPurple: '#663399',Red: '#FF0000',RosyBrown: '#BC8F8F',RoyalBlue: '#4169E1',SaddleBrown: '#8B4513',Salmon: '#FA8072',SandyBrown: '#F4A460',SeaGreen: '#2E8B57',SeaShell: '#FFF5EE',Sienna: '#A0522D',Silver: '#C0C0C0',SkyBlue: '#87CEEB',SlateBlue: '#6A5ACD',SlateGray: '#708090',SlateGrey: '#708090',Snow: '#FFFAFA',SpringGreen: '#00FF7F',SteelBlue: '#4682B4',Tan: '#D2B48C',Teal: '#008080',Thistle: '#D8BFD8',Tomato: '#FF6347',Turquoise: '#40E0D0',Violet: '#EE82EE',Wheat: '#F5DEB3',White: '#FFFFFF',WhiteSmoke: '#F5F5F5',Yellow: '#FFFF00',YellowGreen: '#9ACD32'},
    _is: function(x, y){
        if(y instanceof Object){
            return x instanceof y;
        }
        return typeof x === y;
    },
    str: function(x, ch=true){
        return ch ? this._is(x, "string") : String(x);
    },
    fun: function(x){
        return this._is(x, "string");
    },
    arr: function(x){
        return Array.isArray(x);
    },
    cre: function(tag, attrs={}, callbacks={}){
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
    },
    sel: function(query){
        return document.querySelectorAll(query);
    },
    app: function(e_or_selector, a){
        let e = null;
        let f = null;

        if(this.arr(e_or_selector) || this._is(e_or_selector, NodeList)) {
            e = e_or_selector;
        } else if(this.str(e_or_selector)){
            e = this.sel(e_or_selector);
        } else if(this._is(e_or_selector, HTMLElement)){
            e = [e_or_selector];
        }

        if(this.arr(a) || this._is(a, NodeList)) {
            f = a;
        } else if(this.str(a)){
            f = this.sel(a);
        } else if(this._is(a, HTMLElement)){
            f = [a];
        }

        for(let x of e){
            for(let y of f){
                if(this._is(x, HTMLElement) && this._is(y, HTMLElement)){
                    x.append(y);
                }
            }
        }
    },
    evt: function(e_or_selector, type, fn){
        let e = null;

        if(this.arr(e_or_selector) || this._is(e_or_selector, NodeList)) {
            e = e_or_selector;
        } else if(this.str(e_or_selector)){
            e = this.sel(e_or_selector);
        } else if(this._is(e_or_selector, HTMLElement) || this._is(e_or_selector, Object)){
            e = [e_or_selector];
        }

        for(let x of e){
            if(this._is(x, Object) || (this._is(x, HTMLElement)) && this._is(fn, Function)){
                x.addEventListener(type, fn);
            }
        }
    },
    ran: function(min=0, max=1, rounded = false){
        let rand = (Math.random() * max) + min;
        return rounded ? Math.round(rand) : rand;
    },
    // gen: function(content_or_prefix = "", length = )
    send: {
        GET: function(url, callback){
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url);
            xhr.send();

            xhr.onload = function() {
                if (xhr.status !== 200) { // analyze HTTP status of the response
                    alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
                } else { // show the result
                    if(callback instanceof Function){
                        callback(xhr.response);
                    }
                }
            };

            xhr.onerror = function() {
                alert("Request failed");
            };
        }
    },
    nav: {
        simple: function(items){
            let links = [];

            if(this.arr(items)){
                links = items;
            } else if(this._is(items, Object)){
                for(let x of Object.keys(this.nav.items)){
                    let item = this.nav.items[x];

                    if(this._is(item, HTMLElement)){
                        links.push(item);
                    } else {
                        links.push(this.cre("a", { href: item, text: x }));
                    }
                }
            }

            return this.cre("nav", { tags: links });
        }
    },
    colorSel: function(callback, showNames = false, showBackground = true, addEmptyOption = true, container = document.body){
        let options_arr = [];

        if(addEmptyOption){
            options_arr.push(this.cre("option", { class: this.CONSTS.COLOR_OPTION, value: "", text: "--------" }));
        }

        for(let name of Object.keys(this.COLORS)){
            let option = this.cre("option", {
                class: this.CONSTS.COLOR_OPTION,
                value: this.COLORS[name],
                html: showNames ? name : "&nbsp;".repeat(32),
                style: showBackground ? "background: " + this.COLORS[name] : ""
            });
            options_arr.push(option);
        }

        let select = this.cre("select", {
            class: this.CONSTS.COLOR_SELECT,
            tags: options_arr
        });

        if(callback instanceof Function){
            select.addEventListener("change", callback);
        }

        container.append(select);
    }
};
// END-XYZT-MAIN

// var _STRING_X = {
//     insert: function(ch, i){
//         if(ch && i > -1){
//             return this.substring(0, i) + ch + this.substring(i, this.length);
//         }
//         return this;
//     }
// };



// START-XYZT-START
if(window["_X"] === undefined){
    window["_X"] = _X;
}

// if(String.prototype["_X"] === undefined){
//     String.prototype["_X"] = _STRING_X;
// }
// END-XYZT-START