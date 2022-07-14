import {Row} from "react-bootstrap";
import CalDay from "./CalDay";


// Generates dates for the week
function generateWkDates(startDate, maxDay, prevMaxDay, nextMaxDay, currentMonth){
    let wkDates = [];
    let month = 0;
    for (let i=0; i<7; i++){
        let dateEntry = startDate + i;
        if(dateEntry > maxDay+nextMaxDay){
            dateEntry = dateEntry-(maxDay+nextMaxDay) ;
            month = currentMonth + 2;
        }
        else if (dateEntry > maxDay){
            dateEntry = dateEntry-maxDay;
            month = (currentMonth == 12? 1 :currentMonth + 1);
        }
        else if (dateEntry <= 0){
            dateEntry = dateEntry + prevMaxDay;
            month = (currentMonth == 1? 12 :currentMonth - 1);
        }
        else{
            month = currentMonth
        }
        wkDates.push([dateEntry,month]);
    }
    return wkDates;
}

// Generates an array holding the starting date of the week, the month, and the year
function generateStart(startDate, maxDay, prevMaxDay, month, year){
    let currentDay = startDate, currentMonth = month, currentYear = year;
    if (startDate > maxDay){
        currentDay = startDate - maxDay;
        currentMonth = month + 1;
        if(currentMonth > 12){
            currentMonth = 1;
            currentYear = year + 1
        }
    }
    if(startDate <= 0){
        currentDay = startDate + prevMaxDay;
        currentMonth = month - 1;
        if (currentMonth < 1){
            currentMonth = 12;
            currentYear = year - 1;
        }
    }
    return [currentDay, currentMonth, currentYear];
}

// Generates display for a week within the calendar
function CalWeek(props){


    // Variables to hold information about the week
    const thisWeekDates = generateWkDates(props.wk_of,props.dayInMonth, props.dayInPrevMonth, props.dayInNextMonth, props.month);
    const startArr = generateStart(props.wk_of, props.dayInMonth, props.dayInPrevMonth, props.month, props.year);

    // An array of arrays, where each element is an array of assignments for a particular day
    const thisWeekAssigns = props.assignList;
    // Organizes the assignments for the week into assignments for each of the seven days
    // and returns organized info as an array of arrays

    return(
        <Row className={"mx-0 " + props.wk_type}>
            <CalDay assignList={thisWeekAssigns[0]} courseNameMap={props.courseNameMap} current={props.current} day_of_month={thisWeekDates[0][0]} day_of_week={"sunday1"}
                    dayNum={props.wkNum} day_type={"cal_sun"} enableEventOn={props.enableEventOn} eventOn={props.eventOn} filter={props.filter}
                    month = {thisWeekDates[0][1]}  num_to_month={props.num_to_month}  selected={props.selected} timeToNum={props.timeToNum}/>
            <CalDay assignList={thisWeekAssigns[1]} courseNameMap={props.courseNameMap} current={props.current} day_of_month={thisWeekDates[1][0]} day_of_week={"monday"}
                    dayNum={props.wkNum+1} day_type={"cal_wkday"} enableEventOn={props.enableEventOn} eventOn={props.eventOn} filter={props.filter}
                    month = {thisWeekDates[1][1]}  num_to_month={props.num_to_month}  selected={props.selected} timeToNum={props.timeToNum}/>
            <CalDay assignList={thisWeekAssigns[2]} courseNameMap={props.courseNameMap} current={props.current} day_of_month={thisWeekDates[2][0]} day_of_week={"tuesday"}
                    dayNum={props.wkNum+2} day_type={"cal_wkday"} enableEventOn={props.enableEventOn} eventOn={props.eventOn} filter={props.filter}
                    month = {thisWeekDates[2][1]}  num_to_month={props.num_to_month}  selected={props.selected} timeToNum={props.timeToNum}/>
            <CalDay assignList={thisWeekAssigns[3]} courseNameMap={props.courseNameMap} current={props.current} day_of_month={thisWeekDates[3][0]} day_of_week={"wednesday"}
                    dayNum={props.wkNum+3} day_type={"cal_wkday"} enableEventOn={props.enableEventOn} eventOn={props.eventOn} filter={props.filter}
                    month = {thisWeekDates[3][1]}  num_to_month={props.num_to_month}  selected={props.selected} timeToNum={props.timeToNum}/>
            <CalDay assignList={thisWeekAssigns[4]} courseNameMap={props.courseNameMap} current={props.current} day_of_month={thisWeekDates[4][0]} day_of_week={"thursday"}
                    dayNum={props.wkNum+4} day_type={"cal_wkday"} enableEventOn={props.enableEventOn} eventOn={props.eventOn} filter={props.filter}
                    month = {thisWeekDates[4][1]}  num_to_month={props.num_to_month}  selected={props.selected} timeToNum={props.timeToNum}/>
            <CalDay assignList={thisWeekAssigns[5]} courseNameMap={props.courseNameMap} current={props.current}  day_of_month={thisWeekDates[5][0]} day_of_week={"friday"}
                    dayNum={props.wkNum+5} day_type={"cal_wkday"} enableEventOn={props.enableEventOn} eventOn={props.eventOn} filter={props.filter}
                    month = {thisWeekDates[5][1]}  num_to_month={props.num_to_month}  selected={props.selected} timeToNum={props.timeToNum}/>
            <CalDay assignList={thisWeekAssigns[6]} courseNameMap={props.courseNameMap} current={props.current}  day_of_month={thisWeekDates[6][0]} day_of_week={"saturday"}
                    dayNum={props.wkNum+6} day_type={"cal_sat"} enableEventOn={props.enableEventOn} eventOn={props.eventOn} filter={props.filter}
                    month = {thisWeekDates[6][1]}  num_to_month={props.num_to_month}  selected={props.selected} timeToNum={props.timeToNum}/>
        </Row>
    );
}

export default CalWeek;