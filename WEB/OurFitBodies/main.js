let MY_JSON = []; // array of objects FitPerson
let CURRENT_YEAR = null; // number
let CURRENT_MONTH = null; // number
let CURRENT_DATE = [];
let CURRENT_GRAPHS = [];
let MAX_WEIGHT = 120;
let MIN_WEIGHT = 80;

let IMPORTED = {};
let title = "OurFitBodies v1.0";
let IS_DEV = false;

let alphaLow = "abcdefghijklmnopqrstuvwxyz";
let alphaUp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let numeric = "0123456789";
let characters = {
    L: alphaLow,
    U: alphaUp,
    LU: alphaLow + alphaUp,
    N: numeric,
    LN: alphaLow + numeric,
    UN: alphaUp + numeric,
    LUN: alphaLow + alphaUp + numeric,
    HEX: numeric + alphaLow.substring(0, 6)
};

let COLORS = ["#FF000033", "#FF00FF33"];
let MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let DEFAULT_MONTH_LOCATION = "#people";
let GLOBAL_INTERVAL = null;

// TODO: when importing, reset all needed things (selects in nav, selects in wrappers,....)
// TODO: editing a person
// TODO: removing a person
// TODO: exporting
// TODO: use a person's color
// TODO: when adding a date, make on change person -> available month (see update_add_date_selects)

