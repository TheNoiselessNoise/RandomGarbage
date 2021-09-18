<?php
    // TODO: Save uploaded profile pictures as base64 to database
    // TODO: Administration

    if(!isset($_SESSION)) session_start();
    $allowed_pages = ["login", "register", "account", "logout", "addTopic", "addPost", "addComment", "admin"];
    $db = new mysqli("localhost", "root", "", "forum");

    function getResult($sql, $key=null, $justExec=false, $retArray=true){
        global $db;
        $r = $db->prepare($sql);
        $r->execute();

        if($justExec) return;
        if($retArray) return $r->get_result()->fetch_all(MYSQLI_ASSOC);
        else if(!is_null($key)) return $r->get_result()->fetch_all(MYSQLI_ASSOC)[0][$key];
    }

    function parseRequests($req){
        global $db;

        if(count($req) == 0) return;
        $date = date("Y/m/d");

        if(isset($req["l_username"]) and isset($req["l_password"])){
            // LOGIN
            $username = $db->real_escape_string($req["l_username"]);
            $password = $db->real_escape_string($req["l_password"]);
            $login = getResult("SELECT * FROM users WHERE username = '{$username}'");

            if(count($login) == 0 and preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $username)) {
                header("Location: ?page=login");
            }

            $login = $login[0];

            if(password_verify($password, $login["password"])){
                $_SESSION["id"] = $login["id"];
                $_SESSION["username"] = $login["username"];
                $_SESSION["date"] = $login["date"];
                $_SESSION["isAdmin"] = $login["isAdmin"];
            }

            header("Location: ?page=login");
        }
        
        if(isset($req["r_username"]) and isset($req["r_password"]) and isset($req["r_password_check"])){
            // REGISTER
            $username = $db->real_escape_string($req["r_username"]);
            $password = $db->real_escape_string($req["r_password"]);
            $password_check = $db->real_escape_string($req["r_password_check"]);

            if(count(getResult("SELECT * FROM users WHERE username = '{$username}'")) == 0
               and $password === $password_check and !preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $username)){
                $newpass = password_hash($password, PASSWORD_BCRYPT);
                getResult("INSERT INTO users VALUES(NULL,
                                                    '{$username}',
                                                    '{$newpass}',
                                                    '{$date}',
                                                    0)", null, true);
                header("Location: ?page=login");                
            } else {
                header("Location: ?page=register");
            }
        }
        
        if(isset($req["passold"]) and isset($req["passnew"]) and isset($req["passnew_check"])){
            $oldpass = $db->real_escape_string($req["passold"]);
            $newpass = $db->real_escape_string($req["passnew"]);
            $newpasscheck = $db->real_escape_string($req["passnew_check"]);

            $oldpassDB = getResult("SELECT * FROM users WHERE id = " . $_SESSION["id"], "password", false, false);
            if($newpass === $newpasscheck and password_verify($oldpass, $oldpassDB)){
                $newhash = password_hash($newpass, PASSWORD_BCRYPT);
                getResult("UPDATE users
                           SET password = '{$newhash}'
                           WHERE id = " . $_SESSION["id"], null, true);
            }

            header("Location: ?page=account");
        }

        if(isset($req["topic_title"])){
            $title = $db->real_escape_string($req["topic_title"]);
            $check = getResult("SELECT * FROM topics WHERE title = '{$title}'");
            $user_id = $_SESSION["id"];

            if(count($check) == 0){
                getResult("INSERT INTO topics VALUES(NULL,
                                                     '{$title}',
                                                     '{$date}',
                                                     '{$user_id}')", null, true);

                $new_id = getResult("SELECT * FROM topics ORDER BY id DESC LIMIT 1", "id", false, false);
                header("Location: " . basename(__FILE__) . "?tid={$new_id}");
            } else {
                header("Location: " . basename(__FILE__));
            }
        }

        if(isset($req["post_tid"]) and isset($req["post_title"]) and isset($req["post_text"])){
            $post_tid = $db->real_escape_string($req["post_tid"]);
            $post_title = $db->real_escape_string($req["post_title"]);
            $post_text = htmlspecialchars($db->real_escape_string($req["post_text"]));
            $user_id = $_SESSION["id"];

            getResult("INSERT INTO posts VALUES(NULL,
                                                '{$post_title}',
                                                '{$post_text}',
                                                '{$post_tid}',
                                                '{$date}',
                                                '{$user_id}')", null, true);
            $new_id = getResult("SELECT * FROM posts ORDER BY id DESC LIMIT 1", "id", false, false);
            header("Location: " . basename(__FILE__) . "?tid={$post_tid}&pid={$new_id}");
        }
        
        if(isset($req["comm_tid"]) and isset($req["comm_pid"]) and isset($req["comm_text"])){
            $comm_tid = $db->real_escape_string($req["comm_tid"]);
            $comm_pid = $db->real_escape_string($req["comm_pid"]);
            $comm_text = htmlspecialchars($db->real_escape_string($req["comm_text"]));
            $user_id = $_SESSION["id"];

            getResult("INSERT INTO comments VALUES(NULL,
                                                   '{$comm_text}',
                                                   '{$date}',
                                                   '{$comm_pid}',
                                                   '{$user_id}')", null, true);
            header("Location: " . basename(__FILE__) . "?tid={$comm_tid}&pid={$comm_pid}");
        }
    }

    function parseFiles($files){
        if(count($files) == 0) return;
        if(isset($files["image"])){
            $get_ext = basename($files["image"]["name"]);
            $targetfile = "user_images/" . $_SESSION["username"] . ".png";

            $fileType = strtolower(pathinfo($get_ext, PATHINFO_EXTENSION));
            if($fileType == "png"){
                move_uploaded_file($files["image"]["tmp_name"], $targetfile);
            }
            header("Location: " . basename(__FILE__) . "?page=account");
        }
    }

    //var_dump(getResult("SELECT * FROM users WHERE username = 'admin'", "username", false, false)); // "admin"
    //var_dump(getResult("SELECT * FROM users WHERE username = 'admin'")); // array of rows

    // tid = id téma (topic id)
    $tid = (isset($_GET["tid"]) and is_numeric($_GET["tid"])) ? $_GET["tid"] : null;
    // pid = id příspěvku (post id)
    $pid = (isset($_GET["pid"]) and is_numeric($_GET["pid"])) ? $_GET["pid"] : null;
    // uid = id přihlášeného uživatele
    $uid = isset($_SESSION["id"]) ? $_SESSION["id"] : null;
    // uuid = id uživatele
    $uuid = isset($_GET["uuid"]) ? $_GET["uuid"] : null;
    // page = current page
    $page = (isset($_GET["page"]) and in_array($_GET["page"], $allowed_pages)) ? $_GET["page"] : null;

    parseFiles($_FILES);
    parseRequests($_POST);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>SingleFileForum</title>
    <link rel="stylesheet" href="main.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script>
        $(document).ready(function(){
            $("#settings").click(function(){
                $("#settingsForm").toggleClass("closed")
            })
        })
    </script>
