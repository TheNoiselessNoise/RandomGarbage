<html>
    <head>
        <title>Upload MP3</title>
    </head>
    <body>
        <?php

        try {

            // Undefined | Multiple Files | $_FILES Corruption Attack
            // If this request falls under any of them, treat it invalid.
            if (
                !isset($_FILES['upfile']['error']) ||
                is_array($_FILES['upfile']['error'])
            ) {
                throw new RuntimeException('Invalid parameters.');
            }

            // Check $_FILES['upfile']['error'] value.
            switch ($_FILES['upfile']['error']) {
                case UPLOAD_ERR_OK:
                    break;
                case UPLOAD_ERR_NO_FILE:
                    throw new RuntimeException('No file sent.');
                default:
                    throw new RuntimeException('Unknown errors.');
            }


            // DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
            // Check MIME Type by yourself.
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            if (false === $ext = array_search(
                $finfo->file($_FILES['upfile']['tmp_name']),
                array(
                    'jpg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'mp3' => 'audio/mp3',
                    'mp3' => 'audio/mpeg'
                ),
                true
            )) {
                throw new RuntimeException('Invalid file format.');
            }


            // You should name it uniquely.
            // DO NOT USE $_FILES['upfile']['name'] WITHOUT ANY VALIDATION !!
            // On this example, obtain safe unique name from its binary data.
            $name = preg_replace('/[^a-zA-Z0-9_.]/', '', $_FILES['upfile']['name']);
            if (!move_uploaded_file(
                $_FILES['upfile']['tmp_name'],
                './songs/' . $name
            )) {
                throw new RuntimeException('Failed to move uploaded file.');
            }

            echo 'File is uploaded successfully.';
            header("Location: listing.php");

        } catch (RuntimeException $e) {

            echo $e->getMessage();

        }
        ?>

        <form method="post" enctype="multipart/form-data">
            <input type="file" name="upfile" />
            <input type="submit" value="Upload" />
        </form>

        <br>
        Choose song: <a href="listing.php">HERE</a>
    </body>
</html>
