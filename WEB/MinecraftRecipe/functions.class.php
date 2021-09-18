<?php
    $recipesDir = "./recipes"; // jsons
    $texturesDir = "./textures"; // pngs

    // Gets an array of objectified jsons of recipes
    function getAllRecipes(){
        global $recipesDir;

        $recipes = [];
        foreach(glob("{$recipesDir}/*.json") as $recipe){
            $pathinfo = pathinfo($recipe);
            $recipe_file = fopen($recipe, "r");
            $recipe_content = fread($recipe_file, filesize($recipe));
            $recipes[$pathinfo["filename"]] = json_decode($recipe_content);
        }

        return $recipes;
    }

    // Gets an array of locations to textures
    function getAllTextures(){
        global $texturesDir;

        $recipes = [];
        foreach(glob("{$texturesDir}/*.png") as $texture){
            $pathinfo = pathinfo($texture);
            $recipes[$pathinfo["filename"]] = $texture;
        }

        return $recipes;
    }

    function getRecipe($recipe){
        global $recipesDir;
        $found = glob("{$recipesDir}/{$recipe}.json");

        if(count($found)){
            $foundRecipe = $found[0];
            $pathinfo = pathinfo($foundRecipe);
            $recipe_file = fopen($foundRecipe, "r");
            $recipe_content = fread($recipe_file, filesize($foundRecipe));
            return [$pathinfo["filename"] => json_decode($recipe_content)];
        }
        return [];
    }

    function getTexture($texture){
        global $texturesDir;
        
        $name = explode(":", $texture)[1];
        $found = glob("{$texturesDir}/{$name}.png");

        if(count($found)){
            return $found[0];
        }
        return null;
    }