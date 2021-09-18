<?php
    class JQUERY {
        public static function InvokeCommand($element, $command, $argument){
            return "$('$element').$command('$argument')";
        }
    }

    class JS {
        public const DOCUMENT = 'document.';
        public const RANDOM_STRING_FUNCTION = "
            function generateRandomString(length = 8, allowedChars = '0123456789', id = ''){
                for(let i = 0; i < length; i++){
                    id += allowedChars[Math.round(Math.random() * (allowedChars.length - 1))];
                }
    
                return id;
            }
        ";

        public static function console($what){
            return "console.log($what);";
        }

        public static function incrementVariable($name, $value){
            return "$name += $value;";
        }

        public static function appendChild($to, $what){
            return "$to.appendChild($what);";
        }

        public static function expression($ex, $content){
            return "if($ex){{$content}}";
        }

        public static function eventCurrentTarget($variable = null){
            if($variable){
                return "var $variable = e.currentTarget;";
            }
            return 'e.currentTarget';
        }

        public static function createGlobalVariable($name = '', $value = ''){
            $name = $name ? $name : XDefaults::generateId(8, XDefaults::alphaLower, "global_");
            return "var $name = $value;";
        }

        public static function addEventListener($element_id = null, $type = 'click', $listener = '', $toVariable = false){
            if($toVariable){
                return "
                    $element_id.addEventListener('$type', function(e){
                        e.preventDefault();
                        $listener
                    })
                ";
            } else {
                $element_id = is_string($element_id) ? $element_id : '';
                $randomVariableName = XDefaults::generateId();
                return "
                    let element_$randomVariableName = ".self::getElementById($element_id).";
                    element_$randomVariableName.addEventListener('$type', function(e){
                        e.preventDefault();
                        $listener
                    })
                ";
            }
        }

        public static function createElement($element = 'div', $variable = null, $attributes = [], $options = []){
            if(is_null($variable)){
                return self::DOCUMENT . "createElement('$element')";
            }

            $final = "let $variable = " . self::DOCUMENT . "createElement('$element');";
            foreach($attributes as $name => $value){
                $final .= PHP_EOL . "$variable.setAttribute('$name', $value);";
            }

            foreach($options as $name => $value){
                $final .= PHP_EOL . "$variable.$name = $value;";
            }

            return $final;
        }

        public static function getElementsByTagName(){
            return self::DOCUMENT . 'getElementsByTagName';
        }

        public static function getElementById($id = null, $variable = null){
            if(is_null($variable)){
                return self::DOCUMENT . 'getElementById("' . (is_string($id) || is_int($id) ? $id : '') . '")';
            }
            return "let $variable = " . self::DOCUMENT . 'getElementById("' . (is_string($id) || is_int($id) ? $id : '') . '");';
        }

        public static function getRandomOrderNumber(){
            return XDefaults::generateId();
        }
    }

    class XDefaults {
        public const selfEndingTags = ["area","base","br","embed","hr","iframe","img","input","link","meta","param","source","track"];
        public const alphaLower = "abcdefghijklmnopqrstuvwxyz";
        public const alphaUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        public const numeric = "0123456789";
        public const onlyAlpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        public const allCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        public static function generateId($length = 8, $allowedChars = self::numeric, $id = ""){
            for($i = 0; $i < $length; $i++){
                $id .= $allowedChars[rand(0, strlen($allowedChars) - 1)];
            }

            return $id;
        }

        private static function getDefaultInputAttributes($type, $id, $defaultAttributes = []){
            switch($type){
                case 'select':
                    $attributes = [
                        "name" => $id,
                        "id" => $id
                    ];
                    break;
                case 'date':
                case 'password':
                case 'hidden':
                case 'number':
                case 'text':
                    $attributes = [
                        "type" => $type,
                        "name" => $id,
                        "id" => $id
                    ];
                    break;
                case 'submit':
                    $attributes = [
                        "type" => $type,
                    ];
                    break;
                default:
                    $attributes = [];
                    break;
            }

            foreach($defaultAttributes as $a_name => $a_value){
                $attributes[$a_name] = $a_value;
            }

            return $attributes;
        }

        public static function createTable($attributes = [], $rows = [], $options = []){
            $final_rows = [];
            foreach($rows as $index => $row){
                $final_cols = [];

                foreach($row as $col){
                    $col_tag = !isset($options["noHeaders"]) && $index === 0 ? "th" : "td";
                    $final_cols[] = self::createTag($col_tag, [], [
                        "text" => $col
                    ]);
                }

                $final_rows[] = self::createTag("tr", [], [
                    "text" => self::concat($final_cols)
                ]);
            }

            $options["text"] = self::concat($final_rows);
            return self::createTag("table", $attributes, $options);
        }

        public static function createInput($type = 'text', $attributes = [], $id = null, $label = null){
            $id = $id ? $id : $type . '_' . self::generateId();

            $default_attributes = self::getDefaultInputAttributes($type, $id, $attributes);

            $input = self::createTag("input", $default_attributes);
            if(!is_null($label)){
                $input = self::createTag("label", [
                    "for" => $id
                ], ["text" => $label . $input]);
            }

            return $input;
        }

        public static function createSelect($attributes = [], $inputs = [], $options = [], $id = null, $label = null){
            $id = $id ? $id : 'select_' . self::generateId();

            $default_attributes = self::getDefaultInputAttributes("select", $id, $attributes);
            $attributes = self::arrayToString($default_attributes);

            $final = "<select " . $attributes . ">";
            foreach($inputs as $name => $value){
                if(is_array($value)){
                    $final .= "<option value='{$value[0]}' selected>{$name}</option>";
                } else {
                    $final .= "<option value='{$value}'>{$name}</option>";
                }
            }
            $final .= "</select>";

            if(!is_null($label)){
                $final = self::createTag("label", [
                    "for" => $id
                ], ["text" => $label . $final]);
            }

            return $final;
        }

        public static function createForm($attributes = [], $inputs = [], $options = []){
            $attributes = self::arrayToString($attributes);
            $form = "<form" . ($attributes ? " " . $attributes : "") . ">";

            foreach($inputs as $type => $attrs){
                $form .= self::createInput($type, $attrs, @$attrs["id"] ?? null, @$attrs["label"] ?? null);
            }

            $form .= '</form>';
            return $form;
        }

        public static function createTag($tag, $attributes = [], $options = []){
            $final = "<{$tag} " . self::arrayToString($attributes);

            if(self::isSelfEnding($tag)){
                $final .= "/>";
                return $final;
            }

            $final .= ">";
            $final .= @$options["value"] ?? @$options["text"];
            $final .= "</{$tag}>";
            return $final;
        }

        public static function arrayToString($array = [], $prefixJoiner = "='", $suffixJoiner = "'"){
            $array_of_parts = [];
            foreach($array as $name => $value){
                if(is_string($value)){
                    array_push($array_of_parts, $name . $prefixJoiner . $value . $suffixJoiner);
                }
            }

            return implode(" ", $array_of_parts);
        }

        public static function concat($elements = [], $glue = PHP_EOL){
            return implode($glue, $elements);
        }

        protected static function isSelfEnding($tag) {
            return in_array($tag, self::selfEndingTags);
        }
    }

    class XElement {

        public $tag;
        public $attributes;
        public $inputs;
        public $options;
        public $default;

        public function __construct(
            $tag = 'div',
            $attributes = [],
            $inputs = [],
            $options = [],
            $default = false
        ){
            $this->tag = $tag;
            $this->attributes = $attributes;
            $this->inputs = $inputs;
            $this->options = $options;
            $this->default = $default;
        }

        //<editor-fold desc="GETTERS AND SETTERS">
        public function getTag(): string
        {
            return $this->tag;
        }
        public function setTag(string $tag): void
        {
            $this->tag = $tag;
        }
        public function getAttributes(): array
        {
            return $this->attributes;
        }
        public function setAttributes(array $attributes): void
        {
            $this->attributes = $attributes;
        }
        public function getInputs(): array
        {
            return $this->inputs;
        }
        public function setInputs(array $inputs): void
        {
            $this->inputs = $inputs;
        }
        public function getOptions(): array
        {
            return $this->options;
        }
        public function setOptions(array $options): void
        {
            $this->options = $options;
        }
        public function getDefault(): bool
        {
            return $this->default;
        }
        public function setDefault(bool $default): void
        {
            $this->default = $default;
        }
        //</editor-fold>

        protected function isSelfEnding($tag) {
            return in_array($tag, XDefaults::selfEndingTags);
        }

        public function applyAttributes(){
            $final = '<' . $this->tag;

            if($this->getAttributes()){
                $attributes_render = ' ';
                foreach($this->getAttributes() as $name => $value){
                    if(is_string($value)){
                        $attributes_render .= $name . "='" . $value . "'";
                    } else if(is_array($value)){
                        $attributes_array = [];
                        foreach($value as $v_name => $v_value){
                            $push_it = is_string($v_value) ? $v_value : '';
                            array_push($attributes_array, "$v_name='$push_it'");
                        }
                        $attributes_render .= implode(" ", $attributes_array);
                    }
                }

                $final .= $attributes_render;
            }

            if($this->isSelfEnding($this->tag)){
                $final .= "/>";
            } else {
                $final .= ">";

                if(isset($this->options['textContent'])) {
                    $final .= $this->options['textContent'];
                }

                if(isset($this->options['innerHTML'])) {
                    $final .= $this->options['innerHTML'];
                }

                $final .= "</" . $this->tag . ">";
            }

            $this->setTag($final);
        }

        public function applyDefault(){
            switch($this->getTag()){
                case "div":
                    $this->setTag(XDefaults::createTag(
                        $this->getTag(),
                        $this->getAttributes(),
                        $this->getOptions()
                    ));
                    break;
                case "form":
                    $this->setTag(XDefaults::createForm(
                        $this->getAttributes(),
                        $this->getInputs(),
                        $this->getOptions()
                    ));
                    break;
                default:
                    break;
            }
        }

        public function render(){
            if($this->getDefault()){
                $this->applyDefault();
            } else {
                $this->applyAttributes();
                // $this->>applyStyles();
                // $this->applyOptions();
                // ..
            }

            echo $this->getTag();
        }
    }