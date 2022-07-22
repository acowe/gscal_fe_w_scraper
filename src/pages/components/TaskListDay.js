
// Given a day of the week, returns a corresponding number
function day_to_num(d){
    switch (d) {
        case "sunday":
            return 7;
            break;
        case "monday":
            return 1;
            break;
        case "tuesday":
            return 2;
            break;
        case "wednesday":
            return 3;
            break;
        case "thursday":
            return 4;
            break;
        case "friday":
            return 5;
            break;
        case "saturday":
            return 6;
            break;
        default:
            return 0;
    }
}

// Generates display for a list-day in the list
function TaskListDay(props){

    // Variables to hold information about the current day
    const current = props.current, today = (current.getDay() == 0? 7: current.getDay());
    const entryDayNum = day_to_num(props.dayOfWeek);
    const dayPassed = (entryDayNum < today? true: false);
    const isToday = (entryDayNum == today? true : false);
    const listType = (props.assignments.length <= 0? "none_type" : "task_day_list");


    function isPast(time){
        let hr = ((time.substring(5,7) == "PM")? Number(time.substring(0,2)) + 12 : Number(time.substring(0,2))),
            min = Number(time.substring(3,5));
        if (isToday){
            if (hr < current.getHours()){
                if (min < current.getMinutes()){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        return dayPassed;
    };

    // Display variable to generate the lists for each day within the greater list
    //passed.toString()
    const displayDue =
        props.assignments.map((a,i) =>
            {
                let timeString = a.dueData.substring(10,17);
                let passed = isPast(timeString).toString();
                return (<li className={"passed_" + passed}>
                    <div className={"list_content"}>
                        <div className={"course_text"}>{a.course}</div>
                        <div className={"list_time"}>
                            <p className={"mb-0 list_time_text"}>{timeString}</p>
                        </div>
                    </div>
                </li>);
            }
        );


    return(
        <div className={"mx-2 mx-sm-3 mt-1 mb-2 task_day_entry"}>
            <h2 className={"fs-3 td_day"}>{props.dayOfWeek}</h2>
            <ul className={"mb-5 " + listType}>
                {displayDue}
                {(props.assignments.length <= 0) && <li>none!</li>}

            </ul>
            <div className={"tde_bottom"}> </div>
        </div>
    );
}

export default TaskListDay;