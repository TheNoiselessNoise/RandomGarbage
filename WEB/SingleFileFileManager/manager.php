<?php
    $current_file = basename(__FILE__);
    $base_path = ".";

    if(isset($_GET["delete"])){
        $fname = $_GET["delete"];
        $bpath = $_GET["path"];
        unlink("{$bpath}/{$fname}");
        header("Location: {$current_file}?path={$bpath}");
    }

    if(isset($_POST["folderName"])){
        $bpath = $_POST["path"];
        $folderName = $_POST["folderName"];
        mkdir("{$bpath}/{$folderName}", 0777);
        header("Location: {$current_file}?path={$bpath}");
    }
    
    if(isset($_FILES["file"])){
        $bpath = $_POST["path"];
        $fname = $_FILES["file"]["name"];
        move_uploaded_file($_FILES["file"]["tmp_name"], "{$bpath}/{$fname}");

        header("Location: {$current_file}?path={$bpath}");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PHP File Manager</title>
    <style>
        * {
            padding: 0;
            margin: 0;
            font-size: calc(1.5vw + 1.5vh);
        }

        table {
            margin: 3em auto 0 auto;
        }

        table, tr, th, td {
            border: 1px solid #000;
            border-collapse: collapse;
            text-align: center;
        }

        th {
            background: dodgerblue;
        }

        th, td {
            padding: .5em;
        }

        a {
            color: dodgerblue;
            font-weight: bold;
        }
    </style>
    <script src="jquery.min.js"></script>
    <script>
        $(document).ready(() => {
            $("#file").change(() => {
                $("#file").parent().submit()
            })
        })
    </script>
</head>
<body>
<?php
    if(isset($_GET["path"]) && file_exists($_GET["path"])){
        $path = $_GET["path"];
    } else {
        $path = $base_path;
    }

    $files = glob("{$path}/*");

    $html = "<table>
                <tr>
                    <th>FILENAME</th>
                    <th>FILETYPE</th>
                    <th>FILSIZE</th>
                    <th>SHOW</th>
                    <th>DOWNLOAD</th>
                    <th>DELETE</th>
                </tr>";

    if($base_path != $path){
        $back_path = implode("/", array_slice(explode("/", $path), 0, -1));
        $html .= "<tr>
                    <td><a href='{$current_file}?path={$back_path}'>BACK</a></td>
                    <td>-----</td>
                    <td>-----</td>
                    <td>-----</td>
                    <td>-----</td>
                </tr>";
    }

    foreach($files as $file){
        $filename = pathinfo($file, PATHINFO_BASENAME);
        $filetype = is_dir($file) ? "FOLDER" : "FILE";
        $filesize = filesize($file);

        $html .= "<tr>";
        if(is_dir($file)){
            $html .= "<td><a href='{$current_file}?path={$path}/{$filename}'>{$filename}</a></td>";
        } else {
            $html .= "<td>{$filename}</td>";
        }
        $html .= "<td>{$filetype}</td>";
        $html .= !is_dir($file) ? "<td>{$filesize} bytes</td>" : "<td>-----</td>";
        $html .= !is_dir($file) ? "<td><a href='{$path}/{$filename}'>SHOW</a></td>" : "<td>-----</td>";
        $html .= !is_dir($file) ? "<td><a href='{$path}/{$filename}' download>DOWNLOAD</a></td>" : "<td>-----</td>";
        $html .= !is_dir($file) ? "<td><a href='{$current_file}?path={$path}&delete={$filename}'>DELETE</a></td>" : "<td>-----</td>";
        $html .= "</tr>";
    }

    // create folder
    $html .= "<tr>
                <form method='post'>
                    <td colspan='2'>CREATE FOLDER</td>
                    <td colspan='2'>
                        <input type='hidden' name='path' value='{$path}'>
                        <input type='text' name='folderName' id='folderName' placeholder='folder name...'>
                    </td>
                    <td colspan='1'>
                        <input type='submit' value='Create'>
                    </td>
                </form>
            </tr>";

    // upload
    $html .= "<tr>
                <form enctype='multipart/form-data' method='post'>
                    <td colspan='2'>UPLOAD FILE</td>
                    <td colspan='3'>
                        <input type='hidden' name='path' value='{$path}'>
                        <input type='file' name='file' id='file'>
                    </td>
                </form>
            </tr>";

    echo $html . "</table>";
?>
</body>
</html>
