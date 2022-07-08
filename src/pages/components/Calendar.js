import {Container, Row, Col} from "react-bootstrap";
import CalWeek from "./CalWeek";
import CalCourses from "./CalCourses"
import {useState} from "react";

function num_to_month(n){
    switch (n) {
        case 1:
            return "january";
            break;
        case 2:
            return "february";
            break;
        case 3:
            return "march";
            break;
        case 4:
            return "april";
            break;
        case 5:
            return "may";
            break;
        case 6:
            return "june";
            break;
        case 7:
            return "july";
            break;
        case 8:
            return "august";
            break;
        case 9:
            return "september";
            break;
        case 10:
            return "october";
            break;
        case 11:
            return "november";
            break;
        case 12:
            return "december";
            break;
        default:
            return "month";
    }
}

function daysInMonth (month, year) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
}



function Calendar(props){
    const courseList = ["chem", "math", "phys", "bio", "csci","engr","other"];
    const courseNameMap = [["",""], ["chem", "HMC Chemistry 23B SP22"],["math", "HMC Math 73 SP22"],
        ["phys", "HMC Phys 24 Sec 1-8 SP22"], ["bio", "Bio 52"], ["csci", "CS60 Spring 2020"], ["engr", "HMC E79 Fall 2020"], ["other", "HMC CS124 FA21"]];
    const courseListAlt = props.classes.map((c) => c.shortName);
    const courseNameMapAlt = [["",""]].concat(props.classes.map((c) => [c.shortName, c.name]));
    const assignArr = (props.assignments.length > 0? props.assignments.map((c) => c.filter((a)=> a.dueData.substring(0,3) == "Mar")) : []);
    const wklyAssigns = generateWklyAssign();
    const month = props.num_to_month(props.month_num);
    const numDayInMonth = daysInMonth(props.month_num, props.year);
    const numDayInPrevMonth = (props.month_num == 1? daysInMonth(12, props.year - 1) : daysInMonth(props.month_num-1, props.year))
    const [filter, setCourseFilter] = useState(["",""]);
    const [weekPos, setWeekPos] = useState(0)

    function changeFilter(elem_id){
        let courseMap =  (courseListAlt?  courseNameMapAlt: courseNameMap)
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


    return(
        <div className={"mx-md-5 mx-3 my-3 my-md-4 mt-lg-4 mb-lg-3 pb-2 pb-lg-4 pb-xl-3 cal_card"}>
            <h1 className={"cal_head"}>{month + " " + props.year}</h1>
            <div className={"cal_stuff_immovable"}>
                <div className={"cal_stuff_movable down_"+weekPos.toString()}>
                    <Row className={"mx-0 mt-1 mt-sm-3 mt-md-3 px-0 cal_days"}>
                        <Col style={{width:"14.28%"}} className={"px-0"}>
                            <p className={"my-0 px-1 fs-6 dow_full"}>sunday</p>
                            <p className={"my-0 px-1 fs-6 dow_short"}>sun</p>
                        </Col>
                        <Col style={{width:"14.28%"}} className={"px-0"}>
                            <p className={"my-0 px-1 fs-6 dow_full"}>monday</p>
                            <p className={"my-0 px-1 fs-6 dow_short"}>mon</p>
                        </Col>
                        <Col style={{width:"14.28%"}} className={"px-0"}>
                            <p className={"my-0 px-1 fs-6 dow_full"}>tuesday</p>
                            <p className={"my-0 px-1 fs-6 dow_short"}>tues</p>
                        </Col>
                        <Col style={{width:"14.28%"}} className={"px-0"}>
                            <p className={"my-0 px-1 fs-6 dow_full"}>wednesday</p>
                            <p className={"my-0 px-1 fs-6 dow_short"}>wed</p>
                        </Col>
                        <Col style={{width:"14.28%"}} className={"px-0"}>
                            <p className={"my-0 px-1 fs-6 dow_full"}>thursday</p>
                            <p className={"my-0 px-1 fs-6 dow_short"}>thu</p>
                        </Col>
                        <Col style={{width:"14.28%"}} className={"px-0"}>
                            <p className={"my-0 px-1 fs-6 dow_full"}>friday</p>
                            <p className={"my-0 px-1 fs-6 dow_short"}>fri</p>
                        </Col>
                        <Col style={{width:"14.28%"}} className={"px-0"}>
                            <p className={"my-0 px-1 fs-6 dow_full"}>saturday</p>
                            <p className={"my-0 px-1 fs-6 dow_short"}>sat</p>
                        </Col>
                    </Row>
                    <Container className={"mx-sm-0 px-0 cal"}>
                        <CalWeek month={props.month_num} year={props.year} dayInMonth={numDayInMonth} wk_type={"cal_wk_fst"} wkNum={1} wk_of={props.current_wk_start}
                                 filter={filter[1]} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                                 dayInPrevMonth={numDayInPrevMonth} assignList={wklyAssigns[0]} courseNameMap={courseNameMapAlt}/>
                        <CalWeek month={props.month_num} year={props.year} dayInMonth={numDayInMonth} wk_type={"cal_wk snd"} wkNum={8} wk_of={props.current_wk_start+7}
                                 filter={filter[1]} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                                 dayInPrevMonth={numDayInPrevMonth} assignList={wklyAssigns[1]} courseNameMap={courseNameMapAlt}/>
                        <CalWeek month={props.month_num} year={props.year} dayInMonth={numDayInMonth} wk_type={"cal_wk trd"} wkNum={15} wk_of={props.current_wk_start+14}
                                 filter={filter[1]} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                                 dayInPrevMonth={numDayInPrevMonth} assignList={wklyAssigns[2]} courseNameMap={courseNameMapAlt}/>
                        <CalWeek month={props.month_num} year={props.year} dayInMonth={numDayInMonth} wk_type={"cal_wk frt"} wkNum={22} wk_of={props.current_wk_start+21}
                                 filter={filter[1]} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                                 dayInPrevMonth={numDayInPrevMonth} assignList={wklyAssigns[3]} courseNameMap={courseNameMapAlt}/>
                        <CalWeek month={props.month_num} year={props.year} dayInMonth={numDayInMonth} wk_type={"cal_wk_last"} wkNum={29} wk_of={props.current_wk_start+28}
                                 filter={filter[1]} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                                 dayInPrevMonth={numDayInPrevMonth} assignList={wklyAssigns[4]} courseNameMap={courseNameMapAlt}/>
                    </Container>
                </div>

            </div>
            <div className={"cal_up_down"}>
                <div className={"cud_up"} onClick={(e)=> changeWeekPos("up")}><i className="fa-solid fa-angle-up"></i></div>
                <div className={"cud_down"} onClick={(e)=> changeWeekPos("down")}><i className="fa-solid fa-angle-down"></i></div>
            </div>
            <CalCourses courseList={(courseListAlt? courseListAlt : courseList)} changeFilter={changeFilter} filter={filter[0]}/>
        </div>

    );
}

export default Calendar;