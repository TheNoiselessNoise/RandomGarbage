<?php
use src\objects\Product;
use src\Api;
require_once '../src/objects/Product.php';
require_once '../index.php';
if(Api::auth()){
	$dbConf = 'localhost|root||rest_api';
	$product_60261006 = new Product($dbConf);
	$result = $product_60261006->parseRequest('/REST-API', 1, 'product');
	Api::parseResult($result);
	$product_55136541 = new Product($dbConf);
	$result = $product_55136541->parseRequest('/REST-API', 0, 'product/{id}');
	Api::parseResult($result);
} else {
	Api::unauthorized();
}