$(document).ready(function(){
    $("title, nav > a:first-child").text(title);

    $("[contenteditable]").focusout(function(){
        var element = $(this);
        if (!element.text().trim().length) {
            element.empty();
        }
    });

    $("select#years").on("change", function(){
        if($(this).val() !== ""){
            toggle_load(true);
            CURRENT_YEAR = parseInt($(this).val());
            update_select_months();
            toggle_load(false);
        }
    });

    $("select#months").on("change", function(){
        if($(this).val() !== ""){
            toggle_load(true);
            CURRENT_MONTH = parseInt($(this).val());
            load_month();
            toggle_load(false);
        }
    });

    // icons functionality
    $(document.body).on("click", ".day i.fa-arrow-up", function(){
        // it's local app, whatever ... no security needed, and it's only JS, so what
        let person_index = parseInt($(this).parents("div.person").attr("data-id"));
        let day_index = parseInt($(this).parents("tr.day").attr("data-id"));

        MY_JSON[person_index].move_day(CURRENT_YEAR, CURRENT_MONTH, day_index, -1);
        load_month();
    });
    $(document.body).on("click", ".day i.fa-arrow-down", function(){
        // it's local app, whatever ... no security needed, and it's only JS, so what
        let person_index = parseInt($(this).parents("div.person").attr("data-id"));
        let day_index = parseInt($(this).parents("tr.day").attr("data-id"));

        MY_JSON[person_index].move_day(CURRENT_YEAR, CURRENT_MONTH, day_index, 1);
        load_month();
    });
    $(document.body).on("click", ".day i.fa-trash", function(){
        // it's local app, whatever ... no security needed, and it's only JS, so what
        let person_index = parseInt($(this).parents("div.person").attr("data-id"));
        let day_index = parseInt($(this).parents("tr.day").attr("data-id"));

        let p = MY_JSON[person_index];
        let dt = p.get_date(CURRENT_YEAR, CURRENT_MONTH);
        let day = p.get_day(CURRENT_YEAR, CURRENT_MONTH, day_index);
        if(dt !== null && day !== null){
            let day = dt[1].days[day_index];
            let full_date = day.date + ". " + MONTH_NAMES[dt[1].month].toLowerCase() + " " + dt[1].year;
            if(confirm("Do you really want to delete day " + full_date + " for " + p.name + "?")){
                MY_JSON[person_index].remove_day_by(CURRENT_YEAR, CURRENT_MONTH, day_index);
                load_month();
            }
        } else {
            add_msg("Oh, something really bad happened and i don't know what to do with it :(");
        }
    });
    $(document.body).on("click", ".day i.fa-pen", function(){
        // it's local app, whatever ... no security needed, and it's only JS, so what
        let person_index = parseInt($(this).parents("div.person").attr("data-id"));
        let day_index = parseInt($(this).parents("tr.day").attr("data-id"));

        let p = MY_JSON[person_index];
        let day = p.get_day(CURRENT_YEAR, CURRENT_MONTH, day_index);

        if(day !== null){
            let full_date = day.date + ". " + MONTH_NAMES[CURRENT_MONTH].toLowerCase() + " " + CURRENT_YEAR;


            $("#day_edit_date").text(full_date);
            $("#day_edit_person_name").text(p.name);
            $("#day_edit_person_number").val(person_index);
            $("#day_edit_date_number").val(day_index);

            let weight = day.weight;
            let breakfast = day.meal.breakfast === null ? "" : day.meal.breakfast;
            let snack1 = day.meal.snack1 === null ? "" : day.meal.snack1;
            let lunch = day.meal.lunch === null ? "" : day.meal.lunch;
            let snack2 = day.meal.snack2 === null ? "" : day.meal.snack2;
            let dinner1 = day.meal.dinner1 === null ? "" : day.meal.dinner1;
            let dinner2 = day.meal.dinner2 === null ? "" : day.meal.dinner2;
            let note = day.note === null ? "" : day.note;

            $("#day_edit_weight").val(weight);
            $("#day_edit_breakfast").val(breakfast);
            $("#day_edit_snack1").val(snack1);
            $("#day_edit_lunch").val(lunch);
            $("#day_edit_snack2").val(snack2);
            $("#day_edit_dinner1").val(dinner1);
            $("#day_edit_dinner2").val(dinner2);
            $("#day_edit_note").val(note);

            $("#day_edit_wrapper").css({ display: "block" });
        } else {
            add_msg("Oh, something really bad happened and i don't know what to do with it :(");
        }
    });
    $(document.body).on("click", "button#day_edit_cancel", function(){
        $("div#day_edit_wrapper").css("display", "none");
    });

    $(document.body).on("click", "button#day_edit_submit", function(){
        let person_index = Number($("#day_edit_person_number").val());
        let day_index = Number($("#day_edit_date_number").val());
        let p = MY_JSON[person_index];
        let day = p.get_day(CURRENT_YEAR, CURRENT_MONTH, day_index);

        if(day !== null){
            day.weight = Number($("#day_edit_weight").val());
            day.meal.breakfast = $("#day_edit_breakfast").val();
            day.meal.snack1 = $("#day_edit_snack1").val();
            day.meal.lunch = $("#day_edit_lunch").val();
            day.meal.snack2 = $("#day_edit_snack2").val();
            day.meal.dinner1 = $("#day_edit_dinner1").val();
            day.meal.dinner2 = $("#day_edit_dinner2").val();
            day.note = $("#day_edit_note").val();

            $("div#day_edit_wrapper").css("display", "none");
            load_month();
        } else {
            add_msg("Oh, something really bad happened and i don't know what to do with it :(");
        }
    });

    $(document.body).on("click", "button#add_person", function(){
        $("div#add_person_wrapper").css({ display: "block" });
    });

    $(document.body).on("click", "button#add_person_cancel", function(){
        $("div#add_person_wrapper").css("display", "none");
    });

    $(document.body).on("click", "button#add_person_submit", function(){
        let name = $("#add_person_wrapper #person_name").val();
        let color = $("#add_person_wrapper #person_color").val();
        let sweight = $("#add_person_wrapper #person_start_weight").val();
        let tweight = $("#add_person_wrapper #person_target_weight").val();

        let new_p = new FitPerson();
        new_p.name = name;
        new_p.color = color;
        new_p.start_weight = Number(sweight);
        new_p.target_weight = Number(tweight);

        MY_JSON.push(new_p);
        $("div#add_person_wrapper").css("display", "none");
        update_add_date_selects();
        load_month();
    });

    $(document.body).on("click", "button#add_date", function(){
        $("div#add_date_wrapper").css({ display: "block" });
    });

    $(document.body).on("click", "button#add_date_cancel", function(){
        $("div#add_date_wrapper").css("display", "none");
    });

    $(document.body).on("click", "button#add_date_submit", function(){
        let year = Number($("#add_date_wrapper #year_number").val());
        let month = Number($("#add_date_wrapper #month_number").val());
        let person = Number($("#add_date_wrapper #person_number").val());

        let p = MY_JSON[person];
        if(p.get_date(year, month) === null){
            let new_dt = new FitDate();
            new_dt.year = year;
            new_dt.month = month;

            MY_JSON[Number(person)].dates.push(new_dt);
            $("div#add_date_wrapper").css("display", "none");

            update_select_years();
            update_select_months();
        } else {
            add_msg("Month already exists for this person!");
        }
    });

    $(document.body).on("click", ".close_file_wrapper", function(){
        $("#file_wrapper").css("display", "none");
    });

    $(document.body).on("click", ".msg > i.fa-times", function(){
        $(this).parents("div.msg").remove();
    });

    $(document.body).on("click", ".add_day > th, .add_day > th > i.fa-plus", function(){
        let person = Number($(this).parents("div.person").attr("data-id"));
        let p = MY_JSON[person];

        $("#day_add_person_name").text(p.name);
        $("#day_add_person_number").val(person);

        $("#day_add_date").html("");
        let curr_dt = p.get_date(CURRENT_YEAR, CURRENT_MONTH);
        if(curr_dt !== null){
            let numOfDays = curr_dt[1].num_of_days();
            let added = [];

            for(let d = 1; d <= numOfDays; d++){
                if(!curr_dt[1].day_exists(d)){
                    let option = c("option", { value: d, text: d + "." });
                    $("#day_add_date").append(option);
                    added.push(d);
                }
            }

            if(added.length === 0){
                let option = c("option", { value: "", text: "--- YOU CAN'T ADD ANOTHER DAY ---" });
                $("#day_add_date").append(option);
            }

            $("div#day_add_wrapper").css({ display: "block" });
        } else {
            add_msg("Oh, something really bad happened and i don't know what to do with it :(");
        }

    });

    $(document.body).on("click", "button#day_add_cancel", function(){
        $("div#day_add_wrapper").css("display", "none");
    });

    $(document.body).on("click", "button#day_add_submit", function(){
        let date = Number($("#day_add_date").val());
        let person = Number($("#day_add_person_number").val());
        let p = MY_JSON[person];

        let d = new FitDay();
        d.date = date;

        p.add_day(CURRENT_YEAR, CURRENT_MONTH, d);

        load_month();
        $("div#day_add_wrapper").css("display", "none");
    });

    $(document.body).on("click", "#export", function(){
        export_tables(MY_JSON);
    });

    $(document.body).on("click", "#import", function(){
        import_tables(true);
    });

    $(document.body).on("change", "#file", function(){
        import_tables(true);
    });

    if(IS_DEV){
        dev_import();
    }

    update_add_date_selects();

    GLOBAL_INTERVAL = setInterval(function(){
        for(let sketch of CURRENT_GRAPHS){
            sketch.windowResized();
        }
    }, 1000);
});

