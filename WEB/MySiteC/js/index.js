$(document).ready(function(){
    // toggle like function for navigation elements
    $("nav a").on("click", function(){
        let has = $(this).hasClass("active");
        $("nav a").removeClass("active");
        if(!has){
            $(this).addClass("active");
        }

        prepareSection();
    });

    function prepareSection(){
        $("section").hide().css({opacity:0});

        let current = $("nav a.active");
        if(current.length){
            let id = $(current).attr("href");
            $("section"+id).show().animate({opacity:1});
            $("input#hide_me")[0].checked = false;
            toggleHide(true);
        } else {
            toggleHide(false);
        }
    }

    // icons
    $("i.bw, i.fw").on("click", function(){
        xyzt.loadMusic(null, true);
    });

    // song controls
    function toggleControls(v=null){
        controlsToggled = v !== null ? v : !controlsToggled;

        if(controlsToggled){
            $("div#song_control").css("top", "-80vh");
            $("div#song_control").show();
        } else {
            $("div#song_control").css("top", "");
            $("div#song_control").hide();
        }
    }

    function toggleHide(v=null){
        hideToggled = v !== null ? v : !hideToggled;

        if(hideToggled){
            $("nav").css("transform", "translate(-50%, 40vh)");
            $("i#toggle_control").removeClass("fa-cog").addClass("fa-arrow-up");
        } else {
            $("nav").css("transform", "translate(-50%, -50%)");
            $("i#toggle_control").removeClass("fa-arrow-up").addClass("fa-cog");
        }
    }

    let hideToggled = false;
    let controlsToggled = false;
    $("i#toggle_control").on("click", function(){
        hideToggled = !hideToggled;
        controlsToggled = !controlsToggled;

        toggleControls(hideToggled);
        toggleHide(controlsToggled);
        $(getActiveSection()).hide();

        for(let a of $("nav a")){
            if($(a).hasClass("active")){
                $(a).removeClass("active");
            }
        }
    });

    $("input#hide_me").on("click", function(){
        toggleControls(false);
    });

    $("input#back_me").on("click", function(){
        xyzt.isBacked = $("input#back_me").is(":checked");
        IUpdateFFT();
    });

    $("input#rotate_me").on("click", function(){
        xyzt.isRotated = $("input#rotate_me").is(":checked");
        IUpdateFFT();
    });

    $("input#double_me").on("click", function(){
        xyzt.isDoubled = $("input#double_me").is(":checked");
        IUpdateFFT();
    });

    $("input#potato_pc").on("click", function(){
        xyzt.POTATO_PC = $("input#potato_pc").is(":checked");
        IUpdateFFT();
    });

    $("input#i_like_these_colors").on("click", function(){
        xyzt.I_LIKE_THESE_COLORS = $("input#i_like_these_colors").is(":checked");
        IUpdateFFT();
    });

    $("input#smooth_me").on("input", function(){
        xyzt.FFT_SMOOTH_DEF = $("input#smooth_me").val();
        IUpdateFFT(true);
    });

    $(".smooth_me").on("click", function(){
        updateValueArrows($(this), true);
        xyzt.FFT_SMOOTH_DEF = $("input#smooth_me").val();
        IUpdateFFT(true);
    });

    $("input#range_me").on("input", function(){
        xyzt.FFT_BINS_DEF = $("input#range_me").val();
        IUpdateFFT(true);
    });

    $(".range_me").on("click", function(){
        updateValueArrows($(this));
        xyzt.FFT_BINS_DEF = $("input#range_me").val();
        IUpdateFFT(true);
    });

    $("input#range_me_from").on("input", function(){
        xyzt.FFT_SLICE_FROM = $("input#range_me_from").val();
        IUpdateFFT();
    });

    $(".range_me_from").on("click", function(){
        updateValueArrows($(this));
        xyzt.FFT_SLICE_FROM = $("input#range_me_from").val();
        IUpdateFFT();
    });

    $("input#range_me_to").on("input", function(){
        xyzt.FFT_SLICE_TO = $("input#range_me_to").val();
        IUpdateFFT();
    });

    $(".range_me_to").on("click", function(){
        updateValueArrows($(this));
        xyzt.FFT_SLICE_TO = $("input#range_me_to").val();
        IUpdateFFT();
    });
});

function updateCheckboxes(e){
    for(let el of $(e)){
        if($(el).is(":checked")){
            $(el).parent().css({background:"rgba(255, 255, 255, .45)"});
        } else {
            $(el).parent().css({background:"rgba(255, 255, 255, .115)"});
        }
    }
}

function updateValueArrows(e, useFloat=false){
    let v = Number($(e).attr('data-value'));
    let y = $(e)[0].className.split(" ").slice(-1)[0];
    let x = $("#"+y);
    let nv = Number($(x).val()) + v;

    if(useFloat){
        nv = Number($(x).val()) + v;
        nv = nv.toFixed(2);
    }

    let min = $(x).attr('min');
    let max = $(x).attr('max');
    if(nv !== min && nv !== max){
        $(x).val(nv);
    }

    $("span#"+y+"_value").text(nv);
}

function IUpdateFFT(newFFT=false){
    if(newFFT){
        xyzt.updateFFT();
    }

    updateCheckboxes($(
        "#back_me, #rotate_me, #double_me, #potato_pc, #i_like_these_colors"
    ));

    $("span#smooth_me_value").text(xyzt.FFT_SMOOTH_DEF);
    $("span#range_me_value").text(xyzt.FFT_BINS_DEF);
    $("span#range_me_from_value").text(xyzt.FFT_SLICE_FROM);
    $("span#range_me_to_value").text(xyzt.FFT_SLICE_TO);
    $("input#range_me_from").attr("max", xyzt.FFT_BINS_DEFAULTS[xyzt.FFT_BINS_DEF]);
    $("input#range_me_to").attr("max", xyzt.FFT_BINS_DEFAULTS[xyzt.FFT_BINS_DEF]);
}

function getActiveSection(){
    let current = $("nav a.active");
    if(current.length){
        let id = $(current).attr("href");
        return "section"+id;
    }
    return null;
}