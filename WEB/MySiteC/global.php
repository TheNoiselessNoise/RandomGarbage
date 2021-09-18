<?php
    function getSongs($glob_pattern){
        $result = "";
        $files = glob($glob_pattern);
        foreach($files as $file){
            $info = pathinfo($file);
            $filename = htmlentities($info['filename'], ENT_QUOTES);
            $filepath = htmlentities($file, ENT_QUOTES);
            $result .= "<a href='#' id='song' data-value='{$filepath}'>{$filename}</a>";
        }

        return $result;
    }

    function getAllMusic($path){
        $files = glob($path);
        $allFiles = [];
        foreach($files as $file){
            foreach(glob($file . '/*') as $ffile){
                $allFiles[] = $ffile;
            }
        }
        return $allFiles;
    }

	function getRandomMusic($path){
        $files = glob($path);
        $allFiles = [];

        foreach($files as $file){
            $filename = pathinfo($file)['filename'];
            $allFiles[$filename] = glob($file . '/*');
        }

        $keys = array_keys($allFiles);
        $randomCategory = $keys[rand(0, count($keys) - 1)];
        $randomIndex = rand(0, count($allFiles[$randomCategory]) - 1);
        $randomMusic = $allFiles[$randomCategory][$randomIndex];

        return htmlentities($randomMusic, ENT_QUOTES);
	}

    $RANDOM_MUSIC1 = getRandomMusic("./songs/*");
    $RANDOM_MUSIC2 = getRandomMusic("./songs/*");

    if(isset($_GET["_rm"]) && $_GET["_rm"] == 1){
        echo $RANDOM_MUSIC1;
        exit();
    }

    if(isset($_GET["rm"]) && $_GET["rm"] == 1){
        header("Location: ?m={$RANDOM_MUSIC1}");
    }