function add_msg(msg){
    let rem_icon = c("i", { class: "fas fa-times" });
    let msg_div = c("div", { class: "msg", text: msg, tag: rem_icon });
    $(".msg_wrapper").append(msg_div);
}

function get_date(){ // DONE
    let d = new Date();
    return [
        d.getDate(),
        d.getMonth() + 1,
        d.getFullYear()
    ].map(x => x < 9 ? "0" + x : String(x));
}

function get_time(){ // DONE
    let d = new Date();
    return [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ].map(x => x < 9 ? "0" + x : String(x));
}

function export_tables(content=null, ret=false){ // DONE
    if(!Object.keys(MY_JSON).length && content === null){
        alert("There's nothing to export, make a table first!");
        return;
    }

    let x = null;
    if(content !== null){
        if((content instanceof Object) || (content instanceof Array)){
            x = JSON.stringify(content);
        }
    } else {
        x = JSON.stringify(MY_JSON);
    }

    x = btoa(encodeURIComponent(x));

    if(ret){
        return x;
    }

    if(x !== null){
        var a = document.createElement("a");
        a.href='data:text/csv;base64,' + x;
        a.download = "OurFitBodies.fitdata";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}

function update_add_date_selects(){
    $("#add_date_wrapper select#year_number").html("");

    let curr_year = (new Date()).getFullYear();
    let curr_month = (new Date()).getMonth();
    for(let y = 2000; y <= curr_year; y++){
        let option = c("option", { value: y, text: y });

        if(y === curr_year){
            option.setAttribute("selected", "selected");
        }
        
        $("#add_date_wrapper select#year_number").append(option);
    }

    $("#add_date_wrapper select#month_number").html("");
    for(let m = 0; m <= 11; m++){
        let option = c("option", { value: m, text: MONTH_NAMES[m] });

        if(m === curr_month){
            option.setAttribute("selected", "selected");
        }

        $("#add_date_wrapper select#month_number").append(option);
    }

    $("#add_date_wrapper select#person_number").html("");
    if(MY_JSON.length === 0){
        let option = c("option", { value: "", text: "--- FIRST ADD A PERSON ---" });
        $("#add_date_wrapper select#person_number").append(option);
    } else {
        for(let m = 0; m < MY_JSON.length; m++){
            let option = c("option", { value: m, text: MY_JSON[m].name });
            $("#add_date_wrapper select#person_number").append(option);
        }
    }
}

function dev_import(){ // DONE
    let tmp_data = `JTVCJTdCJTIybmFtZSUyMiUzQSUyMk1lJTIyJTJDJTIyY29sb3IlMjIlM0ElMjIlMjNmNDAxMDElMjIlMkMlMjJzdGFydF93ZWlnaHQlMjIlM0E5NSUyQyUyMnRhcmdldF93ZWlnaHQlMjIlM0E4MCUyQyUyMmRhdGVzJTIyJTNBJTVCJTdCJTIyeWVhciUyMiUzQTIwMjElMkMlMjJtb250aCUyMiUzQTUlMkMlMjJkYXlzJTIyJTNBJTVCJTVEJTdEJTVEJTdEJTVE`;
    MY_JSON = parse_imported_json(JSON.parse(decodeURIComponent(atob(tmp_data))));
    update_select_years();
    CURRENT_YEAR = parseInt($("select#years option:nth-child(2)").val());
    $("select#years").val(String(CURRENT_YEAR)).trigger("change");
    CURRENT_MONTH = parseInt($("select#months option:nth-child(2)").val());
    $("select#months").val(String(CURRENT_MONTH)).trigger("change");
    update_add_date_selects();
}

function gens(chars=characters.LUN, len=12){ // DONE
    let key = "";
    for(let i = 0; i < len; i++){
        let random_index = Math.round(Math.random() * (chars.length - 1));
        key += chars[random_index];
    }
    return key;
}

function geni(min=0, max=1){ // DONE
    return Math.round(Math.random() * (max - min) + min);
}

function generate_random_person(){ // DONE
    let day = new FitDay();
    day.date = geni(1, 25);
    day.meal = {
        breakfast: gens(),
        snack1: gens(),
        lunch: gens(),
        snack2: gens(),
        dinner1: gens(),
        dinner2: gens()
    };
    day.weight = geni(50, 150);
    day.note = gens(characters.L, 64);

    let dt = new FitDate();
    dt.year = 2021;
    dt.month = 5;
    dt.days.push(day);

    let p = new FitPerson();
    p.name = gens(characters.L, 8);
    p.color = "#" + gens(characters.HEX, 6);
    p.start_weight = geni(90, 132);
    p.target_weight = geni(75, 85);
    p.dates.push(dt);

    return p;
}

function generate_random_fitdata_file(mask){ // DONE
    let persons = mask && !isNaN(mask.p) ? mask.p : 3;
    let year = mask && !isNaN(mask.y) ? mask.y : 2021;
    let month = mask && !isNaN(mask.m) ? mask.m : 0;
    let days_per_person = mask && !isNaN(mask.dpp) ? mask.dpp : 5;

    let ret = [];

    for(let i = 0; i < persons; i++){
        let p = new FitPerson();
        p.name = gens(characters.L, 8);
        p.color = "#" + gens(characters.HEX, 6);
        p.start_weight = geni(90, 132);
        p.target_weight = geni(75, 85);

        let dt = new FitDate();
        dt.year = year;
        dt.month = month;

        for(let d = 0; d < days_per_person; d++){
            let day = new FitDay();
            day.date = d+1;
            day.meal = {
                breakfast: gens(),
                snack1: gens(),
                lunch: gens(),
                snack2: gens(),
                dinner1: gens(),
                dinner2: gens()
            };
            day.weight = geni(50, 150);
            day.note = gens(characters.L, 64);

            dt.days.push(day);
        }

        p.dates.push(dt);
        ret.push(p);
    }

    export_tables(ret);
}

function generate_completely_random_fitdata_file(persons=5, days=8, r=false){ // DONE
    let ret = [];

    function dt_exists(p, y, m){
        for(let x of p.dates){
            if(x.year === y && x.month === m){
                return x;
            }
        }
        return null;
    }

    function d_exists(dt, d){
        for(let x of dt.days){
            if(x.date === d){
                return d;
            }
        }

        return null;
    }

    for(let i = 0; i < persons; i++){
        let p = new FitPerson();
        p.name = gens(characters.L, 8);
        p.color = "#" + gens(characters.HEX, 6);
        p.start_weight = geni(MIN_WEIGHT + 5, MAX_WEIGHT);
        p.target_weight = geni(MIN_WEIGHT, MIN_WEIGHT + 10);

        for(let dti = 0; dti < geni(3, 5); dti++){
            let year = geni(2020, 2022);
            let month = geni(0, 11);

            let dt = dt_exists(p, year, month);

            if(dt === null){
                dt = new FitDate();
                dt.year = year;
                dt.month = month;
            }

            for(let d = 0; d < days; d++){
                if(d_exists(dt, d+1)){
                    continue;
                }

                let day = new FitDay();
                day.date = d+1;
                day.meal = {
                    breakfast: gens(),
                    snack1: gens(),
                    lunch: gens(),
                    snack2: gens(),
                    dinner1: gens(),
                    dinner2: gens()
                };
                day.weight = geni(MIN_WEIGHT, MAX_WEIGHT);
                day.note = gens(characters.L, 64);

                dt.days.push(day);
            }

            p.dates.push(dt);
        }

        ret.push(p);
    }

    if(r){
        return ret;
    }
    export_tables(ret);
}

function import_tables(check=false){ // DONE
    var file = document.getElementById("file").files[0];
    if (file) {
        if(check){
            if(!file.name.includes(".fitdata")){
                alert("Selected file is not a .fitdata!\nPlease, import the right file!");
                return;
            } else {
                import_tables();
            }
        }

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            IMPORTED[file.name] = evt.target.result;
            TMP_JSON = JSON.parse(decodeURIComponent(atob(IMPORTED[file.name].split(",")[1])));
            MY_JSON = parse_imported_json(TMP_JSON);

            if(!MY_JSON){
                return;
            }

            update_select_years();
            update_add_date_selects();
            $("#file_wrapper").css("display", "none");
            $("#file").val("");
        };
        reader.onerror = function (evt) {
            console.log("error reading file");
        };
    } else {
        $("#file_wrapper").css("display", "block");
    }
}

