// some unfinished stuff for deobfuscation maybe???

let a = 0;
let b = 10;
let c = 20;
let d = 30;
let e = 40;
let f = 50;
let g = 100;
let h = 200;
let i = 300;
let j = 400;
let k = 500;
let l = 1000;
let m = 2000;
let n = 3000;
let o = 4000;
let p = 5000;
let q = 10000;
let r = 20000;
let s = 30000;
let t = 40000;
let u = 50000;
let v = 100000;
let w = 200000;
let x = 300000;
let y = 400000;
let z = 500000;
let az = [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z];
let ab = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

function aORb(x, y){
    if(isNaN(x)) return;
    if(isNaN(y)) return;
    if(x < y) return x;
    if(x > y) return y;
    if(x == y) return x + y;
}

function compute(x, y){
    let z = Math.round(Math.pow(y / 10000, x / 10000) - (x * y * 2)); 
    if(z < 0){
        z = 'xyzt';
    }
    return z;
}

function limit(n, x, y){
    if(isNaN(n)) return;
    return Math.min(Math.max(n, x), y);
}

function loop(r=""){
    for(let x = 0; x < az.length; x++){
        for(let y = ab.length - 1; y >= 0; y--){
            let i = limit(x + y, 0, ab.length - 1);
            let a = aORb(y, x);
            r += ab[i] + "" + compute(az[y], az[x]) + "" + aORb(x, y);
        }
    }
    return r;
}

function result(){
    let l = loop();
    for(let i = 0; i <= 9; i++){
        l = l.split(String(i)).join("");
    }
    return l;
}

function count(s, ch){
    let y = 0;
    for(let l of s){
        if(l === ch) y++;
    }
    return y;
}

function clean(){
    let r = result();
    for(let s of "+.z"){
        if(count(r, s) > 0){
            r = r.split(s).join("");
        }
    }
    return r;
}

function final(){
    let c = clean();
    let m = c.length - 1;
    let z = m % 100;
    let f = "";
    for(let i = 0; i < m; i += z){
        f += c.substr(i, 4);
    }
    return f;
}

// MAX X: countFinal(42573, 0)
// MAX Y: countFinal(0, 26608)
function countFinal(x = 0, y = 0){
    let f = final();
    let cf = 0;
    for(let l of f){
        let mz = Math.round(((x + y) * 10) / 2);
        let my = y * 3;
        cf += az[ab.indexOf(l)] - mz - my;
    }

    if(cf < 0){
        return 0;
    }
    return cf;
}