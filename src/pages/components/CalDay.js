import {Col} from "react-bootstrap";

function CalDay(props){

    // Variables to hold information about the current date and month as well as the course filter
    const current = new Date(), date = props.current.getDate(), thisMonth = props.current.getMonth()+1,
    dayNum = props.dayNum, courseFilter = props.filter;

    // An array containing (chronologically organized) assignments for this calendar day
    const assigns = sortDayAssign();

    // Display variable to generate event elements within the calendar day
    const displayAssignmentsAlt = assigns.map((a,i) =>
    {
        let listId = dayNum.toString()+"a"+i.toString();
        let currentInd = i;
        let courseNum = getCourseNum(a.course);
        let select = props.selected,
            selDay = (select.length == 0 ? -1 : Number(select.split("a")[0])),
            selAssign = (select.length == 0 ? -1 : Number(select.split("a")[1]));
        let month = a.dueData.substring(0,3), timeString = a.dueData.substring(10,17);
        let eventOnStr = ((dayNum === selDay && i === selAssign)? "false" : props.eventOn.toString())
        if (courseFilter == "" || a.course == courseFilter){
                return (<li id={listId} key={i} className={"course_" + courseNum + " eventOn_" + eventOnStr}
                            onClick={(e)=> eventOn(e.target.id,i)} >
                    <div id={"d"+listId} className={props.day_of_week + " text-start text-wrap event_card_false"}>
                        <h5>{a.name}</h5>
                        <p className={"my-0 text-start fs-6"}>Course: {a.course}</p>
                        <p className={"mb-1 text-start fs-6"}>Due: {month + " " + props.day_of_month + ", " + timeString}</p>
                    </div>
                    <p id={"p"+listId} className={"to_do_text"} onClick={(e)=> eventOn(e.target.id,i)}>{a.name}</p>
                </li>);
        }

    });



    // (Using selection sort) Sorts the array of assignments (from props) into chronological (ascending) order
    function sortDayAssign(){
        let sorted = (props.assignList? props.assignList : [])
        if(sorted.length > 1){
            for(let i = 0; i < sorted.length; i++){
                let minInd = i;
                for(let j = i+1; j < sorted.length; j++){
                    let i_time = props.timeToNum(sorted[i].dueData.substring(10,17)), j_time = props.timeToNum(sorted[j].dueData.substring(10,17))
                    if(j_time < i_time){
                        let temp = sorted[j]
                        sorted[j] = sorted[i]
                        sorted[i] = temp
                    }
                }
            }
        }
        return sorted;
    }

    //console.log(dayNum.toString() + ": " + props.assignList)

    // Given a course filter, returns the number of assignment events to be displayed
    function filterCount(courseName){
        if (courseName != ""){
            let filteredCourses = assigns.filter(a => (a.course == courseName));
            return filteredCourses.length;
        }
        else{
            return assigns.length;
        }
    }

    // Enables display of event card for the selected event such that the selected event displays at full opacity
    // and unselected events are displayed at reduced opacity
    function eventOn(id, ind){
        if (!props.eventOn){
            let course = assigns[ind].course, month = assigns[ind].dueData.substring(0,3), timeString = assigns[ind].dueData.substring(10,17);
            let idStr = (id.charAt(0) == "p" ? id.substring(1) : id);
            const element2 = document.getElementById("d"+idStr);
            element2.classList.remove("event_card_false");
            element2.classList.add("event_card_true");
            const title_elem = document.getElementById("aec_title_default"),
                course_elem = document.getElementById("aec_course"),
                due_elem = document.getElementById("aec_due");
            title_elem.innerHTML = assigns[ind].name;
            course_elem.innerHTML = "Course: " + course;
            due_elem.innerHTML = "Due: " + month + " " + props.day_of_month + ", " + timeString;
            props.enableEventOn(idStr);
        }
    }

    // Given a course name, returns the associated number for it
    // (to determine color for assignment event)
    function getCourseNum(cName){
        for (let i=0; i < props.courseNameMap.length; i++){
            if (cName == props.courseNameMap[i][1]){
                return i;
            }
        }
        return 1;
    }

    console.log(date == props.day_of_month)
    console.log(thisMonth === props.month)
    return(
        <Col style={{width:"14.28%"}} className={"px-0 " + props.day_type}>
            <div className={"px-1 isToday_" + (date == props.day_of_month && thisMonth === props.month).toString()}>
                <p className={"my-0 mx-0 text-end cal_date"}>
                    {props.day_of_month}</p>
            </div>
            <div className={"cal_content "+ ((filterCount(courseFilter) > 3) && "many")}>
                <ul className={"assign_events_list"}>
                    {displayAssignmentsAlt}
                </ul>
            </div>
        </Col>
    );
}

export default CalDay;