<?php
    class CSVParser {
        private $file;
        private $firstLineAreColumnNames;
        private $replaceBlank = false;
        private $columnNames = [];
        private $data = [];

        public function __construct(string $file, bool $firstLineAreColumnNames = true)
        {
            $this->file = $file;
            $this->firstLineAreColumnNames = $firstLineAreColumnNames;
        }

        public function setFirstLineAreColumnNames(bool $bool){
            $this->firstLineAreColumnNames = $bool;
            return $this;
        }

        public function setReplaceBlank(bool $bool){
            $this->replaceBlank = $bool;
            return $this;
        }

        public function getColumnNames(){
            return $this->columnNames;
        }

        public function getData(){
            return $this->data;
        }

        public function getFilteredData($columns = []){
            $columns = count($columns) === 0 ? $this->columnNames : $columns;

            $filteredData = [];
            foreach($this->data as $line){
                $row = [];
                foreach($columns as $key){
                    $row[$key] = $line[$key];
                }

                if(count($row) == 1){
                    $filteredData[] = array_pop($row);
                } else {
                    $filteredData[] = $row;
                }
            }

            return $filteredData;
        }

        public function parseData(string $file = null){
            $file = is_null($file) ? $this->file : $file;

            // open file
            $ffile = fopen($file, "r");
            // read file
            $fdata = fread($ffile, filesize($file));
            // get lines to array
            $fdata = explode("\n", $fdata);

            // remove empty lines
            $lines = [];
            foreach($fdata as $line){
                if($line != ""){
                    $lines[] = $line;
                }
            }

            // if firstLine is set, get column names
            if($this->firstLineAreColumnNames){
                $this->columnNames = explode(",", array_slice($lines, 0, 1)[0]);
                $lines = array_slice($lines, 1, count($lines));
            } else {
                $this->columnNames = array_keys(explode(",", $lines[0]));
            }

            // parse data
            $parsedData = [];
            foreach($lines as $line){
                $columns = explode(",", $line);
                $new_line = array_combine($this->columnNames, $columns);

                if($this->replaceBlank){
                    $new_line = array_map(function($v){
                        return $v === "<blank>" ? "" : $v;
                    }, $new_line);
                }

                $parsedData[] = $new_line;
            }

            $this->data = $parsedData;
            return $this;
        }

        public function printData($data = null){
            if(is_null($data)){
                $data = $this->getData();
            }

            $columnNames = is_array($data[0]) ? implode(",", array_keys($data[0])) : "";
            $print = $columnNames === "" ? "" : $columnNames . "<br>";

            foreach($data as $row){
                if(is_string($row)){
                    $print .= $row;
                } else {
                    $print .= implode(",", $row);
                }
                $print .= '<br>';
            }

            echo $print;
        }
    }