import {Col, Row} from "react-bootstrap";
import {initializeApp} from "firebase/app";
import {collection, doc, getDoc, getDocs, getFirestore, orderBy, query, where} from "firebase/firestore";
import {useEffect, useState} from "react";

const firebaseConfig = {
    apiKey: "AIzaSyA6Bx3J-IB1EnvqSE5Pja7r2R5ykJOjsFA",
    authDomain: "gscaltest.firebaseapp.com",
    projectId: "gscaltest",
    storageBucket: "gscaltest.appspot.com",
    messagingSenderId: "977140376530",
    appId: "1:977140376530:web:44496ec55fc6235d8f5e0b",
    measurementId: "G-5E3SBZM1QD"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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


function generateWeekOfArr(currentWk, month, year,){
    let week = currentWk, mo = month, yr = year;
    if(currentWk <= 0){
        if(month == 1){
            mo = 12;
            yr = year - 1;
        }
        else {
            mo = month - 1;
        }
        week = currentWk + new Date(yr, mo, 0).getDate();
    }
    return [week, mo, yr];
}

function TaskListEntry(props){
    const current = new Date(), today = (current.getDay() == 0? 7: current.getDay());
    const weekOfArr = generateWeekOfArr(props.current_wk_start, props.month_num, props.year);
    const entryDayNum = day_to_num(props.dayOfWeek);
    const dayPassed = (entryDayNum < today? true: false);
    const isToday = (entryDayNum == today? true : false);

    async function getDues(){
        const colRef = collection(db, "GSCalTestCol", "testCalData", "testWeeks");
        const q = query(colRef, where("DMY","==", weekOfArr));
        const querySnap = await getDocs(q);
        const isEmptyQ = querySnap.empty;
        if (!isEmptyQ){
            let week =  querySnap.docs.map(doc => doc.id)[0].toString();
            await getDuesForDay(week);
        }
        else{
            await getDuesForDay("week_2");
        }
    }

    async function getDuesForDay(week){
        const assignRef =
            collection(db, "GSCalTestCol", "testCalData", "testWeeks",week,"days",props.dayOfWeek,"assignments");
        const assignQuery = query(assignRef, orderBy("due"));
        const querySnap = await getDocs(assignQuery);
        let courseArr =  querySnap.docs.map(doc => doc.data().course);
        let dueArr = querySnap.docs.map(doc => doc.data().due);
        setCourses(courseArr);
        setDueTimes(dueArr);
    }
    const [courses, setCourses] = useState([]);
    const [dueTimes, setDueTimes] = useState([]);
    const [error, setError] = useState(false)
    const listType = (props.assignments.length <= 0? "none_type" : "task_day_list");

    function isPast(time){
        if (isToday){
            if (time.getHours() < current.getHours()){
                if (time.getMinutes() < current.getMinutes()){
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

    const displayDue =
        dueTimes.map((t,i) =>
        {
            let time = new Date(t.seconds*1000);
            let isAm = (time.getHours() < 12 ? true : false)
            let hour = (time.getHours() <= 12  ? time.getHours() : time.getHours() - 12);
            let min = (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
            let ampm = (isAm ? "AM": "PM");
            let passed = isPast(time);
            return (<li className={"passed_" + passed.toString()}>
                <div className={"list_content"}>
                    <div className={"course_text"}>{courses[i]}</div>
                    <div className={"list_time"}>
                        <p className={"mb-0 list_time_text"}>{hour +  ":" + min + " " + ampm}</p>
                    </div>
                </div>
            </li>);
        }
    );

    const displayDueAlt =
        props.assignments.map((a,i) =>
            {
                let timeString = a.dueData.substring(10,17);
                return (<li className={"passed_false"}>
                    <div className={"list_content"}>
                        <div className={"course_text"}>{a.course}</div>
                        <div className={"list_time"}>
                            <p className={"mb-0 list_time_text"}>{timeString}</p>
                        </div>
                    </div>
                </li>);
            }
        );

    useEffect(() =>
        {
            getDues().catch(e => console.log(e));
        }, []
    );

    return(
        <div className={"mx-2 mx-sm-3 mt-1 mb-2 task_day_entry"}>
            <h2 className={"fs-3 td_day"}>{props.dayOfWeek}</h2>
            <ul className={"mb-5 " + listType}>
                {displayDueAlt}
                {(props.assignments.length <= 0) && <li>none!</li>}
            </ul>
            <div className={"tde_bottom"}> </div>
        </div>
    );
}

export default TaskListEntry;