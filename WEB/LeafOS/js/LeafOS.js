class Interval {
	constructor(id, time, func=null){
		this.id = id;
		this.time = time; // milliseconds
		this.func = func;
		this.interval = null;
		this.beDestroyed = false;
	}

	destroy(){
		this.beDestroyed = true;
	}
}

class LeafOS {
	constructor(container){
		this.container = container;
		this.computer = null;
		this.desktop = null;
		this.taskbar = null;

		this.intervals = [];
		this.global_time = 0; // milliseconds
		this.os_time = null;
	}

	boot(){
		let _this = this;

		let boot_progress = c("progress", {
			min: 0, max: 100, value: 0
		});
		let boot_display = c("boot-display", {
			class: "middle-middle",
			tags: [
				c("img", { src: LEAF_OS_128 }),
				c("br"),
				"LeafOS",
				c("br"),
				boot_progress
			]
		});
		let overlay_display = this.overlay(boot_display, true);

		this.createInterval("boot", 1000, function(){
			let rand = Math.round(Math.random() * 25);
			let bv = boot_progress.value;
			let bp = bv + rand;
			let bm = boot_progress.max;

			if(bv === bm){
				this.destroy();
				_this.createInterval("boot_fadeout", 200, function(){
					if (!overlay_display.style.opacity) {
			            overlay_display.style.opacity = 1;
			        }
			        if (overlay_display.style.opacity > 0) {
			            overlay_display.style.opacity -= 0.1;
			        } else {
			        	overlay_display.remove();
			        	_this.init();
			            this.destroy();
			        }
				});
			}

			if(bp >= bm){
				boot_progress.value = bm;
			} else {
				boot_progress.value = bp;
			}
		});

		this.container.append(overlay_display);
	}

	createInterval(id, time, func){
		this.intervals.push(new Interval(id, time, func));
	}

	overlay(e, ret=false){
		let overlay_display = c("over-lay", { tag: e });

		if(ret) {
			return overlay_display;
		}

		this.container.append(overlay_display);
	}

	check_interval(i){
		return this.global_time % i.time === 0 && i.func instanceof Function;
	}

	init(){
	 	if(this.desktop === null){
	 		this.desktop = EW(c("desk-top", { style: "backgroundImage: url(" + LEAF_OS_128 + ")" }));
	 	}

	 	if(this.os_time === null){
	 		this.os_time = EW(c("span", { class: "os_time" }));
	 	}

	 	if(this.taskbar === null){
	 		this.taskbar = EW(c("task-bar", {
	 			tags: [
	 				c("img", { src: LEAF_OS_128 }),
	 				this.os_time.e
	 			]
	 		}));
	 	}

	 	this.computer = EW(c("comp-uter"));
	 	this.computer.append(this.desktop);
	 	this.computer.append(this.taskbar);
	 	this.container.append(this.computer.e);
	}

	update_comp_positions(){
	    let wH = window.innerHeight;
	    let tH = this.taskbar.height();
	    this.desktop.height(wH - tH);
	}

	update(){
		this.global_time += 100;

		for(let i = 0; i < this.intervals.length; i++){
			let interval = this.intervals[i];

			if(this.check_interval(interval)){
				if(interval.beDestroyed){
					console.log("destroyed " + interval.id);
					this.intervals.splice(i, 1);
				} else {
					interval.func();
				}
			}
		}

		// update time
		if(this.os_time){
			let time = get_time().join(":");
			let date = get_date().join(".");
			this.os_time.html(time + "<br>" + date);
		}
		

		if(this.computer){
			// update offsets
			this.update_comp_positions();
		}
		
	}
}