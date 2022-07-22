import TaskListDay from "./TaskListDay";

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
// Generates display for the list
function TaskList(props){

    // An array of arrays where each array element contains the assignments for a particular day for the current week
    const thisWkDailyAssign = generateThisWkDailyAssign();
    // Organizes the assignments for the current week into assignments for each of the seven days,
    // then sorts the subarray assignments to be in chronological (ascending) order
    // and returns organized info as an array of arrays

    function generateWkDates(startDate, maxDay, prevMaxDay, nextMaxDay, currentMonth){
        let wkDates = [];
        let month = 0;
        for (let i=1; i<8; i++){
            let dateEntry = startDate + i;
            if (dateEntry > maxDay){
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


    function generateThisWkDailyAssign(){
        const thisWk = generateWkDates(props.current_wk_start, props.numDayInMonth, props.numDayInPrevMonth, props.numDayInNextMonth, props.month_num);
        const start = thisWk[0], end = thisWk[6];
        let monthBefore = (props.current_wk_start <= 0?
            (props.month_num-1 <= 0) ?
                12
                :  props.month_num - 1
            : props.month_num);
        let endDayNum = props.current_wk_start + 6,
            monthAfter = (endDayNum > props.numDayInMonth?
                (props.month_num + 1 > 12) ?
                    1
                    : props.month_num + 1
                : props.month_num);
        function isInUpcoming(monthStr){
            return (monthStr == props.num_to_month(props.month_num, true)
                || monthStr == props.num_to_month(monthBefore, true)
                || monthStr == props.num_to_month(monthAfter, true)
                || (month_to_num(monthStr) >= monthBefore && month_to_num(monthStr) <= monthAfter) )
        }

        let filteredArr = [];
        if(props.assignments.length > 0){
            props.assignments.map((c) => {
                let assignCArr=[];
                for(let i=0; i < c.length; i++){
                    const mon = c[i].dueData.substring(0,3);
                    if(isInUpcoming(mon)){

                        assignCArr.push(c[i])
                    }
                    else if (month_to_num(mon) < start[1]){
                        break;
                    }
                }
                filteredArr.push(assignCArr)
            })
        }
        let fullAssignArr = [];
        filteredArr.map((c)=> {
            for(let i=0; i < c.length; i++){
                const mo = month_to_num(c[i].dueData.substring(0,3)), date = Number(c[i].dueData.substring(4,6));
                if (start[1] == end[1]){
                    if(date >= start[0] && date <= end[0]){
                        fullAssignArr.push(c[i]);
                    }
                    else if (date < start[0]){
                        break;
                    }
                }
                else {
                    if (mo == start[1]){
                        if(date >= start[0]){
                            fullAssignArr.push(c[i]);
                        }
                        else{
                            break;
                        }
                    }
                    else{
                        if(date <= end[0]){
                            fullAssignArr.push(c[i]);
                        }
                    }
                }
            }})
        let dayAssArr = [];
        for (let i = 0; i<7; i++){
            let dArr = [];
            for(let j = 0; j < fullAssignArr.length; j++){
                if (Number(fullAssignArr[j].dueData.substring(4,6)) == thisWk[i][0]){
                    dArr.push(fullAssignArr[j])
                }
            }
            dArr = sortAssign(dArr)
            dayAssArr.push(dArr)
        }
        return dayAssArr;
    }

    // (Using selection sort) Sorts the array of assignments into chronological (ascending) order
    function sortAssign(dArr){
        let sorted = (dArr? dArr : [])
        if(sorted.length > 1){
            for(let i = 0; i < sorted.length; i++){
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

    return(
        <div className={"ms-lg-0 me-lg-5 mx-md-5 mx-3 pb-2 mt-4 mt-lg-0 mb-lg-0 task_card"}>
            <div className={"task_card_contents"}>
                <TaskListDay month_num={props.month_num} year={props.year} current={props.current} current_wk_start={props.current_wk_start} dayOfWeek={"monday"}
                             assignments={thisWkDailyAssign[0]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current={props.current} current_wk_start={props.current_wk_start} dayOfWeek={"tuesday"}
                             assignments={thisWkDailyAssign[1]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current={props.current} current_wk_start={props.current_wk_start} dayOfWeek={"wednesday"}
                             assignments={thisWkDailyAssign[2]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current={props.current} current_wk_start={props.current_wk_start} dayOfWeek={"thursday"}
                             assignments={thisWkDailyAssign[3]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current={props.current} current_wk_start={props.current_wk_start} dayOfWeek={"friday"}
                             assignments={thisWkDailyAssign[4]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current={props.current} current_wk_start={props.current_wk_start} dayOfWeek={"saturday"}
                             assignments={thisWkDailyAssign[5]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current={props.current} current_wk_start={props.current_wk_start} dayOfWeek={"sunday"}
                             assignments={thisWkDailyAssign[6]}/>
            </div>
        </div>
    );
}

export default TaskList;