</head>
<body>
    <?php
        if(isset($_SESSION["username"])){
            // NAVBAR
            $nav = "<nav>
                        <a href='" . basename(__FILE__) . "'>TOPICS</a>
                        <a href='" . basename(__FILE__) . "?page=account'>ACCOUNT</a>";
            if($_SESSION["isAdmin"]) $nav .= "<a href='" . basename(__FILE__) . "?page=admin'>ADMINISTRATION</a>";
            echo $nav . "<a href='" . basename(__FILE__) . "?page=logout'>LOGOUT</a></nav>";

            if(!is_null($tid) and !is_null($pid) and is_null($page)){
                $current_post = getResult("SELECT * FROM posts WHERE id = {$pid}")[0];
                $post_title = $current_post["title"];
                $post_text = $current_post["text"];
                $post_date = $current_post["date"];
                echo "<wr-ap><h3>{$post_title} [{$post_date}]</h3>
                            <p>{$post_text}</p></wr-ap>";

                $comments = "<wr-ap><h3>Comments</h3>
                             <a href='" . basename(__FILE__) . "?tid={$tid}&pid={$pid}&page=addComment'>&#43;</a>";
                $current_comments = getResult("SELECT *,comments.date AS cDate FROM comments
                                               JOIN users ON comments.user_id = users.id
                                               WHERE comments.post_id = {$pid}
                                               ORDER BY comments.date DESC");
                if(count($current_comments) > 0){
                    foreach($current_comments as $comment){
                        $comment_uid = $comment["user_id"];
                        $comment_user = $comment["username"];
                        $comment_text = htmlspecialchars($comment["text"]);
                        $comments .= "<div>
                                        <a href='" . basename(__FILE__) . "?uuid={$comment_uid}&page=account'>{$comment_user}</a>
                                        <span>{$comment_text}</span>
                                      </div>";
                    }
                } else { $comments .= "<div><a href='#'>NO COMMENTS FOUND</a></div>"; }

                echo $comments . "</wr-ap>";
            } else if(!is_null($tid) and is_null($page)){ // SHOW POSTS IN TOPIC
                $posts = getResult("SELECT * FROM posts WHERE topic_id = {$tid}");
                $topic_name = getResult("SELECT * FROM topics WHERE id = {$tid}", "title", false, false);
                $posts_ret = "<wr-ap>
                                <h3>POSTS OF '{$topic_name}'</h3>
                                <a href='" . basename(__FILE__) . "?tid={$tid}&page=addPost'>&#43;</a>";
                if(count($posts) > 0){
                    foreach($posts as $post){
                        $post_id = $post["id"];
                        $post_title = $post["title"];
                        $posts_ret .= "<a href='" . basename(__FILE__) . "?tid={$tid}&pid={$post_id}'>{$post_title}</a>";
                    }
                } else { $posts_ret .= "<a href='#'>NO POSTS FOUND</a>"; }
                echo $posts_ret . "</wr-ap>";
            } else {
                if($page == "account"){
                    $uuid = !is_null($uuid) ? $uuid : $_SESSION["id"];

                    $user = getResult("SELECT * FROM users WHERE id = {$uuid}")[0];
                    $user_name = $user["username"];
                    $user_isAdmin = $user["isAdmin"];
                    $user_date = $user["date"];
                    $user_type = $user_isAdmin ? "Admin" : "User";

                    $image_path = file_exists("user_images/{$user_name}.png") ? "user_images/{$user_name}.png" : "user_images/default.png";

                    echo "<acc-ount>
                            <div id='settings'>&#9881;</div>
                            <img src='{$image_path}'>
                            <h3>{$user_name}</h3>
                            <h4>Creation date: {$user_date}</h4>
                            <h4>Type: {$user_type}</h4>
                          </acc-ount>
                          <form id='settingsForm' class='closed' method='POST' enctype='multipart/form-data'>
                            <h3>SETTINGS</h3>
                            <label for='image'>PNG Image:
                                <input type='file' name='image' id='image'>
                            </label>

                            <input type='password' name='passold' placeholder='Old password'>
                            <input type='password' name='passnew' placeholder='New password'>
                            <input type='password' name='passnew_check' placeholder='New password again'>
                            <input type='submit' value='Update'>

                          </form>";

                    $created_topics = getResult("SELECT * FROM topics WHERE user_id = {$uuid} ORDER BY date DESC");   
                    $created_posts = getResult("SELECT * FROM posts WHERE user_id = {$uuid} ORDER BY date DESC");   
                    $created_comms = getResult("SELECT *,comments.text AS cText FROM comments JOIN posts ON comments.post_id = posts.id WHERE comments.user_id = {$uuid} ORDER BY comments.date DESC");
                    if(count($created_topics) > 0){ 
                        $topics = "<wr-ap><h3>Created Topics</h3>";
                        foreach($created_topics as $topic){
                            $topic_id = $topic["id"];
                            $topic_title = $topic["title"];
                            $topics .= "<a href='" . basename(__FILE__) . "?tid={$topic_id}'>{$topic_title}</a>";
                        }
                        echo $topics . "</wr-ap>";
                    }
                    if(count($created_posts) > 0){ 
                        $posts = "<wr-ap><h3>Created Posts</h3>";
                        foreach($created_posts as $post){
                            $post_id = $post["id"];
                            $post_title = $post["title"];
                            $post_tid = $post["topic_id"];
                            $posts .= "<a href='" . basename(__FILE__) . "?tid={$post_tid}&pid={$post_id}'>{$post_title}</a>";
                        }
                        echo $posts . "</wr-ap>";
                    }
                    if(count($created_comms) > 0){ 
                        $comments = "<wr-ap><h3>Comments</h3>";
                        foreach($created_comms as $comment){
                            $comment_tid = $comment["topic_id"];
                            $comment_pid = $comment["post_id"];
                            $comment_text = $comment["cText"];
                            $comments .= "<a href='" . basename(__FILE__) . "?tid={$comment_tid}&pid={$comment_pid}'>{$comment_text}</a>";
                        }
                        echo $comments . "</wr-ap>";
                    }
                } else if($page == "logout"){
                    session_destroy();
                    header("Location: " . basename(__FILE__) . "?page=login");
                } else if($page == "addTopic"){
                    echo "<div id='form-wrap'><form method='POST'>
                            <h3>ADD TOPIC</h3>
                            <input type='text' name='topic_title' placeholder='Title'>
                            <input type='submit' value='Add'>
                          </form></div>";
                } else if($page == "addPost"){
                    echo "<div id='form-wrap'><form id='addPost' method='POST'>
                            <h3>ADD POST</h3>
                            <input type='hidden' name='post_tid' value='{$tid}'>
                            <input type='text' name='post_title' placeholder='Title'>
                            <textarea form='addPost' name='post_text' placeholder='Text'></textarea>
                            <input type='submit' value='Add'>
                          </form></div>";
                } else if($page == "addComment"){
                    echo "<div id='form-wrap'><form id='addComment' method='POST'>
                            <h3>ADD COMMENT</h3>
                            <input type='hidden' name='comm_tid' value='{$tid}'>
                            <input type='hidden' name='comm_pid' value='{$pid}'>
                            <textarea form='addComment' name='comm_text' placeholder='Text'></textarea>
                            <input type='submit' value='Add'>
                          </form></div>";
                } else if($page == "admin"){
                    // TABLE OF TOPICS
                    echo "here lies something";
                    // TABLE OF POSTS
                    // th - TITLE OF TOPIC
                } else { // SHOW TOPICS
                    $topics = getResult("SELECT * FROM topics");
                    $topics_ret = "<wr-ap>
                                    <h3>TOPICS</h3>
                                    <a href='" . basename(__FILE__) . "?page=addTopic'>&#43;</a>";
                    foreach($topics as $topic){
                        $topic_id = $topic["id"];
                        $topic_title = $topic["title"];
                        $topics_ret .= "<a href='" . basename(__FILE__) . "?tid={$topic_id}'>{$topic_title}</a>";
                    }
                    echo $topics_ret . "</wr-ap>";
                }
            }
        } else { // SHOW LOGIN/REGISTER
            if($page == "login"){
                echo "<div id='form-wrap'><form method='POST'>
                        <h3>LOGIN</h3>
                        <input type='text' name='l_username' placeholder='Username'>
                        <input type='password' name='l_password' placeholder='Password'>
                        <input type='submit' value='Login'>
                        <a href='" . basename(__FILE__) . "?page=register'>DO YOU NEED TO REGISTER?</a>
                      </form></div>";
            } else if($page == "register"){
                echo "<div id='form-wrap'><form method='POST'>
                        <h3>REGISTER</h3>
                        <input type='text' name='r_username' placeholder='Username'>
                        <input type='password' name='r_password' placeholder='Password'>
                        <input type='password' name='r_password_check' placeholder='Password again'>
                        <input type='submit' value='Register'>
                        <a href='" . basename(__FILE__) . "?page=login'>DO YOU NEED TO LOGIN?</a>
                      </form></div>";
            } else {
                header("Location: " . basename(__FILE__) . "?page=login");
            }
        }
    ?>
</body>
</html>