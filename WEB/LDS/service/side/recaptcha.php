<?php
	class Recaptcha {
		public function create(){
            $numFormat = new NumberFormatter("en", NumberFormatter::SPELLOUT);
			$a = rand(0, 50);
            $b = rand(0, 50);
            $c = ["+", "-"];
            $s = ["%=", "==", "=%", "%%"];
            $d = $c[rand(0, count($c) - 1)];
            $x = 0;
            $y = eval("\$x = $a$d$b;");

            $dec_a = base64_encode($a . "lds" . $s[rand(0, count($s) - 1)]) . $s[rand(0, count($s) - 1)];
            $dec_b = base64_encode($b . "dsl" . $s[rand(0, count($s) - 1)]) . $s[rand(0, count($s) - 1)];
            $dec_d = base64_encode($d . "sdl" . $s[rand(0, count($s) - 1)]) . $s[rand(0, count($s) - 1)];
                
            if($x < 0){
                $this->create();
            } else {
                $first = str_replace("-", "", $numFormat->format($a));
                $second = str_replace("-", "", $numFormat->format($b));

                echo "<input type='hidden' name='recaptcha_a' value='{$dec_a}'>";
                echo "<input type='hidden' name='recaptcha_b' value='{$dec_b}'>";
                echo "<input type='hidden' name='recaptcha_d' value='{$dec_d}'>";
                echo "<input class='validate' class='form-control' type='text'  name='recaptcha' id='recaptcha'>";
                echo "<label for='recaptcha'>{$first} {$d} {$second} = ???</label>";
            }
        }

        public function calcRecaptcha($a, $b, $d, $u){
            $numFormat = new NumberFormatter("en", NumberFormatter::SPELLOUT);
        	$r = 0;

        	try {
        		eval("\$r = $a $d $b;");
        	} catch(Exception $e){
        		return false;
        	}

            if($u == $r){
                return true;
            }
		}

        public function checkResult($a, $b, $d){
            try {
                $a = intval(substr(base64_decode(substr($a, 0, -2)), 0, -5));
                $b = intval(substr(base64_decode(substr($b, 0, -2)), 0, -5));
                $d = substr(base64_decode(substr($d, 0, -2)), 0, -5);
            } catch (Exception $e) {
                return array(false, false, false);
            }

            return array($a, $b, $d);
        }
	}
?>