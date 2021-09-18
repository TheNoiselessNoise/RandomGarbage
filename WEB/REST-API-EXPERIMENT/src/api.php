<?php

    namespace src;

    class Api {
        const GET = 0;
        const GET_ALL = 1;

        // db
        protected static $db = null;
        protected static $dbOpts = null;

        // dev
        protected static $useDev = false;
        protected static $devToken = null;

        // login
        protected static $useLogin = true;
        protected static $loginField = null;

        // url
        protected static $reqUrl = null;
        protected static $reqOmit = null;

        // requests
        protected static $requests = [];

        // written objects
        protected static $written_objects = [];

        public static function setLogin($bool=true){
            self::$useLogin = $bool;
        }

        public static function setLoginField($field=null){
            self::$loginField = $field;
        }

        public static function setDev($bool=null){
            self::$useDev = $bool;
        }

        public static function setDevToken($token=null){
            self::$devToken = $token;
        }

        public static function checkIfTokenIsCorrect($token=null){
            return true;
        }

        public static function setRequestUrl($omit=null){
            $dir = !is_null($omit) ? '/' . basename($omit) : null;

            self::$reqOmit = $dir;
            $req = $_SERVER['REQUEST_URI'];

            if(!is_null($dir)){
                $req = str_replace($dir, '', $req);
            }

            self::$reqUrl = $req;
        }

        public static function useDatabase($s=null, $u=null, $p=null, $d=null){
            $inst = Db::instance($s, $u, $p, $d);
            self::$db = $inst;
            self::$dbOpts = $s.'|'.$u.'|'.$p.'|'.$d;

            self::$requests[self::$dbOpts] = [];
        }

        public static function listenForRequest($reqType, $reqPath, $reqObj){
            array_push(self::$requests[self::$dbOpts], [$reqType, $reqPath, $reqObj]);
        }

        public static function parseRequests(){
            foreach(self::$requests as $db => $reqs){

                $x = new \stdClass();
                $x->defaultValueSet = false;
                $x->dbConfiguration = null;
                $x->objRequirePath = null;
                $x->objIndex = null;
                $x->rootIndex = null;
                $x->htaccess = null;
                $x->objClassName = null;
                $x->apiClassPath = null;
                $x->apiClassName = null;
                $x->reqPathParts = null;
                $x->fileDepth = 0;
                $x->fileRequirements = [];
                $x->startAuth = [];
                $x->fileContent = [];
                $x->endAuth = [];
                $x->objFinalPath = null;

                foreach($reqs as $req){
                    if(!$x->defaultValueSet){
                        self::getDefaultValues($x, $req, $db);
                        $x->defaultValueSet = true;
                    }

                    if(is_string($x->reqPathParts)){
                        self::writeRequest($x, $req);
                    } else {
                        foreach ($x->reqPathParts as $part) {
                            preg_match("/\{.*?\}/", $part, $match);

                            if (count($match)) {
                                self::writeRequest($x, $req);
                            }
                        }
                    }
                }

                if (!is_dir($x->objFinalPath)) {
                    mkdir($x->objFinalPath);
                }

                if (!file_exists($x->objIndex)) {
                    self::writeObject($x);
                }

                if (!file_exists($x->htaccess)) {
                    self::writeFile($x->htaccess, [
                        "RewriteEngine On",
                        "RewriteCond %{REQUEST_FILENAME} !-d",
                        "RewriteCond %{REQUEST_FILENAME} !-f",
                        "RewriteRule ^ index.php [QSA,L]"
                    ]);
                }
            }
        }

        public static function writeRequest(&$x, $req){
            $omit = self::$reqOmit;
            $reqType = $req[0];
            $reqPath = $req[1];

            $obj_var = self::getRandomVar(strtolower($x->objClassName));
            while(in_array($obj_var, self::$written_objects)){
                $obj_var = self::getRandomVar(strtolower($x->objClassName));
            }
            array_push(self::$written_objects, $obj_var);

            array_push($x->fileContent, ...[
                "\t\${$obj_var} = new {$x->objClassName}(\$dbConf);",
                "\t\$result = \${$obj_var}->parseRequest('{$omit}', {$reqType}, '{$reqPath}');",
                "\t{$x->apiClassName}::parseResult(\$result);",
            ]);
        }

        public static function getDefaultValues(&$x, $req, $db){
            $reqPath = $req[1];
            $reqObj = $req[2];

            if(is_null($x->dbConfiguration)){
                $x->dbConfiguration = $db;
            }

            if(is_null($x->objRequirePath)){
                $x->objRequirePath = str_replace("\\", "/", $reqObj) . ".php";
            }

            if(is_null($x->objClassName)){
                $reqObjPath = substr($reqObj, strpos($reqObj, "\\"));
                $reqObjPath = substr($reqObjPath, 1, strlen($reqObjPath));
                $x->objClassName = substr($reqObjPath, strpos($reqObjPath, "\\"));
                $x->objClassName = substr($x->objClassName, 1, strlen($x->objClassName));
            }

            if(is_null($x->apiClassPath)){
                $x->apiClassPath = self::class;
            }

            if(is_null($x->apiClassName)){
                $apiClassPath = explode("\\", $x->apiClassPath);
                $x->apiClassName = end($apiClassPath);
            }

            if(strpos($reqPath, "/") !== FALSE){
                $x->reqPathParts = explode("/", $reqPath);
            } else {
                $x->reqPathParts = $reqPath;
            }

            if(is_array($x->reqPathParts)){
                $depth = 0;
                $objFinalPath = "";
                foreach ($x->reqPathParts as $part) {
                    preg_match("/\{.*?\}/", $part, $match);

                    if (count($match)) {
                        if(is_null($x->objFinalPath)){
                            $x->objFinalPath = $objFinalPath;
                        }
                    } else {
                        $objFinalPath .= $part . '/';
                        $depth++;
                    }
                }

                $x->fileDepth = $depth;
            } else {
                $x->objFinalPath = $x->reqPathParts . '/';
                $x->fileDepth = 1;
            }

            $x->objRequirePath = str_repeat("../", $x->fileDepth) . $x->objRequirePath;

            if(is_null($x->objIndex)){
                $x->objIndex = $x->objFinalPath . 'index.php';
            }

            if(is_null($x->rootIndex)){
                $x->rootIndex = str_repeat("../", $x->fileDepth) . 'index.php';
            }

            if(is_null($x->htaccess)){
                $x->htaccess = $x->objFinalPath . '.htaccess';
            }

            if(!count($x->fileRequirements)){
                $x->fileRequirements = [
                    "use {$reqObj};",
                    "use {$x->apiClassPath};",
                    "require_once '{$x->objRequirePath}';",
                    "require_once '{$x->rootIndex}';"
                ];
            }

            if(!count($x->startAuth)){
                $x->startAuth = [
                    "if({$x->apiClassName}::auth()){",
                    "\t\$dbConf = '{$x->dbConfiguration}';"
                ];
            }

            if(!count($x->endAuth)){
                $x->endAuth = [
                    "} else {",
                    "\t{$x->apiClassName}::unauthorized();",
                    "}"
                ];
            }
        }

        public static function writeObject($x){
            $objFile = fopen($x->objIndex, "w");
            self::writeLines($objFile, ["<?php"]);
            self::writeLines($objFile, $x->fileRequirements);
            self::writeLines($objFile, $x->startAuth);
            self::writeLines($objFile, $x->fileContent);
            self::writeLines($objFile, $x->endAuth);
        }

        public static function writeFile($path, $lines){
            $f = fopen($path, "w");
            self::writeLines($f, $lines, true);
        }

        public static function writeLines($handle, $lines, $close = false){
            foreach($lines as $line){
                fwrite($handle, $line . PHP_EOL);
            }

            if($close){
                fclose($handle);
            }
        }

        public static function getRandomVar($prefix='var'){
            $prefix .= '_';
            for($i = 0; $i < 8; $i++){
                $prefix .= strval(round(rand(0, 9)));
            }
            return $prefix;
        }

        public static function isRoot(){
            if(!defined("API_ROOT")){
                return false;
            }

            $req = $_SERVER["REQUEST_URI"];
            $path = parse_url($req)["path"];
            $path = substr($path, 1, strlen($path) - 2);
            return $path === API_ROOT;
        }

        public static function auth(){
            if(!self::$useLogin){
                return true;
            }

            if(self::$loginField){
                if(self::$useDev){
                    return array_key_exists(self::$loginField, $_REQUEST) && $_REQUEST[self::$loginField] === self::$devToken;
                }
                return array_key_exists(self::$loginField, $_REQUEST) && self::checkIfTokenIsCorrect($_REQUEST[self::$loginField]);
            }

            return false;
        }

        public static function parseResult($result, $is_error=false){
            header("Content-Type: application/json");

            if(is_bool($result) || is_null($result)){
                $result = "404 Not Found";
                $is_error = true;
            }

            if($is_error){
                echo json_encode(["error" => $result]);
            } else {
                echo json_encode($result);
            }
         }

        public static function unauthorized(){
            Api::parseResult('401 Unauthorized', true);
        }
    }