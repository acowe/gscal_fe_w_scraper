import TaskListEntry from "./TaskListEntry";

function TaskList(props){

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

    function sortAssign(dArr){
        let sorted = (dArr? dArr : [])
        if(sorted.length > 1){
            for(let i = 0; i < sorted.length; i++){
                for(let j = i+1; j < sorted.length; j++){
                    let i_time = timeToNum(sorted[i].dueData.substring(10,17)), j_time = timeToNum(sorted[j].dueData.substring(10,17))
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


    function timeToNum(tString){
        if (tString.length == 0){
            return 0;
        }
        let hourNum = (Number(tString.substring(0,2)) == 12? 0 : Number(tString.substring(0,2)));
        hourNum = (tString.substring(5,7) == "PM"? hourNum + 12 : hourNum)
        let minNum = Number(tString.substring(3,5))
        let timeNum = hourNum + minNum
        return timeNum
    }

    const thisWkDailyAssign = generateThisWkDailyAssign();

    return(
        <div className={"ms-lg-0 me-lg-5 mx-md-5 mx-3 pb-2 mt-4 mt-lg-0 mb-lg-0 task_card"}>
            <div className={"task_card_contents"}>
                <TaskListEntry month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"monday"}
                    assignments={thisWkDailyAssign[0]}/>
                <TaskListEntry month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"tuesday"}
                    assignments={thisWkDailyAssign[1]}/>
                <TaskListEntry month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"wednesday"}
                    assignments={thisWkDailyAssign[2]}/>
                <TaskListEntry month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"thursday"}
                   assignments={thisWkDailyAssign[3]}/>
                <TaskListEntry month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"friday"}
                   assignments={thisWkDailyAssign[4]}/>
                <TaskListEntry month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"saturday"}
                   assignments={thisWkDailyAssign[5]}/>
                <TaskListEntry month_num={props.month_num} year={props.year} current_wk_start={props.current_wk_start} dayOfWeek={"sunday"}
                   assignments={thisWkDailyAssign[6]}/>
            </div>
        </div>
    );
}

export default TaskList;