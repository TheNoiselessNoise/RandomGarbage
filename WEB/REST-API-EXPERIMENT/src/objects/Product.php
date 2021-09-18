<?php
    namespace src\objects;

    require_once "apiObject.php";

    class Product extends apiObject {
        protected $_table_name = "products";

        protected $_fields = [
            "id", "name", "category", "count"
        ]; // all fields

        protected $_allowed_fields = []; // all fields on request, empty array = all

        protected $_required_fields = [
            "name", "category", "count"
        ]; // all fields required on POST

        public function __construct($dbOpts)
        {
            parent::__construct($dbOpts);
        }
    }