function parse_imported_json(jsn) { // DONE
    x = [];
    try {
        let xi = 0;
        for(let y of jsn){
            x[xi] = Object.setPrototypeOf(y, FitPerson.prototype);

            let dti = 0;
            for(let dt of x[xi].dates){
                x[xi].dates[dti] = Object.setPrototypeOf(dt, FitDate.prototype);

                let di = 0;
                for(let d of x[xi].dates[dti].days){
                    x[xi].dates[dti].days[di] = Object.setPrototypeOf(d, FitDay.prototype);
                    di++;
                }

                dti++;
            }

            xi++;
        }
    } catch(e){
        console.log(e);
        return false;
    }

    return x;
}

function c(tag, attrs={}, callbacks={}){ // DONE
    let e = document.createElement(tag);

    if(Object.keys(attrs).length) {
        for (let key of Object.keys(attrs)) {
            if (key === "tag") {
                e.appendChild(attrs[key]);
            } else if (key === "tags" && attrs[key] instanceof Array) {
                for (let x of attrs[key]) {
                    if(x instanceof HTMLElement){
                        e.appendChild(x);
                    } else if(typeof x === "string") {
                        e.appendChild(new Text(x));
                    }
                }
            } else if (key === "text" || key === "textContent") {
                e.textContent = attrs[key];
            } else if (key === "class" || key === "className") {
                e.className = attrs[key];
            } else if (key === "html" || key === "innerHTML") {
                e.innerHTML = attrs[key];
            } else {
                e.setAttribute(key, attrs[key]);
            }
        }
    }

    if(Object.keys(callbacks).length) {
        for (let key of Object.keys(callbacks)) {
            e.addEventListener(key, callbacks[key]);
        }
    }

    return e;
}

