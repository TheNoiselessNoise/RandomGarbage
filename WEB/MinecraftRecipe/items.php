<?php
    require "functions.class.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minecraft Recipe List</title>
    <style>
        * {
            padding: 0;
            margin: 0;
        }

        /* SEARCH RECIPES */
        #wrapper {
            display: block;
            width: 50%;
            margin: 0 auto;
            text-align: center;
            background: #dadada;
            padding: 1em 0;
        }

        #wrapper a {
            text-decoration: none;
            display: inline-block;
            transform: scale(3);
            margin: 1em;
        }

        input[type='text'] {
            outline: none;
            display: block;
            width: 50%;
            box-sizing: border-box;
            margin: 0 auto;
            border: 0;
            background: #000;
            color: #FFF;
            text-align: center;
            padding: 1em 0;
        }

        /* CURRENT RECIPE */
        #wrapper_recipe #recipe_background {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(7);
        }

        #wrapper_recipe #result {
            position: absolute;
            top: 50%;
            left: 66.5%;
            transform: translate(-50%, -50%) scale(6);
        }
    </style>
    <script>
        window.addEventListener("DOMContentLoaded", function(){
            let search = document.getElementById('search');
            
            if(search){
                search.addEventListener('keyup', function(){
                    let linkImages = document.querySelectorAll('#wrapper a');

                    for(let img of linkImages){
                        img.style.display = 'inline-block';
                    }

                    for(let img of linkImages){
                        let lower = this.value.toLowerCase();
                        if(!img.href.includes(lower)){
                            img.style.display = "none";
                        }
                    }
                });
            }
        });
    </script>
</head>
<body>
    <?php
        /*
            object(stdClass)[1]
                public 'type' => string 'crafting_shaped' (length=15)
                public 'pattern' => 
                    array (size=3)
                    0 => string 'X' (length=1)
                    1 => string 'X' (length=1)
                    2 => string '#' (length=1)
                public 'key' => 
                    object(stdClass)[3]
                        public '#' => 
                            object(stdClass)[2]
                                public 'item' => string 'minecraft:stick' (length=15)
                        public 'X' => 
                            object(stdClass)[4]
                                public 'item' => string 'minecraft:diamond' (length=17)
                public 'result' => 
                    object(stdClass)[5]
                        public 'item' => string 'minecraft:diamond_sword' (length=23)
        */

        if(isset($_GET["recipe"])){
            // show recipe
            $html = "<div id='wrapper_recipe'>";

            $recipe = getRecipe($_GET["recipe"]);
            if(count($recipe)){
                $recipe = $recipe[$_GET["recipe"]];
                $html .= "<img src='recipe_background.png' id='recipe_background' alt=''/>";

                $result = getTexture($recipe->result->item);
                $html .= "<img src='$result' id='result' alt=''/>";

                var_dump($recipe);
            } else {
                $html .= "<h1>NO RECIPE FOUND</h1>";
            }

            echo $html . "</div>";
        } else {
            // show every craftable item
            $html = "<input type='text' id='search' placeholder='Search...'>
                     <div id='wrapper'>";

            foreach(getAllTextures() as $name => $path){
                $html .= "<a href='?recipe={$name}'>
                            <img src='{$path}' alt='{$name}' />
                        </a>";
            }

            echo $html . "</div>";
        }
    ?>
</body>
</html>