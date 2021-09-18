
let isMouseOnBlockDown = false;
let isMouseOnBlockDragged = false;
let shouldBeDiscarded = false;
let lastActiveBlock = null;
var mpos = { x: -1, y: -1 };
let global = {
    user_vars: {

    }
};

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

$(document).ready(function(){

    $(document).mousemove(function(event) {
        mpos.x = event.pageX;
        mpos.y = event.pageY;
    });

    $("#nav-blocks a").on("click", function(){
        $("#nav-blocks a").removeClass("active");
        $(this).addClass("active");

        $("#left-side #blocks > div").css({ display: "none" });
        let target = $(this).attr("nav-link");
        $("#left-side #blocks > div.nav-link-" + target).css({ display: "block" });
    });

    $("#left-side .block, #left-side .data-block").on("click", function(){
        let has = $(this).hasClass("active");

        $("#left-side .block, #left-side .data-block").removeClass("active");

        if(!has){
            $(this).addClass("active");
            lastActiveBlock = this;
        } else {
            lastActiveBlock = null;
        }
    });

    /* START --- CLONING BLOCKS TO TARGET */
    $("#code .block").on("click", function(e){
        let clickedBlocked = $(e.target).closest(".start-block, .middle-block");

        if(lastActiveBlock !== null){
            let dataId = $(lastActiveBlock).attr("data-id");

            if(!["boolean", "number", "string"].includes(dataId)){
                let innerBlock = $(clickedBlocked).next(".inner-blocks");

                let cloned = $(lastActiveBlock).clone();
                let clonedInnerBlock = $(cloned).children(".inner-blocks");

                if($(clonedInnerBlock).length){
                    $(clonedInnerBlock).sortable();
                }

                $(innerBlock).append(cloned);
            }
        }
    });

    $(document.body).on("contextmenu", "#right-side .attr, #right-side .attr .data-block", function(e){
        e.preventDefault();
    });
    $(document.body).on("mousedown", "#right-side .attr", function(e){
        let mouse = getClick(e.which);

        if(mouse.LEFT){
            // add or change
            if(lastActiveBlock !== null){
                let dataId = $(lastActiveBlock).attr("data-id");
                let clickedAttrWhat = $(e.target).attr("data-what");

                if(dataId === clickedAttrWhat){
                    let cloned = $(lastActiveBlock).clone();
                    $(e.target).html(cloned);
                }
            }
        }
    });

    $(document.body).on("mousedown", "#right-side .attr .data-block, #right-side .attr .data-block .block-text", function(e){
        let mouse = getClick(e.which);

        if(mouse.LEFT){
            let dataId = $(lastActiveBlock).attr("data-id");
            let clickedAttr = $(e.target).parent(".attr");
            let clickedAttrWhat = $(clickedAttr).attr("data-what");

            if(dataId === clickedAttrWhat){
                if($(e.target).html().trim()){
                    let cloned = $(lastActiveBlock).clone();
                    $(clickedAttr).html(cloned);
                }
            }
        }

        if(mouse.RIGHT){
            if($(e.target).is(".data-block")){
                if($(e.target).attr("data-type")){
                    $($(e.target).parent(".data-block")).remove();
                } else {
                    $(e.target).remove();
                }
            }

            if($(e.target).is(".attr")){
                $($(e.target).parent(".data-block")).remove();
            }
        }
    });


    // $(document.body).on("click", "#code .attr", function(e){
        // if(lastActiveBlock !== null){
        //     let dataId = $(lastActiveBlock).attr("data-id");
        //     let clickedAttrWhat = $(e.target).attr("data-what");

        //     if(dataId === clickedAttrWhat){
        //         let cloned = $(lastActiveBlock).clone();
        //         $(e.target).html(cloned);
        //     }
        // }
    // });
    // $(document.body).on("click", "#code .attr > *" , function(e){
    //     if(lastActiveBlock !== null){
            // let dataId = $(lastActiveBlock).attr("data-id");
            // let clickedAttr = $(e.target).parent(".attr");
            // let clickedAttrWhat = $(clickedAttr).attr("data-what");

            // if(dataId === clickedAttrWhat){
            //     if($(e.target).html().trim()){
            //         if(confirm("Are you sure you want to replace this attribute?")){
            //             let cloned = $(lastActiveBlock).clone();
            //             $(clickedAttr).html(cloned);
            //         }
            //     }
            // }
    //     }
    // });
    /* END --- CLONING BLOCKS TO TARGET */

    /* START --- MOVING BLOCKS TO TRASHBIN */
    $("#code .block, #code .data-block")
        .mousedown(function(){
            isMouseOnBlockDown = true;
        })
        .mousemove(function(){
            if(isMouseOnBlockDown){
                isMouseOnBlockDragged = true;
                isMouseOnBlockDown = false;
            }
        })
        .mouseup(function(){
            isMouseOnBlockDown = false;
            isMouseOnBlockDragged = false;
        });

    $(document.body).on("mousemove", "#code .block, #code .data-block", function(){
        if(isMouseOnBlockDragged){
            let trashbin = $("#left-side #trashbin")[0];
            let trashBinDist = distanceBetweenElems(this, trashbin);

            if(trashBinDist < 35){
                shouldBeDiscarded = true;
                $(trashbin).css({ border: "5px solid #000" });
            }
        }
    }).on("mouseup", "#code .block, #code .data-block", function(){
        if(shouldBeDiscarded){
            $(this).remove();
            $("#left-side #trashbin").css({ border: "0" });
            shouldBeDiscarded = false;
        }
    });
    /* END --- MOVING BLOCKS TO TRASHBIN */

    // UPDATE NAV
    let nav_link_target = $("#left-side #nav-blocks > a.active").attr("nav-link");
    $("#left-side #blocks > div.nav-link-" + nav_link_target).css({ display: "block" });

    // VARIABLE BUTTONS
    $("#create-var, #delete-var").on("click", function(){
        let thisId = $(this).attr("id");
        $("#forms").css({ display: "block" });
        $("#forms > form." + thisId).css({ display: "block" });
    });

    // FORMS BUTTONS
    $("#forms > form.create-var button.cancel").on("click", function(e){
        e.preventDefault();

        $(this).parents("form").css({ display: "none" });
        $(this).parents("form").parent().css({ display: "none" });
    });

    $("#forms > form.create-var button.add").on("click", function(e){
        e.preventDefault();

        let varName = $(this).parents("form").find(".var-name");

        if(!VAR_NAME_REGEX.test($(varName).val())){
            $(varName).css({ "border": "2px solid red"});
            return;
        } else {
            $(varName).css({ "border": "0"});
            $(varName).css({ "border-bottom": "2px solid dodgerblue"});

            $(this).parents("form").css({ display: "none" });
            $(this).parents("form").parent().css({ display: "none" });
        }
    });

    // when block (left) is selected and hover over block (right) (start), make effect
    $(document.body).on("mouseover", "#right-side .block > .start-block, #right-side .block > .middle-block", function(e) {
        if(isLastBlock()){
            $(this).css("box-shadow", "0 0 15px #000");
        }
    });
    $(document.body).on("mouseout", "#right-side .block > .start-block, #right-side .block > .middle-block", function(e) {
        if(isLastBlock()){
            $(this).css("box-shadow", "");
        }
    });

    // when data-block (left) is selected and hover over attr (right) (attrs), make effect
    $(document.body).on("mouseover", "#right-side .attrs > .attr", function(e) {
        if(isLastDataBlock() && isLastSameAsAttr($(this))){
            $(this).css("background", "#4f4f4f");
        }
    });
    $(document.body).on("mouseout", "#right-side .attrs > .attr", function(e) {
        if(isLastDataBlock() && isLastSameAsAttr($(this))){
            $(this).css("background", "#dadada");
        }
    });

    // MAKE FIRST EVENT SORTABLE
    $("#right-side #code > div:first-child > .inner-blocks").sortable();
});