function toggle_load(b){ // DONE
    if(b){
        $("#loading").css({ display: "block" });
    } else {
        $("#loading").css({ display: "none" });
    }
}

function update_select_years(){ // DONE
    toggle_load(true);
    $("select#years option:not(:first-child)").remove();

    let years = [];

    for(let p of MY_JSON){
        for(let dt of p.dates){
            if(!years.includes(dt.year)){
                years.push(dt.year);
                let option = c("option", { value: dt.year, text: dt.year });
                $("select#years").append(option);
            }
        }
    }

    $("select#years option").css({ background: "orange", color: "#000000" });
    toggle_load(false);
}

function update_select_months(){ // DONE
    toggle_load(true);

    $("select#months option:not(:first-child)").remove();

    let months = [];

    for(let p of MY_JSON){
        for(let dt of p.dates){
            if(!months.includes(dt.month) && dt.year === CURRENT_YEAR){
                months.push(dt.month);
                let option = c("option", { value: dt.month, text: MONTH_NAMES[dt.month] });
                $("select#months").append(option);
            }
        }
    }
    
    $("select#months option").css({ background: "orange", color: "#000000" });
    toggle_load(false);
}

function copy_object(o, proto){ // DONE
    let s = Object.assign({}, JSON.parse(JSON.stringify(o)));
    return Object.setPrototypeOf(s, proto);
}

