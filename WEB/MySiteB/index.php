<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>MySiteB</title>
    <link rel="stylesheet" href="css/default.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="https://cdn.rawgit.com/konpa/devicon/df6431e323547add1b4cf45992913f15286456d3/devicon.min.css">
    <script src="js/highlight.min.js"></script>
    <script src="js/jquery.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
    <script src="js/main.js"></script>
</head>
<body>
    <?php
        if(isset($_GET["file"])){
            $dir = "projects/scripts/";
            $SCRIPT_TYPE = array(
                "py" => "python",
                "js" => "javascript",
                "html" => "html",
                "txt" => "plaintext",
                "sh" => "bash"
            );
    
            $fileparts = explode(".", $_GET["file"]);   
            $ext = $fileparts[count($fileparts) - 1];     
            if(file_exists($dir . $_GET["file"]) and array_key_exists($ext, $SCRIPT_TYPE)){
                $file = fopen($dir . $_GET["file"], "r");
                $content = fread($file, filesize($dir . $_GET["file"]));

                $content = str_replace("<", "&lt;", $content);
                $content = str_replace(">", "&gt;", $content);

                echo "<sep-arator>" . $_GET["file"] . "</sep-arator>";
                if(strpos($_GET["file"], "user.js")){
                    echo "<sep-arator>
                            <a href='{$dir}" . $_GET["file"] . "'>INSTALL THIS SCRIPT (requires Tampermonkey or Greasemonkey)</a>
                          </sep-arator>";
                }
                echo "<pre><code class='" . $SCRIPT_TYPE[$ext] . "'>{$content}</code></pre>";
                exit();
            } else {
                header("Location: " . basename(__FILE__));
            }
        } else {
            echo "<style>* { user-select: none; }</style>";
        }
    ?>

    <nav id="top">
        <a href="#about">About me</a>
        <a href="#projects">Projects</a>
        <a href="#linux">
            <i class="devicon-linux-plain colored"></i> &gt; <i class="devicon-windows8-plain colored"></i>
        </a>
    </nav>
    
    <about-me id="about">
        - Somehow strange, somehow neutral,... somehow weird, but still in the wrap of a &lt;human&gt; -
    </about-me>
    
    <my-projs id="projects">
        <pro-jects>
            <pro-ject>
                <input type="text" id="search" placeholder="Search...">
            </pro-ject>

            <sep-arator>WEB APPS</sep-arator>
            <pro-ject>
                <pro-langs>
                    <i class="devicon-html5-plain colored"></i>
                    <i class="devicon-css3-plain colored"></i>
                    <i class="devicon-php-plain colored"></i>
                    <i class="devicon-mysql-plain colored"></i>
                </pro-langs>
                <pro-name>SomeWebApp</pro-name>
                <pro-desc>Description of my SomeWebApp</pro-desc>
                <a target="_blank" href="#">LINK</a>
            </pro-ject>

            <sep-arator>GAMES</sep-arator>
            <pro-ject>
                <pro-langs>
                    <i class="devicon-javascript-plain colored"></i>
                </pro-langs>
                <pro-name>SomeGame</pro-name>
                <pro-desc>Description of my SomeGame</pro-desc>
                <a target="_blank" href="#">LINK</a>
            </pro-ject>

            <sep-arator>SCRIPTS</sep-arator>
            <pro-ject>
                <pro-langs>
                    <i class="devicon-python-plain colored"></i>
                </pro-langs>
                <pro-name>PYTHON_SCRIPT</pro-name>
                <pro-desc>just a script</pro-desc>
                <a target="_blank" href="<?php echo basename(__FILE__) . '?file=PYTHON_SCRIPT.py'; ?>">LINK</a>
            </pro-ject>
            <pro-ject>
                <pro-langs>
                    <i class="devicon-javascript-plain colored"></i>
                </pro-langs>
                <pro-name>OPEN_USER_SCRIPT</pro-name>
                <pro-desc>just an open user script</pro-desc>
                <a target="_blank" href="<?php echo basename(__FILE__) . '?file=OPEN_USER_SCRIPT.user.js'; ?>">LINK</a>
            </pro-ject>
        </pro-jects>
    </my-projs>
    
    <linux-over id="linux">
        <linux-moto>Are you sure you just want to stay at one point? Come around.</linux-moto>
        <pro-jects class="stop-scale">
            <pro-ject>
                <pro-langs>
                    <i class="devicon-debian-plain colored"></i>
                </pro-langs>
                <pro-name>Debian</pro-name>
                <a target="_blank" href="https://www.debian.org/distrib/">LINK</a>
            </pro-ject>
            <pro-ject>
                <pro-langs>
                    <i class="devicon-ubuntu-plain colored"></i>
                </pro-langs>
                <pro-name>Ubuntu</pro-name>
                <a target="_blank" href="https://ubuntu.com/download">LINK</a>
            </pro-ject>
            <pro-ject>
                <pro-langs>
                    <i class="devicon-redhat-plain colored"></i>
                </pro-langs>
                <pro-name>RedHat</pro-name>
                <a target="_blank" href="https://developers.redhat.com/products/rhel/download/">LINK</a>
            </pro-ject>
            <pro-ject>
                <pro-langs>
                    <img style='width:32px' src="images/kali.png" alt="kali">
                </pro-langs>
                <pro-name>Kali Linux</pro-name>
                <a target="_blank" href="https://www.kali.org/downloads/">LINK</a>
            </pro-ject>
        </pro-jects>
    </linux-over>

    <a id="tothetop" href="#top"> &#8607; </a>

    <footer>
        XYZT &copy; 2019 with <a target="_blank" href="https://code.visualstudio.com/"><i class="devicon-visualstudio-plain colored"></i></a>
    </footer>
</body>
</html>