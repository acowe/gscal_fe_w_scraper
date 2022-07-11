import TaskListDay from "./TaskListDay";

// Generates display for the list
function TaskList(props){

    // An array of arrays where each array element contains the assignments for a particular day for the current week
    const thisWkDailyAssign = generateThisWkDailyAssign();

    // Organizes the assignments for the current week into assignments for each of the seven days,
    // then sorts the subarray assignments to be in chronological (ascending) order
    // and returns organized info as an array of arrays
    function generateThisWkDailyAssign(){
        const assignArr = (props.assignments.length > 0? props.assignments.map((c) => c.filter((a)=> a.dueData.substring(0,3) == "Mar")) : []);
        let fullAssignArr = [];
        assignArr.map((c) => c.map((a) => fullAssignArr.push(a)));
        let wkAssArr = [], dayAssArr = [];
        if(fullAssignArr.length > 0){
            let weekStart = props.current_wk_start + 1, weekEnd = weekStart + 6;
            wkAssArr = fullAssignArr.filter((a) => ((weekStart <= Number(a.dueData.substring(4,6))) && (Number(a.dueData.substring(4,6)) <= weekEnd)) );
        }
        for (let i = 1; i<8; i++){
            let dArr = wkAssArr.filter((a) => a.dueData.substring(4,6) == props.current_wk_start+i)
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
                <TaskListDay month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"monday"}
                             assignments={thisWkDailyAssign[0]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"tuesday"}
                             assignments={thisWkDailyAssign[1]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"wednesday"}
                             assignments={thisWkDailyAssign[2]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"thursday"}
                             assignments={thisWkDailyAssign[3]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"friday"}
                             assignments={thisWkDailyAssign[4]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"saturday"}
                             assignments={thisWkDailyAssign[5]}/>
                <TaskListDay month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"sunday"}
                             assignments={thisWkDailyAssign[6]}/>
            </div>
        </div>
    );
}

export default TaskList;