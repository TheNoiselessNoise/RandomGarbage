<?php
    require("global.php");
    $LOCK = FALSE;

    // if(!isset($_GET["thisissupersecretlul"])){
    //     $LOCK = TRUE;
    // }
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>X .Y .Z .T | Index</title>

    <!-- STYLES -->
    <link rel="stylesheet" href="css/index.css">

    <?php if(!$LOCK): ?>
        <link rel="stylesheet" href="fonts/fontawesome/css/all.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/konpa/devicon@master/devicon.min.css">

        <!-- SCRIPTS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/p5.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/addons/p5.sound.min.js"></script>
        <script src="js/libs/jquery.min.js"></script>

        <script src="js/XYZT.js"></script>
        <script src="js/index_canvas.js"></script>
        <script src="js/index.js"></script>
        <script>
            function getRandomHexColor(_="#"){
                let alpha = "0123456789abcdef";
                for(let i = 0; i < 6; i++){
                    let r = Math.round(Math.random() * (alpha.length - 1));
                    _ += alpha[r];
                }
                return _;
            }
            const GLOBAL_COLOR = getRandomHexColor();
        </script>
    <?php endif; ?>
</head>
<body>

<?php if($LOCK): ?>
    <div id="wrapper">
        Site Under Maintenance
    </div>
    <script>
        setInterval(function(){
            let e = document.querySelector("div#wrapper");
            e.style.textShadow = "0 0 10px " + GLOBAL_COLOR;
        }.bind(this), 500);

    </script>
