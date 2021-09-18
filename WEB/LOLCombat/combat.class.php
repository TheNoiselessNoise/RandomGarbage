<?php
    class Champion {
        public function __construct($name, $class, $stats, $icon){
            $this->name = $name;
            $this->class = $class;
            $this->stats = $stats;
            $this->icon = $icon;
        }
    }

    class CombatSystem {
        public function __construct(){
            $this->json = "champions.json";
            $this->champions = json_decode(file_get_contents($this->json));
            $this->allowedStats = [
                "hp", "mp", "armor", "attackdamage"
            ];
            $this->currentChampion = null;
            $this->enemyChampion = null;
        }

        public function getName() {
            $form = "<div id='wrap'><form method='post'>
                        <h3>Combat System</h3>
                        <input type='text' name='username' id='username' placeholder='username...'>
                        <input type='submit' value='Start' disabled>
                    </form></div>";
            echo $form;
        }

        public function cleanName($name){
            $name = str_replace(' ', '_', $name);
            return preg_replace('/[^A-Za-z0-9\-]/', '', $name);
        }

        public function pickRandomChampion($name=null, $stats=[]) : Champion {
            $champion = $this->champions[round(rand(0, count($this->champions) - 1))];
            $name = ($name != null) ? $name . " ({$champion->name})" : $champion->name . " - " . $champion->title;
            $class = implode(" / ", $champion->tags);
            foreach(get_object_vars($champion->stats) as $stat=>$value){
                if(in_array($stat, $this->allowedStats)){
                    $stats[$stat] = $value;
                }
            }
            $icon = $champion->icon;
            return new Champion($name, $class, $stats, $icon);
        }

        public function render($champ, $check=false) : string {
            $hp = $champ->stats["hp"];
            $mp = $champ->stats["mp"];
            $armor = $champ->stats["armor"];
            return "<div id='champ' class='" . ($check ? "player" : "enemy") . "'>
                        <h3>" . ($check ? "YOU" : "ENEMY") . "</h3>
                        <span id='action'>" . ($check ? "A!" : "S!") . "</span>
                        <span>{$champ->name}</span>
                        <span>{$champ->class}</span>
                        <img src='{$champ->icon}' alt=''>
                        
                        <progress value='{$armor}' max='{$armor}' id='armor' data-label='{$armor}'></progress>
                        <progress value='{$hp}' max='{$hp}' id='hp' data-label='{$hp}'></progress>
                        <div id='inventory'></div>
                    </div>";
        }

        public function getScript() {
            if($this->currentChampion == null || $this->enemyChampion == null){
                return "";
            }

            $script = "<script>";
            $champions = [$this->currentChampion, $this->enemyChampion];

            $i = true;
            foreach($champions as $champion){
                $stats = "{";
                foreach($champion->stats as $name=>$value){
                    if(end($champion->stats) == $name){
                        $stats .= "{$name}: {$value}";
                    } else {
                        $stats .= "{$name}: {$value},";
                    }
                }
                $stats .= "}";
                $script .= $i ? "let currentChampion = new Champion({$stats});" : "let enemyChampion = new Champion({$stats});";
                $i = !$i;
            }
            echo $script . "</script>";
        }

        public function start($name) {
            $this->currentChampion = $this->pickRandomChampion($this->cleanName($name));
            $this->enemyChampion = $this->pickRandomChampion();

            while($this->enemyChampion === $this->currentChampion){
                $this->enemyChampion = $this->pickRandomChampion();
            }

            $split = "<div id='split'></div>";
            echo $this->render($this->currentChampion, true) . $split . $this->render($this->enemyChampion);
        }
    }