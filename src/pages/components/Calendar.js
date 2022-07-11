import {Container, Row, Col} from "react-bootstrap";
import CalWeek from "./CalWeek";
import CalCourses from "./CalCourses"
import CalWkDays from "./CalWkDays";
import {useState} from "react";

// Given a month number and a year, returns the number of days in the month of the year
function daysInMonth (month, year) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
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

    // State variables to control display of elements on the calendar
    const [filter, setCourseFilter] = useState(["",""]);
    const [weekPos, setWeekPos] = useState(0)

    // Assignments for the month; (Currently set to March)
    const assignArr = (props.assignments.length > 0? props.assignments.map((c) => c.filter((a)=> a.dueData.substring(0,3) == "Mar")) : []);

    // An array of arrays, where each element is an array of assignments for a particular week
    const wklyAssigns = generateWklyAssign();


    // Organizes the assignments for the month into assignments for each of the five displayed week
    // and returns organized info as an array of arrays
    function generateWklyAssign(){
        let fullAssignArr = [];
        assignArr.map((c) => c.map((a) => fullAssignArr.push(a)));
        let retArr = [];
        if(assignArr.length > 0){
            for(let j = 0; j<5; j++){
                let weekStart = (7*j) - 1, weekEnd = weekStart + 6;
                let wkAssArr = fullAssignArr.filter((a) => ((weekStart <= Number(a.dueData.substring(4,6))) && (Number(a.dueData.substring(4,6)) <= weekEnd)) );
                retArr.push(wkAssArr);
            }
        }
        return retArr;
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
                        <CalWeek assignList={wklyAssigns[0]} courseNameMap={courseNameMap} dayInPrevMonth={numDayInPrevMonth}
                                 dayInMonth={numDayInMonth} enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start} wk_type={"cal_wk_fst"}
                                 wkNum={1}/>
                        <CalWeek assignList={wklyAssigns[1]} courseNameMap={courseNameMap} dayInPrevMonth={numDayInPrevMonth}
                                 dayInMonth={numDayInMonth} enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start+7} wk_type={"cal_wk snd"}
                                 wkNum={8}/>
                        <CalWeek assignList={wklyAssigns[2]} courseNameMap={courseNameMap} dayInPrevMonth={numDayInPrevMonth}
                                 dayInMonth={numDayInMonth} enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start+14} wk_type={"cal_wk trd"}
                                 wkNum={15}/>
                        <CalWeek assignList={wklyAssigns[3]} courseNameMap={courseNameMap} dayInPrevMonth={numDayInPrevMonth}
                                 dayInMonth={numDayInMonth} enableEventOn={props.enableEventOn} eventOn={props.eventOn}
                                 filter={filter[1]} month={props.month_num} year={props.year} num_to_month={props.num_to_month}
                                 selected={props.selected} timeToNum={props.timeToNum} wk_of={props.current_wk_start+21} wk_type={"cal_wk frt"}
                                 wkNum={22}/>
                        <CalWeek assignList={wklyAssigns[4]} courseNameMap={courseNameMap} dayInPrevMonth={numDayInPrevMonth}
                                 dayInMonth={numDayInMonth} enableEventOn={props.enableEventOn} eventOn={props.eventOn}
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