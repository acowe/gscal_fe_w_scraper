import {Container, Row, Col} from "react-bootstrap";
import CalWeek from "./CalWeek";
import CalCourses from "./CalCourses"
import CalWkDays from "./CalWkDays";
import {useState} from "react";

function month_to_num(m){
    switch (m) {
        case "Jan":
            return 1;
            break;
        case "Feb":
            return 2;
            break;
        case "Mar":
            return 3;
            break;
        case "Apr":
            return 4;
            break;
        case "May":
            return 5;
            break;
        case "Jun":
            return 6;
            break;
        case "Jul":
            return 7;
            break;
        case "Aug":
            return 8;
            break;
        case "Sep":
            return 9;
            break;
        case "Oct":
            return 10;
            break;
        case "Nov":
            return 11;
            break;
        case "Dec":
            return 12;
            break;
        default:
            return -1;
    }
}
// Given a month number and a year, returns the number of days in the month of the year
function daysInMonth (month, year) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
}

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

// Generates calendar display
function Calendar(props){

    // Course lists to manipulate display of courses
    const courseList = props.classes.map((c) => c.shortName);
    const courseNameMap = [["",""]].concat(props.classes.map((c) => [c.shortName, c.name]));

    // Variables to hold information about the current month, the number of days in the current month,
    // and the number of days in the month before it
    const month = props.num_to_month(props.month_num);
    const numDayInMonth = daysInMonth(props.month_num, props.year);
    const numDayInPrevMonth = (props.month_num == 1? daysInMonth(12, props.year - 1) : daysInMonth(props.month_num-1, props.year))
    const numDayInNextMonth = (props.month_num == 12? daysInMonth(1, props.year + 1) : daysInMonth(props.month_num+1, props.year))
    const startOfMonth = generateWkDates(props.current_wk_start, numDayInMonth, numDayInPrevMonth, numDayInNextMonth, props.month_num)[0],
          endOfMonth = generateWkDates(props.current_wk_start + 28, numDayInMonth, numDayInPrevMonth, numDayInNextMonth, props.month_num)[6];
    // State variables to control display of elements on the calendar
    const [filter, setCourseFilter] = useState(["",""]);
    const [weekPos, setWeekPos] = useState(0)


    // Assignments for the month;
    const assignArr = generateAssignArrSimple();
    const wkAssArr = generateWklyAssign();
    // An array of arrays, where each element is an array of assignments for a particular week
    //const wklyAssigns = generateWklyAssign();

    // Organizes the assignments for the month into assignments for each of the five displayed week
    // and returns organized info as an array of arrays

    function generateAssignArrSimple(){
        let retArr = []
        if (props.assignments.length > 0){
            let monthBefore = (props.current_wk_start <= 0?
                (props.month_num-1 <= 0) ?
                    12
                    :  props.month_num - 1
                : props.month_num);
            let endDayNum = props.current_wk_start + 34,
                monthAfter = (endDayNum > numDayInMonth?
                (props.month_num + 1 > 12) ?
                    1
                    :  (endDayNum > numDayInMonth + numDayInNextMonth)?
                        props.month_num + 2
                        : props.month_num + 1
                : props.month_num);
            function isInUpcoming(monthStr){
                return (monthStr == props.num_to_month(props.month_num, true) || monthStr == props.num_to_month(monthBefore, true) || monthStr == props.num_to_month(monthAfter, true)
                    || (month_to_num(monthStr) >= monthBefore && month_to_num(monthStr) <= monthAfter) )
            }
            let filteredArr = [];
            props.assignments.map((c) => {
                let filteredCArr = [];
                for (let i=0; i < c.length; i++){
                    const mon = c[i].dueData.substring(0,3);
                    if(isInUpcoming(mon)){
                        filteredCArr.push(c[i])
                    }
                    else if (month_to_num(mon) < monthBefore){
                        break;
                    }
                }
                filteredArr.push(filteredCArr)
            })
            filteredArr.map((c)=> {
                for(let i=0; i < c.length; i++){
                    const mo = month_to_num(c[i].dueData.substring(0,3)), date = Number(c[i].dueData.substring(4,6));
                    if (mo == startOfMonth[1]){
                        if(date >= startOfMonth[0]){
                            retArr.push(c[i]);
                        }
                        else{
                            break;
                        }
                    }
                    else if(mo == endOfMonth[1]){
                        if(date <= endOfMonth[0]){
                            retArr.push(c[i]);
                        }
                    }
                    else {
                        if(mo > startOfMonth[1] && mo < endOfMonth[1]){
                            retArr.push(c[i]);
                        }
                    }
                }})
        }
        return retArr
    }

    function generateWklyAssign(){
        if(assignArr.length != 0){
            let retArr = [];
            let assignHold = assignArr;
            for(let i=0; i<5;i++){
                const wkStart = props.current_wk_start + (7*i),
                    wkArr = generateWkDates(wkStart, numDayInMonth, numDayInPrevMonth, numDayInNextMonth, props.month_num);
                let wkAssArr = [];
                for(let j=0; j<7;j++){
                    let thisMonthShort = props.num_to_month(wkArr[j][1], true);
                    let replace = [];
                    let dayAssArr = [];
                    assignHold.map((a) => {
                            if (a.dueData.substring(0,3) == thisMonthShort && Number(a.dueData.substring(4,6))== wkArr[j][0]){
                                dayAssArr.push(a)
                            }
                            else{
                                replace.push(a)
                            }
                    })
                    wkAssArr.push(dayAssArr)
                    assignHold = replace
                }
                retArr.push(wkAssArr)
            }
            return retArr;
        }
        else{
            return [[],[],[],[],[],[],[]];
        }

    }


    // Changes the course filter (for filtered display of events by course)
    function changeFilter(elem_id){
        let courseMap =  (courseList?  courseNameMap: [])
        if(elem_id == filter[0]){
            setCourseFilter(["",""]);
        }
        else{
            for (let i=0; i < courseMap.length; i++){
                if(courseMap[i][0] == elem_id){
                    setCourseFilter(courseMap[i]);
                    return;
                }
            }
            setCourseFilter(["",""]);
        }
    }

    // Changes the week position (ie the week displayed on smaller display windows)
    function changeWeekPos(dir){
        if(dir == "up"){
            if (weekPos > 0){
                setWeekPos(weekPos-1);
            }
        }
        else{
            if(weekPos < 4){
                setWeekPos(weekPos + 1);
            }
        }
    }

    return(
        <div className={"mx-md-5 mx-3 my-3 my-md-4 mt-lg-4 mb-lg-3 pb-2 pb-lg-4 pb-xl-3 cal_card"}>
            <h1 className={"cal_head"}>{month + " " + props.year}</h1>
            <div className={"cal_stuff_immovable"}>
                <div className={"cal_stuff_movable down_"+weekPos.toString()}>
                    <CalWkDays/>
                    <Container className={"mx-sm-0 px-0 cal"}>
                        <CalWeek assignList={wkAssArr[0]} courseNameMap={courseNameMap} current={props.current}
                                 dayInPrevMonth={numDayInPrevMonth} dayInMonth={numDayInMonth} dayInNextMonth = {numDayInNextMonth}
                                 enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start} wk_type={"cal_wk_fst"}
                                 wkNum={1}/>
                        <CalWeek assignList={wkAssArr[1]} courseNameMap={courseNameMap} current={props.current}
                                 dayInPrevMonth={numDayInPrevMonth} dayInMonth={numDayInMonth} dayInNextMonth = {numDayInNextMonth}
                                 enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start+7} wk_type={"cal_wk snd"}
                                 wkNum={8}/>
                        <CalWeek assignList={wkAssArr[2]} courseNameMap={courseNameMap} current={props.current}
                                 dayInPrevMonth={numDayInPrevMonth} dayInMonth={numDayInMonth} dayInNextMonth = {numDayInNextMonth}
                                 enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start+14} wk_type={"cal_wk trd"}
                                 wkNum={15}/>
                        <CalWeek assignList={wkAssArr[3]} courseNameMap={courseNameMap} current={props.current}
                                 dayInPrevMonth={numDayInPrevMonth} dayInMonth={numDayInMonth} dayInNextMonth = {numDayInNextMonth}
                                 enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start+21} wk_type={"cal_wk frt"}
                                 wkNum={22}/>
                        <CalWeek assignList={wkAssArr[4]} courseNameMap={courseNameMap} current={props.current}
                                 dayInPrevMonth={numDayInPrevMonth} dayInMonth={numDayInMonth} dayInNextMonth = {numDayInNextMonth}
                                 enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start+28} wk_type={"cal_wk_last"}
                                 wkNum={29}/>
                    </Container>
                </div>
            </div>
            <div className={"cal_up_down"}>
                <div className={"cud_up"} onClick={(e)=> changeWeekPos("up")}><i className="fa-solid fa-angle-up"></i></div>
                <div className={"cud_down"} onClick={(e)=> changeWeekPos("down")}><i className="fa-solid fa-angle-down"></i></div>
            </div>
            <CalCourses courseList={(courseList? courseList : [])} changeFilter={changeFilter} filter={filter[0]}/>
        </div>
    );
}

export default Calendar;