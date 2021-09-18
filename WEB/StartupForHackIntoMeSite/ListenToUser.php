<?php
    require "classes/HackIntoMe.class.php";

    // login ACCESS TOKEN - FORM
    if(isset($_POST["getLoginToken"])){
        echo json_encode(["code" => HackIntoMe::getLoginToken()]);
        exit();
    }

    // login CHECK TOKEN - FORM
    if(isset($_POST["checkLoginToken"])){
        if(isset($_POST["userToken"])){
            if($_POST["userToken"] === $_SESSION["LOGIN_TOKEN"]){
                // set LOGIN_SUCCESS
                $_SESSION["LOGIN_SUCCESS"] = true;
                HackIntoMe::showMessage("<script>window.location = 'index.php?a=really';</script>");
            } else {
                HackIntoMe::showMessage("Token is not valid.");
            }
        } else {
            HackIntoMe::showMessage("Oh, really...");
        }
        exit();
    }