function emptyAttr(e){
    return $(e).children(".data-block").remove();
}

function isAttrFilled(e){
    return $(e).children(".data-block").toArray().length === 1;
}

function getClick(e){
    return {LEFT:e===1,MIDDLE:e===2,RIGHT:e===3};
}

function isLastSameAsAttr(attr){
    let type_attr = $(attr).attr("data-what");
    let type_block = $(lastActiveBlock).attr("data-id");
    return type_attr === type_block;
}

function isLastDataBlock(){
    return lastActiveBlock !== null && $(lastActiveBlock).is(".data-block");
}

function isLastBlock(){
    return lastActiveBlock !== null && ($(lastActiveBlock).is(".block") || $(lastActiveBlock).is(".function"));
}

function distanceBetweenElems(elem1, elem2) {
    let e1Rect = elem1.getBoundingClientRect();
    let e2Rect = elem2.getBoundingClientRect();
    let dx = (e1Rect.left+(e1Rect.right-e1Rect.left)/2) - (e2Rect.left+(e2Rect.right-e2Rect.left)/2);
    let dy = (e1Rect.top+(e1Rect.bottom-e1Rect.top)/2) - (e2Rect.top+(e2Rect.bottom-e2Rect.top)/2);
    return Math.sqrt(dx * dx + dy * dy);
}