<?php else: ?>
    <nav>
        <div id="song_control">
            <label for="hide_me">Hide Me
                <input type="checkbox" id="hide_me">
            </label>

            <label for="back_me">Back Me
                <input type="checkbox" id="back_me" checked>
            </label>
            
            <label for="rotate_me">Rotate Me
                <input type="checkbox" id="rotate_me">
            </label>

            <label for="double_me">Double Me
                <input type="checkbox" id="double_me">
            </label>

            <label for="potato_pc">Potato PC
                <input type="checkbox" id="potato_pc" checked="true">
            </label>

            <label for="i_like_these_colors">I LIKE THESE COLORS
                <input type="checkbox" id="i_like_these_colors">
            </label>

            <label for="smooth_me">
                <div class="row">
                    <div class="col">
                        Smooth Me [<span id="smooth_me_value">0.95</span>]&nbsp;
                    </div>
                    <div class="col">
                        <i data-value="-0.01" class="fa fa-arrow-left smooth_me" aria-hidden="true"></i>
                    </div>
                    <div class="col">
                        <input type="range" id="smooth_me" min="0" max="1" value="0.95" step="0.01">
                    </div>
                    <div class="col">
                        <i data-value="0.01" class="fa fa-arrow-right smooth_me" aria-hidden="true"></i>
                    </div>
                </div>
            </label>

            <label for="range_me">
                <div class="row">
                    <div class="col">
                        Range Me [<span id="range_me_value">6</span>]&nbsp;
                    </div>
                    <div class="col">
                        <i data-value="-1" class="fa fa-arrow-left range_me" aria-hidden="true"></i>
                    </div>
                    <div class="col">
                        <input type="range" id="range_me" min="0" max="8" value="6">
                    </div>
                    <div class="col">
                        <i data-value="1" class="fa fa-arrow-right range_me" aria-hidden="true"></i>
                    </div>
                </div>
            </label>

            <label for="range_me_from">
                <div class="row">
                    <div class="col">
                        Range Me From [<span id="range_me_from_value">100</span>]&nbsp;
                    </div>
                    <div class="col">
                        <i data-value="-1" class="fa fa-arrow-left range_me_from" aria-hidden="true"></i>
                    </div>
                    <div class="col">
                        <input type="range" id="range_me_from" min="0" max="100" value="100">
                    </div>
                    <div class="col">
                        <i data-value="1" class="fa fa-arrow-right range_me_from" aria-hidden="true"></i>
                    </div>
                </div>
            </label>

            <label for="range_me_to">
                <div class="row">
                    <div class="col">
                        Range Me To [<span id="range_me_to_value">0</span>]&nbsp;
                    </div>
                    <div class="col">
                        <i data-value="-1" class="fa fa-arrow-left range_me_to" aria-hidden="true"></i>
                    </div>
                    <div class="col">
                        <input type="range" id="range_me_to" min="0" max="100" value="0">
                    </div>
                    <div class="col">
                        <i data-value="1" class="fa fa-arrow-right range_me_to" aria-hidden="true"></i>
                    </div>
                </div>
            </label>
        </div>

        <h1>
            <span id="song_name"></span>

            <i id="toggle_control" class="fa fa-cog" aria-hidden="true"></i>

            <?php
                echo "<i class='fa fa-step-backward bw' aria-hidden='true' data-value='{$RANDOM_MUSIC1}'></i>";
            ?>
            X . Y . Z . T
            <?php
                echo "<i class='fa fa-step-forward fw' aria-hidden='true' data-value='{$RANDOM_MUSIC2}'></i>";
            ?>
        </h1>

        <a href="#about"><i class="fas fa-folder"></i> About me</a>
        <a href="#hobbies"><i class="fas fa-folder"></i> Hobbies</a>
        <a href="#contact"><i class="fas fa-folder"></i> Contact</a>
    </nav>

    <section id="about">
        <h1>/root/about</h1>

        <div class="content">
            <div class="row">
                <div class="col">ACTUAL STATUS</div>
                <div class="col">Sitting. Writing. Looking for motivation. Bored.</div>
            </div>
            <div class="row">
                <div class="col">Person</div>
                <div class="col">
                    He do NOT like people much, but he likes to listen to them and he understands them.
                </div>
            </div>
            <div class="row">
                <div class="col">Character</div>
                <div class="col">
                    Talented (i guess), reliable, punctual, patient and especially undefined for society.
                </div>
            </div>
            <div class="row">
                <div class="col">Regime</div>
                <div class="col">
                    Wordlessly silent, writing, observing and listening.
                </div>
            </div>
            <div class="row">
                <div class="col">School</div>
                <div class="col">High School of Programming and Hardware</div>
            </div>
            <div class="row">
                <div class="col">Location</div>
                <div class="col">Unfortunately on this "abandoned" planet.</div>
            </div>
        </div>
    </section>

    <section id="hobbies">
        <h1>/root/hobbies</h1>

        <div class="content">
            <div class="row language">
                <div class="col">
                    <i class="devicon-html5-plain"></i>
                </div>
                <div class="col">
                    Without the use of HTML, web applications are useless.
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-css3-plain"></i>
                </div>
                <div class="col">
                    Styles and animations of CSS3. 
                    SASS and LESS, i guess moreless.
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-javascript-plain"></i>
                </div>
                <div class="col">
                    Javascript is language that must not be missing from web applications and therefore I do not take it as an obstacle at all.
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-jquery-plain"></i>
                </div>
                <div class="col">
                    Of course, Javascript must also include the jQuery library, which will not only make work easier but also more or less make the code more readable.
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-php-plain"></i>
                </div>
                <div class="col">
                    I don't use any frameworks, but I'm not afraid of new things.
                    E.g. Drupal, in which I worked and I must say,
                    that it was quite interesting.
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-mysql-plain"></i>
                </div>
                <div class="col">
                    Whether it's MySQL or MariaDB, whether it's indexing, merging or perhaps filtering data or tables,
                    it's all the same, the only difference is in the engines and how it's spelled. No science, but until then? NoSQL.
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-python-plain"></i>
                </div>
                <div class="col">
                    I have to admit here that it is probably my favorite language. Python3 is unique and I enjoy working with it.
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-csharp-plain"></i>
                </div>
                <div class="col">
                    Not that I understand the whole C#, but it's more or less similar to Python, where I only use it to make my day faster, but in UI form.
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-linux-plain"></i>
                </div>
                <div class="col">
                    Compared to Windows, I prefer Linux, due to its simplicity. What would we do without a command line?
                </div>
            </div>

            <div class="row language">
                <div class="col">
                    <i class="devicon-google-plain"></i>
                </div>
                <div class="col">
                    And if I don't know, I know there is Google and StackOverflow.
                </div>
            </div>
        </div>
    </section>

    <section id="contact">
        <h1>/root/contact</h1>

        <h2>YOU SEARCHING FOR SOMETHING HMM?</h2>
    </section>
<?php endif; ?>

</body>
</html>