<?php
    require("CSV_XYZT.class.php");

    $csv = new CSVParser("users.csv");
    $csv->setReplaceBlank(true);
    $csv->setFirstLineAreColumnNames(true);
    $csv->parseData();

    $fileteredData = $csv->getFilteredData(["surname"]);
    $csv->printData($fileteredData);