function load_month(out=document.body){ // DONE
    if(CURRENT_YEAR === null && CURRENT_MONTH === null){
        return;
    }

    toggle_load(true);

    if(DEFAULT_MONTH_LOCATION !== null){
        out = $(DEFAULT_MONTH_LOCATION);
    }

    // load from MY_JSON based on CURRENT_YEAR and CURRENT_MONTH to CURRENT_DATE
    // CURRENT_DATE -> array of FitPerson
    //      - person.dates contains only CURRENT_YEAR and CURRENT_MONTH
    CURRENT_DATE = [];
    for(let p in MY_JSON){
        let new_p = copy_object(MY_JSON[p], FitPerson.prototype);

        let dates = [];
        // get dates based on CURRENT_YEAR and CURRENT_MONTH
        for(let dt of MY_JSON[p].dates){
            if(dt.year === CURRENT_YEAR && dt.month === CURRENT_MONTH){
                let new_dt = copy_object(dt, FitDate.prototype);

                let days = [];
                for(let d of dt.days){
                    days.push(copy_object(d, FitDay.prototype));
                }

                new_dt.days = days;
                dates.push(new_dt);
            }
        }

        new_p.dates = dates;

        CURRENT_DATE.push(new_p);
    }

    $(out).html("");

    for(let p in CURRENT_DATE){
        let trs = [];

        if(CURRENT_DATE[p].dates.length){
            let dt = CURRENT_DATE[p].dates[0];

            let add_icon = c("i", { class: "fas fa-plus" });
            let add_th = c("th", { colspan: 3, tag: add_icon });
            let add_tr = c("tr", { class: "add_day", tag: add_th });

            let first_ths = [
                c("th", { text: "Den" }),
                c("th", { text: "Poznámka" }),
                c("th", { text: "Akce" })
            ];
            let first_tr = c("tr", { class: "first", tags: first_ths });

            trs.push(add_tr);
            trs.push(first_tr);

            for(let d in dt.days){
                let day = dt.days[d];
                let day_icons = [
                    c("i", { class: "fas fa-arrow-up" }),
                    c("i", { class: "fas fa-arrow-down" }),
                    c("i", { class: "fas fa-pen" }),
                    c("i", { class: "fas fa-trash" })
                ];
                let full_date = day.date + "." + (dt.month + 1) + "." + dt.year;
                let note = day.note && day.note.length > 24 ? day.note.substring(0, 20) + "..." : day.note;
                let day_tds = [
                    c("td", { text: full_date }),
                    c("td", { text: note }),
                    c("td", { tags: day_icons })
                ];
                let day_tr = c("tr", { class: "day", "data-id": d, tags: day_tds });
                trs.push(day_tr);
            }
        } else {
            let add_icon = c("i", { class: "fas fa-plus" });
            let add_th = c("th", { tag: add_icon });
            let add_tr = c("tr", { class: "add_day", tag: add_th });
            trs.push(add_tr);

            let nothing_td = c("td", { text: "No data available" });
            let nothing_tr = c("tr", { tag: nothing_td });
            trs.push(nothing_tr);
        }

        let name = c("h1", { text: CURRENT_DATE[p].name });
        let table = c("table", { class: "days_in_month", tags: trs });
        let person = c("div", { class: "person", "data-id": p, tags: [name, table] });
        out.append(person);
    }

    // render graphs
    for(let c of CURRENT_GRAPHS){
        c.remove();
    }

    CURRENT_GRAPHS = [];
    for(let p in CURRENT_DATE){
        let dts = CURRENT_DATE[p].dates;
        let isThere = dts.length > 0;

        let s = ( sketch ) => {
            sketch.gpoints = [];

            class GPoint {
                constructor(x, y, r, w, c){
                    this.x = x;
                    this.y = y;
                    this.r = r;
                    this.w = w;
                    this.c = c;
                }

                show(){
                    sketch.strokeWeight(0);
                    sketch.fill(this.c);
                    sketch.ellipse(this.x, this.y, this.r);
                }
            }

            let canvas;
            let fill_checkbox, point_num_checkbox, height_num_checkbox;
            let cpad = 20;
            let firstpad = 50;
            let textpad = 16;
            sketch.setup = () => {
                canvas = sketch.createCanvas(sketch.windowWidth / CURRENT_DATE.length - 50, 250);

                if(isThere){
                    let cp = canvas.position();

                    fill_checkbox = sketch.createCheckbox('  Fill', true);
                    fill_checkbox.position(cp.x + sketch.width - cpad, cp.y + 1);

                    point_num_checkbox = sketch.createCheckbox('  Weights', false);
                    point_num_checkbox.position(cp.x + sketch.width - (cpad * 5), cp.y + 1);

                    height_num_checkbox = sketch.createCheckbox('  Scale', true);
                    height_num_checkbox.position(cp.x + sketch.width - (cpad * 10), cp.y + 1);

                    let start_y = sketch.map(CURRENT_DATE[p].start_weight, MAX_WEIGHT, MIN_WEIGHT, cpad, sketch.height - cpad);
                    sketch.gpoints.push(new GPoint(firstpad, start_y, 10, CURRENT_DATE[p].start_weight, sketch.color(255, 51, 51)));

                    let xpad = (sketch.width - cpad) / (dts[0].days.length + 1);
                    let xindex = 1;
                    for(let d of dts[0].days){
                        if(d.weight === 0){
                            sketch.gpoints.push(new GPoint(xpad * xindex + cpad, sketch.height - cpad - 1, 10, d.weight, sketch.color(30, 144, 255)));
                        } else {
                            let y = sketch.map(d.weight, MIN_WEIGHT, MAX_WEIGHT, sketch.height - cpad, cpad);
                            sketch.gpoints.push(new GPoint(xpad * xindex + cpad, y, 10, d.weight, sketch.color(30, 144, 255)));
                        }
                        xindex++;
                    }
                }
            };

            sketch.windowResized = () => {
                sketch.resizeCanvas(sketch.windowWidth / CURRENT_DATE.length - 50, 250);

                if(isThere){
                    let cp = canvas.position();
                    fill_checkbox.position(cp.x + sketch.width - cpad, cp.y + 1);
                    point_num_checkbox.position(cp.x + sketch.width - cpad * 5, cp.y + 1);
                    height_num_checkbox.position(cp.x + sketch.width - (cpad * 10), cp.y + 1);

                    sketch.gpoints[0].x = firstpad;
                    
                    let xpad = (sketch.width - cpad) / (dts[0].days.length + 1);
                    for(let x = 1; x < sketch.gpoints.length; x++){
                        sketch.gpoints[x].x = xpad * x + cpad;
                    }
                }
            };

            sketch.show_base_meter = () => {
                sketch.strokeWeight(3);
                sketch.stroke(255);
                sketch.line(cpad*2, cpad, sketch.width, cpad);
                sketch.line(cpad*2, sketch.height - cpad, sketch.width, sketch.height - cpad);

                sketch.strokeWeight(0);
                sketch.fill(255);
                sketch.text(MIN_WEIGHT, 3, sketch.height - cpad + (textpad / 2 - 3));
                sketch.text(MAX_WEIGHT, 3, cpad + (textpad / 2 - 3));
            }

            sketch.show_detailed_meter = () => {
                for(let w = MIN_WEIGHT; w < MAX_WEIGHT; w += (MAX_WEIGHT - MIN_WEIGHT) / 10){
                    let wy = sketch.map(w, MIN_WEIGHT, MAX_WEIGHT, sketch.height - cpad, cpad);
                    
                    if(w !== MIN_WEIGHT && w !== MAX_WEIGHT){
                        sketch.strokeWeight(3);
                        sketch.stroke(255);
                        sketch.line(cpad*2, wy, sketch.width, wy);
                        sketch.strokeWeight(0);
                        sketch.text(w, 3, wy + (textpad / 2 - 3))
                    }
                }
            }

            sketch.draw = () => {
                if(!isThere){
                    sketch.textSize(24);
                    sketch.textAlign(sketch.CENTER, sketch.CENTER);
                    sketch.background(0);
                    sketch.fill(255);
                    sketch.text("No data!", sketch.width / 2, sketch.height / 2);
                    sketch.noLoop();
                } else {
                    sketch.background(0);
                    
                    sketch.show_base_meter();
                    if(height_num_checkbox.checked()){
                        sketch.show_detailed_meter();
                    }

                    if(!fill_checkbox.checked()){
                        let current = sketch.gpoints[0];

                        for(let i = 1; i < sketch.gpoints.length; i++){
                            let next = sketch.gpoints[i];
                            sketch.line(current.x, current.y,  next.x, next.y);

                            current = next;
                        }

                        let pindex = 0;
                        for(let p of sketch.gpoints){
                            p.show();

                            if(point_num_checkbox.checked() || pindex === 0){
                                sketch.strokeWeight(1);
                                sketch.stroke(p.c);
                                sketch.textSize(textpad);
                                sketch.fill(p.c);
                                sketch.text(p.w, p.x - p.r + 1, p.y - 10);
                                sketch.strokeWeight(0);
                            }

                            pindex++;
                        }
                    } else {
                        sketch.beginShape();
                        sketch.strokeWeight(1);
                        sketch.fill(255);

                        let first = sketch.gpoints[0];
                        let current = sketch.gpoints[0];

                        sketch.vertex(first.x, first.y);
                        for(let i = 1; i < sketch.gpoints.length; i++){
                            let next = sketch.gpoints[i];
                            sketch.vertex(next.x, next.y);
                            current = next;
                        }

                        let my = sketch.height - cpad - 1;
                        sketch.vertex(current.x, my);
                        sketch.vertex(first.x, my);
                        sketch.vertex(first.x, first.y);
                        sketch.endShape(sketch.CLOSE);
                    }

                    let pindex = 0;
                    for(let p of sketch.gpoints){
                        p.show();

                        if(point_num_checkbox.checked() || pindex === 0){
                            sketch.strokeWeight(1);
                            sketch.stroke(p.c);
                            sketch.textSize(textpad);
                            sketch.fill(p.c);
                            sketch.text(p.w, p.x - p.r + 1, p.y - 10);
                            sketch.strokeWeight(0);
                        }

                        pindex++;
                    }
                }
            };
        };

        CURRENT_GRAPHS.push(new p5(s, 'graphs'));
    }

    toggle_load(false);
}