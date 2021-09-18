<?php

    use src\Api;
    use src\objects\Product;

    require_once "src/api.php";
    require_once "src/db.php";

    if(!defined("API_ROOT")){
        define("API_ROOT", basename(__DIR__));
    }

    $token = "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3";

    Api::setLogin(false);
    Api::setLoginField("token");

    Api::setDev(true);
    Api::setDevToken($token); // test

    Api::setRequestUrl(__DIR__);

    if(Api::auth()){
        if(Api::isRoot()){
            Api::useDatabase("localhost", "root", "", "rest_api");
            Api::listenForRequest(Api::GET_ALL, 'product', Product::class); // getting
            Api::listenForRequest(Api::GET, 'product/{id}', Product::class); // getting
            Api::parseRequests();
        }
    }
