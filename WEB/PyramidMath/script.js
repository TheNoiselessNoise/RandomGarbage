class Pyramid {
	constructor(levels=3, min=1, max=9){
		this.levels = levels;
		this.min = min;
		this.max = max;
		
		this.rows = [];
		this.pyramid = null;
		this.recreate();
	}

	recreate(){
		if(this.pyramid !== null){
			this.pyramid.remove();
		}

		this.pyramid = this.create("py-ramid");

		this.construct();
		this.calculate();
	}
	
	create(el){
		return document.createElement(el);
	}
	
	construct(){
		this.rows = [];
		let base = [];
	
		for(let r = 0; r < this.levels; r++){
			let row = this.create("py-row");
			for(let c = 0; c < this.levels - r; c++){
				let block = this.create("py-block");
				let n = 0;
				if(r === 0){
					n = Math.round(Math.random()*this.max)+this.min;
					base.push(n);
					block.style.background = "wheat";
				}
				block.textContent = n;
				
				block.addEventListener("click", function(){
					if(this.getAttribute("contenteditable") == null){
						this.setAttribute("contenteditable", "true");
					}
				});
				
				block.addEventListener("blur", function(){
					this.removeAttribute("contenteditable");
				});
				
				block.addEventListener("input", function(){	
					for(let l of block.textContent)
						if(!"0123456789".includes(l))
							block.textContent = 0;
							
					this.check();
				}.bind(this));
				
				row.appendChild(block);
			}
			
			if(r === 0) // First row
				this.pyramid.appendChild(row);
			else
				this.pyramid.insertBefore(row, this.pyramid.childNodes[0]);
		}
		
		this.rows.push(base);
	}
	
	calculate(){
		// Until the top row Is just one number
		while(this.rows[this.rows.length - 1].length != 1){
			let last = this.rows[this.rows.length - 1];
			let row = [];
			
			for(let i = 1; i < last.length; i++){
				let n = last[i - 1] + last[i];
				row.push(n);
			}
			
			this.rows.push(row);
		}
	}
	
	check(){
		let finish = true;
	
		let rows = this.pyramid.childNodes;
		for(let r = 0; r < rows.length; r++){
			let blocks = rows[rows.length - r - 1].childNodes;
			for(let b = 0; b < blocks.length; b++){
				let pvalue = blocks[b].textContent;
				let rvalue = this.rows[r][b];
				
				if(pvalue != rvalue)
					finish = false;
			}
		}
		
		if(finish) this.finish();
	}
	
	finish(){
		this.levels++;

		for(let r of this.pyramid.childNodes){
			for(let b of r.childNodes){
				b.style.background = "wheat";
			}
		}
		
		let nextlevel = this.create("py-reset");
		nextlevel.textContent = "Next Level";
		nextlevel.addEventListener("click", function(){
			document.body.innerHTML = "";
			this.recreate();
			document.body.appendChild(this.show());
		}.bind(this));
		this.pyramid.append(nextlevel);
	}
	
	show(){
		return this.pyramid;
	}
}

window.onload = function(){
	document.body.appendChild((new Pyramid(3, 1, 5)).show());
}