<?php
	$cities = [
		"Praha","Brno","Ostrava","Plzeň","Liberec","Olomouc",
		"České Budějovice","Hradec Králové","Ústí nad Labem",
		"Pardubice","Zlín","Havířov","Kladno","Most","Opava",
		"Frýdek-Místek","Karviná","Jihlava","Teplice","Chomutov",
		"Děčín","Karlovy Vary","Jablonec nad Nisou","Mladá Boleslav","Prostějov","Přerov"
	];

	$maritals = [
		"F" => ["vdaná", "svobodná", "rozvedená"],
		"M" => ["ženatý", "svobodný", "rozvedený"]
	];

	function imagecopymerge_alpha($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $pct){
        // creating a cut resource
        $cut = imagecreatetruecolor($src_w, $src_h);

        // copying relevant section from background to the cut resource
        imagecopy($cut, $dst_im, 0, 0, $dst_x, $dst_y, $src_w, $src_h);
       
        // copying relevant section from watermark to the cut resource
        imagecopy($cut, $src_im, 0, 0, $src_x, $src_y, $src_w, $src_h);
       
        // insert cut resource to destination image
        imagecopymerge($dst_im, $cut, $dst_x, $dst_y, 0, 0, $src_w, $src_h, $pct);
    }
	function pixelate_part($img, $width, $height, $pixelate_x = 20, $pixelate_y = 20)
	{
	    // start from the top-left pixel and keep looping until we have the desired effect
	    for($y = 0;$y < $height;$y += $pixelate_y+1)
	    {

	        for($x = 0;$x < $width;$x += $pixelate_x+1)
	        {
	            // get the color for current pixel
	            $rgb = imagecolorsforindex($img, imagecolorat($img, $x, $y));

	            // get the closest color from palette
	            $color = imagecolorclosest($img, $rgb['red'], $rgb['green'], $rgb['blue']);
	            imagefilledrectangle($img, $x, $y, $x+$pixelate_x, $y+$pixelate_y, $color);

	        }       
	    }
	}
	function generate_id($len=9, $spaces=true){
		$id = "";
		$tmp = $len;
		while($len > 0){
			if($len !== $tmp && $spaces){
				$id .= " ";
			}
			$id .= round(rand(0, 9));
			$len--;
		}
		return $id;
	}
	function spaces($str){
		$tmp = str_split($str);
		return implode(" ", $tmp);
	}
	function generate_date(){
		$months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		$rmonth = round(rand(1, 12));

		$rday = round(rand(1, $months[$rmonth - 1]));
		$ryear = round(rand(1950, intval(date("Y"))));

		if($rmonth < 10) {
			$rmonth = "0" . $rmonth;
		}

		if($rday < 10) {
			$rday = "0" . $rday;
		}

		return $rday . "." . $rmonth . "." . $ryear;
	}
	function is_set($req, $vals){
		$vals = explode(" ", $vals);
		foreach($vals as $val){
			if(!isset($req[$val])){
				return false;
			}
		}
		return true;
	}
	function correct_date($d){
		$tmp = explode("-", $d);
		$tmp = array_reverse($tmp);
		return implode(".", $tmp);
	}

	// Informations for blur selection
	// 589x371
	$w = 589;
	$h = 371;
	$fname = "id_card_front.png";
	$bname = "id_card_back.png";
	$picname = "x.jpg";
	$font = realpath('.') . "\arial.ttf";

	$SURNAME = "PRIJMENI";
	$NAME = "JMENO";
	$POB1 = "PARDUBICE";
	$POB2 = "okr. PARDUBICE";
	$SEX = "M";
	$DOC_ID = generate_id(9);
	$DOB = generate_date();
	$DOI = generate_date();
	$DOE = generate_date();
	$MS = $maritals[$SEX][round(rand(0, count($maritals[$SEX]) - 1))];
	$CITY = $cities[round(rand(0, count($cities) - 1))];
	$AUTH = "MěÚ " . $CITY;
	$TITLE = "-----";
	$DOCS = "-----";
	$SIG = null;
	$SIGNAME = "sig.png";
    $PERM_STAY = "U Ledovce 150";

	// parse post requests
	if(is_set($_POST, "is_front name surname sex dob pob doi doe sig perm_stay")){
		$NAME = mb_strtoupper($_POST["name"]);
		$SURNAME = mb_strtoupper($_POST["surname"]);
		$SEX = $_POST["sex"];
        $MS = $maritals[$SEX][round(rand(0, count($maritals[$SEX]) - 1))];
        $POB1 = mb_strtoupper($_POST["pob"]);
		$POB2 = "okr. " . $POB1;
		$DOB = correct_date($_POST["dob"]);
		$DOI = correct_date($_POST["doi"]);
		$DOE = correct_date($_POST["doe"]);
        $CITY = $_POST["pob"];
        $AUTH = "MěÚ " . $CITY;
        $PERM_STAY = $_POST["perm_stay"];

		$SIG = $_POST["sig"];
		$DEC = base64_decode($SIG);
		file_put_contents($SIGNAME, $DEC);
	}

	$TMP = explode(".", $DOB);
	$PERSONAL_NUMBER = substr($TMP[2], 2) . $TMP[1] . $TMP[0] . "/" . generate_id(4, false);

	$docid_x = explode(" ", $DOC_ID);
	$docid = implode("", $docid_x);
	$BID_1 = spaces("IDCZE{$docid}" . round(rand(0, 9)) . "<<<<<<<<<<<<<<<");
	$bid_x = generate_id(7, false);
	$PN = explode("/", $PERSONAL_NUMBER);
	$BID_2 = spaces("{$PN[0]}" . round(rand(0, 9)) . "{$SEX}{$bid_x}CZE<<<<<<<<<<<" . round(rand(0, 9)));

	$XNAME = noczech($NAME);
	$XSURNAME = noczech($SURNAME);
	$BX = "{$XSURNAME}<<{$XNAME}<<<<<<<<<<<<<<<<";
	$BID_3 = spaces($BX);

	if(strlen($BX) > 29){
        $BX = substr($BX, 0, 29);
        $BID_3 = spaces($BX);
	} else if(strlen($BX) < 29){
	    while(strlen($BX) < 29){
	        $BX .= "<";
        }
        $BID_3 = spaces($BX);
    }

    function noczech($x){
    	$y = [
    		"Ě" => "E",
    		"É" => "E",
    		"Í" => "I",
    		"Ý" => "Y",
    		"Ž" => "Z",
    		"Ř" => "R",
    		"Č" => "C",
    		"Š" => "S",
    		"Ů" => "U",
    		"Ú" => "U"
    	];

    	$z = $x;
    	foreach(array_keys($y) as $k){
    		if(strpos($z, $k) !== FALSE){
    			$z = str_replace($k, $y[$k], $z);
    		}
    	}

    	return $z;
    }

	function generate_front($ret=false){
		global $fname, $font, $picname, $SURNAME, $NAME, $SEX, $DOC_ID, $DOB, $POB1, $POB2, $DOI, $DOE, $SIGNAME;
		$front = imagecreatefrompng($fname); // load source

		$p1 = imagecreatetruecolor(185, 44);
		$p1white = imagecolorallocate($p1, 176, 176, 176);
		imagefill($p1, 0, 0, $p1white);
		imageantialias($p1, false);
		imagecopymerge_alpha($front, $p1, 15, 122, 0, 0, 185, 44, 100);

		// show at 15,122 with full size 185 230
		$pic = imagecreatefromjpeg($picname);
		$pic = imagescale($pic, 185, 185);
		pixelate_part($pic, 185, 185, 1, 1);
		imagefilter($pic, IMG_FILTER_GRAYSCALE);
		imagecopymerge_alpha($front, $pic, 15, 166, 0, 0, 185, 185, 100);

		// show signature
		$sigpic = imagecreatefrompng($SIGNAME); // 400x150
		$sigpic = imagescale($sigpic, 180, 60);
		imagecopymerge_alpha($front, $sigpic, 380, 290, 0, 0, 180, 60, 100);


		$black = imagecolorallocate($front, 0, 0, 0);

		// imagettftext($image, $size, $angle, $x, $y, $color, $fontfile, $text)
		imagettftext($front, 10, 0, 140, 91, $black, $font, $SURNAME); // SURNAME
		imagettftext($front, 10, 0, 140, 111, $black, $font, $NAME); // NAME
		imagettftext($front, 10, 0, 416, 148, $black, $font, $SEX); // SEX
		imagettftext($front, 15, 0, 425, 62, $black, $font, $DOC_ID); // DOC NUMBER
		imagettftext($front, 11, 0, 207, 148, $black, $font, $DOB); // DOB - Date of birth
		imagettftext($front, 11, 0, 207, 192, $black, $font, $POB1); // POB - Place of birth - part 1
		imagettftext($front, 11, 0, 207, 210, $black, $font, $POB2); // POB - Place of birth - part 2
		imagettftext($front, 11, 0, 207, 310, $black, $font, $DOI); // DOI - Date of issue
        imagettftext($front, 11, 0, 207, 354, $black, $font, $DOE); // DOE - Date of expiry

		ob_start();
		imagejpeg($front);
		$imgsrc = ob_get_clean();

		imagedestroy($front);
		imagedestroy($p1);
		imagedestroy($pic);
		imagedestroy($sigpic);

		if($ret){
			return base64_encode($imgsrc);
		}
		echo "<img src='data:image/png;base64," . base64_encode($imgsrc) . "' alt='' />";
	}

	function generate_back($ret=false){
		global $bname, $font, $PERSONAL_NUMBER, $TITLE, $MS, $AUTH, $DOCS, $BID_1, $BID_2, $BID_3, $PERM_STAY;
		$back = imagecreatefrompng($bname); // load source
		$black = imagecolorallocate($back, 0, 0, 0);

		// imagettftext($image, $size, $angle, $x, $y, $color, $fontfile, $text)
		imagettftext($back, 12, 0, 48, 105, $black, $font, $PERSONAL_NUMBER); // PERSONAL_NUMBER
		imagettftext($back, 10, 0, 260, 90, $black, $font, $TITLE); // TITLE
		imagettftext($back, 10, 0, 162, 127, $black, $font, $MS); // MARITAL STATUS
		imagettftext($back, 10, 0, 162, 157, $black, $font, $AUTH); // AUTHORITY
		imagettftext($back, 10, 0, 162, 187, $black, $font, $DOCS); // DOCS
		imagettftext($back, 15, 0, 30, 270, $black, $font, $BID_1); // PERSONAL_NUMBER
		imagettftext($back, 15, 0, 30, 300, $black, $font, $BID_2); // PERSONAL_NUMBER
		imagettftext($back, 15, 0, 30, 330, $black, $font, $BID_3); // PERSONAL_NUMBER
        imagettftext($back, 12, 0, 50, 45, $black, $font, $PERM_STAY); // PERM_STAY - Permanent stay

		ob_start();
		imagejpeg($back);
		$imgsrc = ob_get_clean();

		imagedestroy($back);

		if($ret){
			return base64_encode($imgsrc);
		}
		echo "<img src='data:image/png;base64," . base64_encode($imgsrc) . "' alt='' />";
	}

	if(is_set($_POST, "get_front")){
		echo generate_front(true);
		exit();
	}

    if(is_set($_POST, "get_back")){
        echo generate_back(true);
        exit();
    }

	if(isset($_GET["id"]) && $_GET["id"] === "front"){
		generate_front();
	} else if(isset($_GET["id"]) && $_GET["id"] === "back"){
		generate_back();
	}
	
?>