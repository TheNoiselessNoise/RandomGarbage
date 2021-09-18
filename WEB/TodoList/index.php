<?php
    $SERVER = "localhost";
    $USER = "root";
    $PASS = "";
    $DB = "todo_list";

    $c = new PDO("mysql:host={$SERVER};dbname={$DB}", $USER, $PASS);
    $c->query("SET NAMES utf8");

    function isreqed($req, $key, $eq=null){
        $isReqed = isset($req[$key]) && !empty($req[$key]);

        if(!is_null($eq)){
            return $isReqed && $req[$key] === $eq;
        }

        return $isReqed;
    }

    function isposted($key, $eq=null){
        return isreqed($_POST, $key, $eq);
    }

    function isgeted($key, $eq=null){
        return isreqed($_GET, $key, $eq);
    }

    function get_current_priority($id){
        global $c;

        $current_priority_stmt = $c->prepare("SELECT priority_id FROM tasks WHERE id = ?");
        $current_priority_stmt->bindParam(1, $id, PDO::PARAM_INT);
        $current_priority_stmt->execute();

        if($current_priority_stmt){
            return intval($current_priority_stmt->fetch()["priority_id"]);
        }

        return null;
    }

    if(isgeted("add", "1") && isposted("name") && isposted("priority")){
        $name = $_POST["name"];
        $priority = intval($_POST["priority"]);

        $stmt = $c->prepare("INSERT INTO tasks VALUES(NULL, ?, ?)");
        $stmt->bindParam(1, $name, PDO::PARAM_STR);
        $stmt->bindParam(2, $priority, PDO::PARAM_INT);
        $stmt->execute();
        header("Location: " . basename(__FILE__));
        exit();
    }

    if(isgeted("rename", "1") && isgeted("UID") && isposted("data")){
        $uid = intval($_GET["UID"]);
        $rename_data = $_POST["data"];

        $stmt = $c->prepare("UPDATE tasks SET title = ? WHERE id = ?");
        $stmt->bindParam(1, $rename_data, PDO::PARAM_STR);
        $stmt->bindParam(2, $uid, PDO::PARAM_INT);
        $stmt->execute();
        exit();
    }

    if(isgeted("delete", "1") && isgeted("UID")){
        $uid = intval($_GET["UID"]);

        $stmt = $c->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->bindParam(1, $uid, PDO::PARAM_INT);
        $stmt->execute();
        exit();
    }

    if(isgeted("up", "1") && isgeted("UID")){
        $uid = intval($_GET["UID"]);
        $max_priority = intval($c->query("SELECT id FROM priorities ORDER BY id DESC")->fetch()["id"]);
        $current_priority = get_current_priority($uid);

        if($current_priority < $max_priority){
            $current_priority++;

            $stmt = $c->prepare("UPDATE tasks SET priority_id = ? WHERE id = ?");
            $stmt->bindParam(1, $current_priority, PDO::PARAM_INT);
            $stmt->bindParam(2, $uid, PDO::PARAM_INT);
            $stmt->execute();
        }

        exit();
    }

    if(isgeted("down", "1") && isgeted("UID")){
        $uid = intval($_GET["UID"]);
        $min_priority = intval($c->query("SELECT id FROM priorities ORDER BY id ASC")->fetch()["id"]);
        $current_priority = get_current_priority($uid);

        if($current_priority > $min_priority){
            $current_priority--;

            $stmt = $c->prepare("UPDATE tasks SET priority_id = ? WHERE id = ?");
            $stmt->bindParam(1, $current_priority, PDO::PARAM_INT);
            $stmt->bindParam(2, $uid, PDO::PARAM_INT);
            $stmt->execute();
        }

        exit();
    }

    function getPriorityOptions(){
        global $c;

        $data = "";
        $pri = $c->query("SELECT * FROM priorities");
        while($r = $pri->fetch(PDO::FETCH_ASSOC)){
            $id = $r["id"];
            $name = $r["priority"];
            $data .= "<option value='{$id}'>{$name}</option>";
        }

        return $data;
    }

    function getData(){
        global $c;

        $data = "";
        $ret = $c->query("SELECT *, tasks.id as UID FROM tasks
                      JOIN priorities ON priorities.id = tasks.priority_id 
                      ORDER BY priority_id DESC");
        while($r = $ret->fetch(PDO::FETCH_ASSOC)){
            $uid = $r["UID"];
            $color = $r["color"];
            $title = $r["title"];

            $data .= "
                    <div class='task {$color}'>
                        <span class='title'>{$title}</span>
                        
                        <a href='javascript:void(0)' class='icon' onclick='doRequest(\"?up=1&UID={$uid}\")'>+1</a>
                        <a href='javascript:void(0)' class='icon' onclick='doRequest(\"?down=1&UID={$uid}\")'>-1</a>
                        <a href='javascript:void(0)' class='icon' onclick='doRequest(\"?rename=1&UID={$uid}\", \"prompt_rename\", this.parentNode.querySelector(\".title\"))'>Rename</a>
                        <a href='javascript:void(0)' class='icon' onclick='doRequest(\"?delete=1&UID={$uid}\")'>Delete</a>
                    </div>";
        }

        return $data;
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>TodoList</title>
    <link rel="stylesheet" href="main.css">
    <script src="jquery.min.js" type="text/javascript"></script>
</head>
<body>
    <div id="todolist">
        <h2>TODO List</h2>

        <form action="?add=1" id="add" method='POST'>
            <input type='text' name='name' placeholder='New task...'>
            <select name="priority">
                <option value="1" selected>--- PRIORITY ---</option>
                <?php
                    echo getPriorityOptions();
                ?>
            </select>
            <input type='submit' value='ADD'>
        </form>

        <?php
            echo getData();
        ?>
    </div>
    <script>
        function doRequest(path, flag, other=null){
            let additional_data = {};
            let canSend = true;

            if(flag === "prompt_rename"){
                let autofill = "";

                if(other instanceof HTMLElement){
                    autofill = other.textContent;
                }

                let user_prompt = prompt("Write new title of a task: ", autofill);

                if(user_prompt){
                    additional_data.data = user_prompt;
                } else {
                    canSend = false;
                }
            }

            if(canSend){
                $.post(path, additional_data, function(){
                    window.location = window.location;
                });
            }
        }
    </script>
</body>
</html>