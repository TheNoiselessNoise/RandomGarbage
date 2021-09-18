<?php
    namespace src\objects;

    use src\Api;
    use src\Db;

    require_once  __DIR__ . "/../db.php";
    require_once __DIR__ . "/../api.php";

    class apiObject {
        protected $db = null;
        protected $dbOpts = null;
        protected $_table_name = null;
        protected $_fields = null;
        protected $_allowed_fields = null;

        public function __construct($dbOpts) {
            $dbp = explode("|", $dbOpts);

            $this->db = Db::instance($dbp[0], $dbp[1], $dbp[2], $dbp[3]);
            $this->dbOpts = $dbOpts;
        }

        public function parseRequest($reqOmit, $reqType, $reqPath){
            if($_SERVER['REQUEST_METHOD'] === $reqType){
                $fullReq = $_SERVER["REQUEST_URI"];
                $fullReq = str_replace($reqOmit, '', $fullReq);
                $fullReq = substr($fullReq, 1);

                $reqPathParts = explode("/", $reqPath);
                $fullReqParts = explode("/", $fullReq);

                if(count($reqPathParts) === count($fullReqParts)){
                    $index = 0;

                    foreach($reqPathParts as $reqPathPart){
                        preg_match("/\{(.*?)\}/", $reqPathPart, $match);

                        if(count($match)){
                            $value = urldecode($fullReqParts[$index]);
                            return $this->getRequest($reqType, $match[1], $value);
                        }

                        $index++;
                    }
                }
            }

            return null;
        }

        public function getRequest($reqType, $field, $value){
            switch($reqType) {
                case "GET":
                    return $this->select($field, $value);
                    break;
                default:
                    return null;
                    break;
            }
        }

        protected function filter($result){
            if(is_array($result) && is_array($this->_allowed_fields) && count($this->_allowed_fields)){
                return array_intersect_key($result, array_flip($this->_allowed_fields));
            }

            return $result;
        }

        public function select($field, $value){
            if(in_array($field, $this->_fields)){
                /** @var \PDOStatement $stmt */
                $stmt = $this->db->query("SELECT * FROM {$this->_table_name} WHERE {$field} = '{$value}';");
                return $this->filter($stmt->fetch(\PDO::FETCH_ASSOC));
            }

            return null;
        }
    }