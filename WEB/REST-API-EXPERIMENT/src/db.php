<?php
    namespace src;

    use InvalidArgumentException;
    use PDO;
    use PDOException;
    use PDOStatement;

    class Db
    {
        /** @var PDO $instance */
        protected static $instance = null;
        protected static $db_host = null;
        protected static $db_user = null;
        protected static $db_pass = null;
        protected static $db_name = null;

        final private function __construct() {}
        final private function __clone() {}

        /**
         * @param string $s
         * @param string $u
         * @param string $p
         * @param string $d
         * @return PDO
         */
        public static function instance($s=null, $u=null, $p=null, $d=null) {
            if (self::$instance === null) {
                if(!is_null($s) && !is_null($u) && !is_null($p) && !is_null($d)){
                    self::$db_host = $s;
                    self::$db_user = $u;
                    self::$db_pass = $p;
                    self::$db_name = $d;
                }

                try {
                    self::$instance = new PDO(
                        'mysql:host=' . self::$db_host . ';dbname=' . self::$db_name,
                        self::$db_user,
                        self::$db_pass
                    );
                    self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                } catch (PDOException $e) {
                    die('Database connection could not be established.');
                }
            }

            return self::$instance;
        }

        public static function getDbName(){
            if(self::$instance !== null){
                /** @var PDOStatement $stmt */
                $stmt = self::$instance->query("select database() as db;");
                $db = $stmt->fetch(PDO::FETCH_ASSOC);

                if(count($db) === 1 && array_key_exists("db", $db)){
                    return $db["db"];
                }
            }

            return null;
        }

        /**
         * @return PDOStatement
         */
        public static function q($query) {
            if (func_num_args() == 1) {
                return self::instance()->query($query);
            }

            $args = func_get_args();
            return self::instance()->query(self::autoQuote(array_shift($args), $args));
        }

        public static function x($query) {
            if (func_num_args() == 1) {
                return self::instance()->exec($query);
            }

            $args = func_get_args();
            return self::instance()->exec(self::autoQuote(array_shift($args), $args));
        }

        public static function autoQuote($query, array $args) {
            $i = strlen($query) - 1;
            $c = count($args);

            while ($i--) {
                if ('?' === $query[$i] && false !== $type = strpos('sia', $query[$i + 1])) {
                    if (--$c < 0) {
                        throw new InvalidArgumentException('Too little parameters.');
                    }

                    if (0 === $type) {
                        $replace = self::instance()->quote($args[$c]);
                    } elseif (1 === $type) {
                        $replace = intval($args[$c]);
                    } elseif (2 === $type) {
                        foreach ($args[$c] as &$value) {
                            $value = self::instance()->quote($value);
                        }
                        $replace = '(' . implode(',', $args[$c]) . ')';
                    }

                    $query = substr_replace($query, $replace, $i, 2);
                }
            }

            if ($c > 0) {
                throw new InvalidArgumentException('Too many parameters.');
            }

            return $query;
        }

        public static function __callStatic($method, $args) {
            return call_user_func_array(array(self::instance(), $method), $args);
        }
    }