<?php
	/*
		Name: WebPageScanner
		Author: XYZT
		Year: 2018
	*/

	libxml_use_internal_errors(true);

	class Scanner extends DOMDocument {
		private $HOST;
		private $HOSTNAME;
		private $COOKIES = [];
		private $WHOLE_COOKIE = "";
		private $PORTS = [
			"HTTP" => 80,
			"HTTPS" => 443,
			"FTP" => 21,
			"SSH" => 22,
			"SMTP" => 25,
			"MYSQL" => 3306,
			"VNC" => 5900
			// [0, 1] from 0 to 1
		];
		private $ACTIVE_PORTS = [];
		private $NOT_ACTIVE_PORTS = [];
		private $USED_URLS = [];
		private $NOT_USED_URLS = [];
		private $WEBCRAWLER_RESULTS = [
			"PAGES" => [],
			"STYLES" => [],
			"SCRIPTS" => [],
			"FILES" => [],
			"PHOTOS" => [],
			"FORMS" => [],
			"GET" => [],
			"POST" => []
		];
		private $LINKS = ["a"=>"href", "img"=>"src", "link"=>"href", "script"=>"src", "form"=>"action"];
		private $EXTS = [
			"PAGES"=> ["php", "php3", "html", "htm"],
			"STYLES"=> ["css", "scss"],
			"SCRIPTS"=> ["js"],
			"FILES"=> ["txt", "rar", "zip", "doc", "docx", "pdf", "xml"],
			"PHOTOS"=> ["png", "jpg", "gif", "jpeg", "ico"]
		];

		public function __construct($h){
			if($this->checkURL($h)){
				$this->HOST = $h;
				$this->HOSTNAME = parse_url($h, PHP_URL_HOST);
			} else {
				throw new Exception("Invalid URL/Host '{$h}'!");
			}
		}

		private function checkURL($url) {
			return filter_var($url, FILTER_VALIDATE_URL);
		}

		public function getVariable($name){
			return "<h1>{$name}</h1>" . print_r($this->{$name});
		}

		public function parseCookies($content){
			preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $content, $matches);
			$cookies = array();
			foreach($matches[1] as $item) {
    			parse_str($item, $cookie);
    			$cookies = array_merge($cookies, $cookie);
			}

			
			foreach($cookies as $cookie=>$value){
				if(!in_array($cookie, $this->COOKIES)){
					$this->COOKIES[$cookie] = $value;
				}
			}

			$whole_cookie = "Cookie: ";
			foreach($this->COOKIES as $cookie=>$value){
				$whole_cookie .= "{$cookie}={$value};";
			}
			$this->WHOLE_COOKIE = substr($whole_cookie, 0, -1);
		}

		public function Scanner_getCookies(){
			foreach ($this->COOKIES as $cookie=>$value) {
				echo $cookie . ":" . $value;
			}
		}

		public function setCookie($cookies){
			if(is_array($cookies) and count($cookies) == 2){
				$this->COOKIES[$cookies[0]] = $cookies[1];
			} else {
				return false;
			}
		}

		public function getHTMLCode($url){
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);	
			curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
			curl_setopt($ch, CURLOPT_HEADER, 1);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
			curl_setopt($ch, CURLOPT_TIMEOUT, 8);

			if(count($this->COOKIES) > 0){
				curl_setopt($ch, CURLOPT_HTTPHEADER, array($this->WHOLE_COOKIE));
			}

			$content = curl_exec($ch);

			$this->parseCookies($content);
		
			curl_close($ch);
			return $content;
		}

		public function webCrawler_recreateForm($url){
			$form = "";
			for($i = 0; $i < count($this->WEBCRAWLER_RESULTS["FORMS"]); $i++){
				if($this->WEBCRAWLER_RESULTS["FORMS"][$i]["action"] == $url){
					$f = $this->WEBCRAWLER_RESULTS["FORMS"][$i];
					$form = "<h1>ReCreated Form</h1><form action='{$url}' method='" . $f["method"] . "'><h3>[ {$url} ]</h3>";
					foreach ($f["inputs"] as $name=>$type) {
						$form .= "<input type='{$type}' name='{$name}'>";
					}
					$form .= "</form>";
					return $form;
				}
			}
		}

		public function webCrawler_loop(){
			foreach ($this->NOT_USED_URLS as $url) {
				if(!$this->checkURL($url)){
					array_push($this->USED_URLS, $url);
					continue;
				}

				array_push($this->USED_URLS, $url);
				$this->NOT_USED_URLS = array_diff($this->NOT_USED_URLS, array($url));

				$text = $this->getHTMLCode($url);
				$DOM = $this->loadHTML($text);
				libxml_clear_errors();

				foreach ($this->LINKS as $tag=>$attr) {
					$links = $this->getElementsByTagName($tag);
					$this->webCrawler_parseLinks($links, $tag);
				}

				$forms = $this->getElementsByTagName("form");
				if($forms->length > 0){
					$this->webCrawler_parseForms($forms, $url);
				}
			}

			if(count($this->NOT_USED_URLS) > 0){
				$this->webCrawler_loop();
			} else {
				$this->webCrawler_parseResults();
			}
		}

		public function webCrawler_parseLinks($nodes, $tag){
			foreach ($nodes as $node) {
				$attr = $node->getAttribute($this->LINKS[$tag]);

				if($attr != "#"){
					$new_url = $this->HOST . $attr;
					if($this->checkURL($new_url)){
						if(!in_array($new_url, $this->USED_URLS) and parse_url($new_url, PHP_URL_HOST) == $this->HOSTNAME){
							array_push($this->NOT_USED_URLS, $new_url);
						}
					} else {
						if($this->checkURL($attr)){
							if(!in_array($attr, $this->USED_URLS) and parse_url($attr, PHP_URL_HOST) == $this->HOSTNAME){
								array_push($this->NOT_USED_URLS, $attr);
							}	
						}
					}
				}
			}
		}

		public function webCrawler_parseResults(){
			foreach($this->USED_URLS as $url){
				if(strpos($url, "../")){
					$url = str_replace("../", "", $url);
				} else if(strpos($url, "./")){
					$url = str_replace("./", "", $url);
				}

				$path = parse_url($url, PHP_URL_PATH);
				$query = parse_url($url, PHP_URL_QUERY);
				$tmp = explode(".", $path);
				$ext = $tmp[count($tmp) - 1];

				# SWITCH CASE?

				# GET (BASIC) PAGES
				if(in_array($ext, $this->EXTS["PAGES"]) and !in_array($url, $this->WEBCRAWLER_RESULTS["PAGES"]) and $query == ""){
					array_push($this->WEBCRAWLER_RESULTS["PAGES"], $url);
					continue;
				}

				# GET STYLES
				if(in_array($ext, $this->EXTS["STYLES"]) and !in_array($url, $this->WEBCRAWLER_RESULTS["STYLES"])){
					array_push($this->WEBCRAWLER_RESULTS["STYLES"], $url);
					continue;
				}

				# GET SCRIPTS
				if(in_array($ext, $this->EXTS["SCRIPTS"]) and !in_array($url, $this->WEBCRAWLER_RESULTS["SCRIPTS"])){
					array_push($this->WEBCRAWLER_RESULTS["SCRIPTS"], $url);
					continue;
				}

				# GET FILES
				if(in_array($ext, $this->EXTS["FILES"]) and !in_array($url, $this->WEBCRAWLER_RESULTS["FILES"])){
					array_push($this->WEBCRAWLER_RESULTS["FILES"], $url);
					continue;
				}

				# GET IMAGES
				if(in_array($ext, $this->EXTS["PHOTOS"]) and !in_array($url, $this->WEBCRAWLER_RESULTS["PHOTOS"])){
					array_push($this->WEBCRAWLER_RESULTS["PHOTOS"], $url);
					continue;
				}

				# GET PARAMETERS
				if($query != "" and !in_array($url, $this->WEBCRAWLER_RESULTS["GET"])){
					array_push($this->WEBCRAWLER_RESULTS["GET"], $url);
					continue;
				}
			}
		}

		public function webCrawler_parseForms($nodes, $url){
			foreach ($nodes as $node) {
				$form = array();
				$form["action"] = ($this->checkUrl($node->getAttribute("action") == true)) ? $node->getAttribute("action") : $url;
				$form["method"] = strtoupper($node->getAttribute("method"));
				$form["inputs"] = [];

				$inputs = $node->getElementsByTagName("input");
				foreach($inputs as $input){
					$form["inputs"][$input->getAttribute("name")] = $input->getAttribute("type");
				}

				$check = true;
				if(!in_array($form, $this->WEBCRAWLER_RESULTS["FORMS"]) and $form["inputs"] != []){
					foreach($this->WEBCRAWLER_RESULTS["FORMS"] as $nform){
						if($nform["inputs"] == $form["inputs"]){
							$check = false;
						}
					}

					if($check){
						array_push($this->WEBCRAWLER_RESULTS["FORMS"], $form);
						$this->WEBCRAWLER_RESULTS["POST"][$url] = $form["inputs"];
					}
				}
			}
		}

		public function webCrawler_showResults(){
			$whole = "";
			foreach(array_keys($this->WEBCRAWLER_RESULTS) as $key){
				$whole .= "<h1>{$key}</h1>";
				if($key == "FORMS"){
					for($i = 0; $i < count($this->WEBCRAWLER_RESULTS[$key]); $i++){
						$whole .= $this->WEBCRAWLER_RESULTS[$key][$i]["action"] . " [" . $this->WEBCRAWLER_RESULTS[$key][$i]["method"] . "]<br><ul>";
						foreach ($this->WEBCRAWLER_RESULTS[$key][$i]["inputs"] as $name=>$type) {
							if($name != ""){
								$whole .= "<li>{$name} = [{$type}]</li>";
							} else {
								$whole .= "<li>NO_NAME = [{$type}]</li>";
							}
						}
						$whole .= "</ul>";
					}
				} elseif($key == "POST") {
					foreach($this->WEBCRAWLER_RESULTS[$key] as $url=>$inputs){
						$whole .= "<ul>";
						foreach($this->WEBCRAWLER_RESULTS[$key][$url] as $name=>$type){
							if($name != ""){
								$whole .= "<li>{$name} = [{$type}]</li>";
							} else {
								$whole .= "<li>NO_NAME = [{$type}]</li>";
							}
						}
						$whole .= "</ul>";
					}
				} else {
					foreach ($this->WEBCRAWLER_RESULTS[$key] as $value) {
						$whole .= "<a href='{$value}' alt='{$value}'>{$value}</a><br>";
					}
				}
			}
			return $whole;
		}

		/*
			Main WebCrawler function (Starter function)
		*/
		public function webCrawler(){
			$start = $this->getHTMLCode($this->HOST);
			$DOM = $this->loadHTML($start);
			libxml_clear_errors();

			foreach($this->LINKS as $tag=>$attr){
				$links = $this->getElementsByTagName($tag);
				$this->webCrawler_parseLinks($links, $tag);
			}

			$forms = $this->getElementsByTagName("form");
			if($forms->length > 0){
				$this->webCrawler_parseForms($forms, $this->HOST);
			}

			$this->webCrawler_loop();
		}

		/*
			Showing the results of portScanner, which port is on and off
		*/
		public function portScanner_showResults(){
			$r = "<h2>ACTIVE PORTS</h2>";
			foreach($this->ACTIVE_PORTS as $name=>$port){
				$r .= $port . " [{$name}]<br>";
			}

			$r .= "<h2>NOT RESPONDING PORTS</h2>";
			foreach($this->NOT_ACTIVE_PORTS as $name=>$port){
				$r .= $port . " [{$name}]<br>";
			}
			return $r;
		}

		/*
			Checking if port is on or off
		*/
		private function portScanner_getPort($name, $port){
			$connection = @fsockopen($this->HOSTNAME, $port);
    		if(is_resource($connection)){
    			$this->ACTIVE_PORTS[$name] = $port;
        		fclose($connection);
        	} else {
        		$this->NOT_ACTIVE_PORTS[$name] = $port;
    		}
		}

		/*
			Main portScanner function
			Syntax: portScanner() or portScanner(80) or portScanner(array(22, 80))
		*/
		public function portScanner($ports=null){
			if(is_int($ports)){
				$this->portScanner_getPort(strtoupper(getservbyport($ports, 'tcp')), $ports);
			} else if(is_array($ports)){
				foreach($ports as $port){
					$this->portScanner_getPort(strtoupper(getservbyport($port, 'tcp')), $port);
				}
			} else {
				foreach($this->PORTS as $name=>$port) {
					if(is_array($this->PORTS[$name])){
						for($i = $this->PORTS[$name][0]; $i < $this->PORTS[$name][1]; $i++){
							$this->portScanner_getPort($name, $i);
						}
					} else {
						$this->portScanner_getPort($name, $port);
					}
				}
			}
		}

		public function wpScanner(){

		} 
	}
?>