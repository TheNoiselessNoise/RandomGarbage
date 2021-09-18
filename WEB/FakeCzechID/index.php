<!DOCTYPE html>
<html>
<head>
	<title></title>
	<style type="text/css">
		* {
			padding: 0;
			margin: 0;
		}

		#wrapper .row {
			display: flex;
		}

		#wrapper .row .col {
			flex: 1 1 1em;
            margin: 3vh 0 0 0;
		}

		#wrapper .row .col.nsg {
			flex-shrink: 0;
			flex-grow: 0;
			align-self: flex-end;
		}

		#wrapper .row .col div.cx {
			text-align: center;
			padding: 3vh 0 0 0;
		}

        .controls {
            text-align: center;
        }

		.controls label {
			display: block;
			width: 100%;
		}

		canvas {
			display: block;
			border: 1px solid #000;
		}

	</style>
	<script type="text/javascript" src="jquery.min.js"></script>
	<script type="text/javascript" src="p5.js"></script>
	<script type="text/javascript">
		let canvas;
		let points = [];
		let w = 200;
		let h = 75;
		let back = 52;
		function setup(){
			canvas = createCanvas(w, h);

			$(".nsg.col .cx")[0].appendChild(canvas.elt);
			generate_front();
		}

		function draw(){
			if(mouseX > 0 && mouseX < w && mouseY > 0 && mouseY < h){
				if(frameCount % 1 == 0 && mouseIsPressed){
					points.push(new p5.Vector(mouseX, mouseY));
				}
			}

			noFill();
			stroke(0);
			strokeWeight(1);
			beginShape();
			for(let p of points){
				vertex(p.x, p.y);
			}
			endShape();
			smooth();
		}

		function generate_front(){
			$.post("export.php", {
				is_front: 1,
                get_front: 1,
				name: $("#name").val(),
				surname: $("#surname").val(),
				sex: $("#sex").val(),
				dob: $("#dob").val(),
				pob: $("#pob").val(),
				doi: $("#doi").val(),
				doe: $("#doe").val(),
                perm_stay: $("#perm_stay").val(),
                sig: canvas.elt.toDataURL().split(",")[1],
			}, function(src){
				$("#front").attr("src", "data:image/png;base64," + src);
			});

			generate_back();
		}

		function generate_back(){
            $.post("export.php", {
                is_front: 1,
                is_back: 1,
                get_back: 1,
                name: $("#name").val(),
                surname: $("#surname").val(),
                sex: $("#sex").val(),
                dob: $("#dob").val(),
                pob: $("#pob").val(),
                doi: $("#doi").val(),
                doe: $("#doe").val(),
                perm_stay: $("#perm_stay").val(),
                sig: canvas.elt.toDataURL().split(",")[1]
            }, function(src){
                $("#back").attr("src", "data:image/png;base64," + src);
            });
        }

		$(document).ready(function(){			
			$("#name, #surname, #pob, #perm_stay").on("keyup", function(){
				generate_front();
			});
			$("#sex, #dob, #doi, #doe").on("change", function(){
				generate_front();
			});

			// canvas related
			$("#signature_reset").on("click", function(){
				points = [];
				canvas.clear();
			});

			$("#signature").on("click", function(){
				generate_front();
			});

			$("#download").on("click", function(){
			    let af = document.createElement("a");
			    af.href = $("#front").attr("src");
			    af.download = "front.png";
			    af.style.display = "none";
			    document.body.appendChild(af);
			    af.click();
			    af.remove();

                let ab = document.createElement("a");
                ab.href = $("#back").attr("src");
                ab.download = "back.png";
                ab.style.display = "none";
                document.body.appendChild(ab);
                ab.click();
                ab.remove();
            });
		});
	</script>
</head>
<body>
	<div id="wrapper">
		<div class="row">
			<div class="col">
				<div class="cx">
					<img src="id_card_front.png" id="front" alt="">
				</div>
			</div>

			<div class="nsg col">
				Signature:&nbsp
				<button id="signature">Sign</button>
				<button id="signature_reset">Reset</button>
				<br>
				<div class="cx"></div>
			</div>

			<div class="col">
				<div class="cx">
					<img src="id_card_back.png" id="back" alt="">
				</div>
			</div>
		</div>
		<div class="row">

			<div class="col">
				<div class="controls">
					<button id="download">DOWNLOAD</button>

					<label for="surname">Surname: 
						<input type="text" id="surname" value="PRIJMENI">
					</label>

					<label for="name">Name: 
						<input type="text" id="name" value="JMENO">
					</label>

					<label for="sex">Gender:
						<select id="sex">
							<option value="M" selected>M</option>
							<option value="F">F</option>
						</select>
					</label>

					<label for="dob">Date of birth:
						<input type="date" id="dob" value="1995-05-27">
					</label>

					<label for="pob">Place of birth: 
						<input type="text" id="pob" value="Ústí nad Labem">
					</label>

					<label for="doi">Date of issuing: 
						<input type="date" id="doi" value="2018-05-27">
					</label>

					<label for="doe">Valid to: 
						<input type="date" id="doe" value="2028-05-27">
					</label>

                    <label for="perm_stay">Permanent residence:
                        <input type="text" id="perm_stay" value="U Ledovce 158">
                    </label>

					<button id="generate_front_normal">Generate</button>

				</div>
			</div>

		</div>
	</div>
</body>
</html>