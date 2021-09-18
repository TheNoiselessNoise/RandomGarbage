class FitDay {
    constructor(){
        this.date = null;
        this.meal = {
            breakfast: null,
            snack1: null,
            lunch: null,
            snack2: null,
            dinner1: null,
            dinner2: null
        };
        this.weight = 0;
        this.note = null;
    }
}

class FitDate {
    constructor(){
        this.year = null;
        this.month = null;
        this.days = []; // array of object FitDay
    }

    swap(i, j){
        let tmp = this.days[i];
        this.days[i] = this.days[j];
        this.days[j] = tmp;
    }

    day_exists(num){
        for(let d of this.days){
            if(d.date === num){
                return true;
            }
        }

        return false;
    }

    num_of_days() {
        return new Date(this.year, this.month, 0).getDate();
    }
}

class FitPerson {
    constructor(){
        this.name = null;
        this.color = null;
        this.start_weight = null;
        this.target_weight = null;
        this.dates = []; // array of object FitDate
    }

    add_day(y, m, d){
        if(!(d instanceof FitDay)){
            return;
        }

        let dt = this.get_date(y, m);
        if(dt !== null){
            dt[1].days.push(d);
        }
    }

    get_day(y, m, d){
        let dt = this.get_date(y, m);
        if(dt !== null){
            return dt[1].days[d];
        }
        return null;
    }

    get_date(y, m){
        for(let dt in this.dates){
            if(this.dates[dt].year === y && this.dates[dt].month === m){
                return [dt, this.dates[dt]];
            }
        }

        return null;
    }

    is_day_movable(y, m, dindex, dir){
        let dt = this.get_date(y, m);
        if(dt !== null){
            let l = dt[1].days.length;

            if((dir === -1 && dindex === 0) || (dir === 1 && dindex === l - 1)){
                return false;
            }

            return true;
        }

        return false;
    }

    move_day(y, m, dindex, dir){
        if(this.is_day_movable(y, m, dindex, dir)){
            let dt = this.get_date(y, m);
            if(dt !== null){
                dt[1].swap(dindex, dindex + dir);
            }
        }
    }

    remove_day_by(y, m, dindex){
        let dt = this.get_date(y, m);
        if(dt !== null){
            dt[1].days.splice(dindex, 1);

            if(dt[1].days.length === 0){
                this.dates.splice(dt[0], 1);
            }
        }
    }
}