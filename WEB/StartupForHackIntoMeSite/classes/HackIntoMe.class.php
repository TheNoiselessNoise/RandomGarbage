<?php
    if(!isset($_SESSION)){
        session_start();
    }

    // login ACCESS TOKEN - SESSION
    if(!isset($_SESSION["LOGIN_TOKEN"])){
        $_SESSION["LOGIN_TOKEN"] = HackIntoMe::getLoginToken();
    }

    // PAGE - really
    if(!isset($_SESSION["REALLY_COMPLETED"])){
        $_SESSION["REALLY_COMPLETED"] = false;
    }

    class MessageType {
        const ERROR = 0;
        const VALID = 1;
    }

    class HackIntoMe {
        public function __construct(){}

        public static function getPage($req){
            if(isset($req["a"])){
                if($req["a"] === "really"){
                    if($_SESSION["REALLY_COMPLETED"]){
                        return "<h1>YOU COMPLETED THIS</h1>";
                    } else {
                        return "<script src='js/really.js'></script>";
                    }
                }
            }
        }

        public static function getLoginToken(){
            $user_agent = $_SERVER["HTTP_USER_AGENT"];
            $encoded = convert_uuencode($user_agent);
            $cleaned = preg_replace("/[^a-zA-Z 0-9]+/", "", $encoded);
            $cleaned = strtolower($cleaned);

            while(strlen($cleaned) < 24){
                $cleaned .= $cleaned;
            }
            
            $part1 = substr($cleaned, 0, 3);
            $part2 = substr($cleaned, 4, 5);
            $part3 = substr($cleaned, 12, 12);

            return $part1 . '-' . $part2 . '-' . $part3;
        }

        public static function showMessage($text, $type = MessageType::ERROR){
            $class = $type === MessageType::ERROR ? "error" : "valid";
            echo "<span id='message' class='{$class}'>{$text}</span>";
        }
    }