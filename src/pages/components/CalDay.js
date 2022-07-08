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

function num_to_month(n){
    switch (n) {
        case 1:
            return "January";
            break;
        case 2:
            return "February";
            break;
        case 3:
            return "March";
            break;
        case 4:
            return "April";
            break;
        case 5:
            return "May";
            break;
        case 6:
            return "June";
            break;
        case 7:
            return "July";
            break;
        case 8:
            return "August";
            break;
        case 9:
            return "September";
            break;
        case 10:
            return "October";
            break;
        case 11:
            return "November";
            break;
        case 12:
            return "December";
            break;
        default:
            return "month";
    }
}

function CalDay(props){
    async function getAssignments(){
        const colRef = collection(db, "GSCalTestCol", "testCalData", "testWeeks");
        const q = query(colRef, where("DMY","==", props.startArr));
        const querySnap = await getDocs(q);
        const isEmptyQ = querySnap.empty;
        if (!isEmptyQ){
            let week =  querySnap.docs.map(doc => doc.id)[0].toString();
            await getAssignmentsForDay(week);
        }
        else{
            await getAssignmentsForDay("week_3","");
        }
    }
    async function getAssignmentsForDay(week){
        const assignRef =
            collection(db, "GSCalTestCol", "testCalData", "testWeeks",week,"days",props.day_of_week,"assignments");
        const assignQuery = query(assignRef, orderBy("due"));
        const querySnap = await getDocs(assignQuery);
        let assignArr = querySnap.docs.map(doc => doc.data().name);
        let courseArr =  querySnap.docs.map(doc => doc.data().course);
        let dueArr = querySnap.docs.map(doc => doc.data().due);
        setAssignments(assignArr);
        setCourses(courseArr);
        setDues(dueArr);
    }

    function filterCount(courseName){
        if (courseName != ""){
            let filteredCourses = courses.filter(c => (c == courseName));
            return filteredCourses.length;
        }
        else{
            return assignments.length;
        }
    }

    function filterCountAlt(courseName){
        if (courseName != ""){
            let filteredCourses = assigns.filter(a => (a.course == courseName));
            return filteredCourses.length;
        }
        else{
            return assigns.length;
        }
    }

    function eventOn(id,ind){;
        if (!props.eventOn){
            let due = dues[ind];
            let time = new Date(due.seconds*1000);
            let month = num_to_month(time.getMonth()+1);
            let isAm = (time.getHours() < 12)
            let hour = (time.getHours() <= 12? time.getHours() : time.getHours() - 12);
            let min = (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
            let ampm = (isAm ? "AM": "PM");
            const element2 = document.getElementById("d"+id);
            const title_elem = document.getElementById("aec_title_default"),
                course_elem = document.getElementById("aec_course"),
                due_elem = document.getElementById("aec_due");
            element2.classList.remove("event_card_false");
            element2.classList.add("event_card_true");
            title_elem.innerHTML = assignments[ind];
            course_elem.innerHTML = "Course: " + courses[ind];
            due_elem.innerHTML = "Due: " + month + " " + props.day_of_month + ", " + hour +  ":" + min + " " + ampm;
            props.enableEventOn(id);

        }
    }

    function eventOnAlt(id, ind){
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

    function sortDayAssign(){
        let sorted = (props.assignList? props.assignList : [])
        if(sorted.length > 1){
            for(let i = 0; i < sorted.length; i++){
                let minInd = i;
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

    function getCourseNum(cName){
        for (let i=0; i < props.courseNameMap.length; i++){
            if (cName == props.courseNameMap[i][1]){
                return i;
            }
        }
        return 1;
    }


    const current = new Date();
    const date = current.getDate();
    const thisMonth = current.getMonth()+1;
    const dayNum = props.dayNum;
    const courseFilter = props.filter;
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [dues, setDues] = useState([]);
    const assigns = sortDayAssign();
    const displayAssignments = assignments.map((a,i) =>
    {
        let course = courses[i];
        let due = dues[i];
        let time = new Date(due.seconds*1000);
        let month = num_to_month(time.getMonth()+1);
        let isAm = (time.getHours() < 12)
        let hour = (time.getHours() <= 12 ? time.getHours() : time.getHours() - 12);
        let min = (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
        let ampm = (isAm ? "AM": "PM");
        let select = props.selected,
            selDay = (select.length == 0 ? -1 : Number(select.split("a")[0])),
            selAssign = (select.length == 0 ? -1 : Number(select.split("a")[1]));
        let listId = dayNum.toString()+"a"+i.toString();
        let currentInd = i;

        if (courseFilter == ""){
            if(dayNum === selDay && i === selAssign){
                return (<li id={listId} key={i} className={course + " eventOn_false"}
                            onClick={(e)=> eventOn(e.target.id,i)} >
                    <div id={"d"+listId} className={props.day_of_week + " event_card_false text-start text-wrap"}>
                        <h5>{a}</h5>
                        <p className={"my-0 text-start fs-6"}>Course: {course}</p>
                        <p className={"mb-1 text-start fs-6"}>Due: {month + " " + props.day_of_month + ", " + hour +  ":" + min + " " + ampm}</p>
                    </div>
                    <p className={"to_do_text"} onClick={(e)=> eventOn(listId,currentInd)}>{a}</p>
                </li>);
            }
            else{
                return (<li id={listId} key={i} className={course + " eventOn_"+props.eventOn.toString()}
                            onClick={(e)=> eventOn(e.target.id,i)} >
                    <div id={"d"+listId} className={props.day_of_week + " event_card_false text-start text-wrap"}>
                        <h5>{a}</h5>
                        <p className={"my-0 text-start fs-6"}>Course: {course}</p>
                        <p className={"mb-1 text-start fs-6"}>Due: {month + " " + props.day_of_month + ", " + hour +  ":" + min + " " + ampm}</p>
                    </div>
                    <p className={"to_do_text"} onClick={(e)=> eventOn(listId,currentInd)}>{a}</p>
                </li>);
            }
        }
        else{
            if (course == courseFilter){
                if(dayNum === selDay && i === selAssign){
                    return (<li id={listId} key={i} className={course + " eventOn_false"}
                                onClick={(e)=> eventOn(e.target.id,i)} >
                        <div id={"d"+listId} className={props.day_of_week + " event_card_false text-start text-wrap"}>
                            <h5 >{a}</h5>
                            <p className={"my-0 text-start fs-6"}>Course: {course}</p>
                            <p className={"mb-1 text-start fs-6"}>Due: {month + " " + props.day_of_month + ", " + hour +  ":" + min + " " + ampm}</p>
                        </div>
                        <p className={"to_do_text"} onClick={(e)=> eventOn(listId,currentInd)}>{a}</p>
                    </li>);
                }
                else{
                    return (<li id={listId} key={i} className={course + " eventOn_" + props.eventOn.toString()}
                                onClick={(e)=> eventOn(e.target.id,dayNum)} >
                        <div id={"d"+listId} className={props.day_of_week + " event_card_false text-start text-wrap"}>
                            <h5>{a}</h5>
                            <p className={"my-0 text-start fs-6"}>Course: {course}</p>
                            <p className={"mb-1 text-start fs-6"}>Due: {month + " " + props.day_of_month + ", " + hour +  ":" + min + " " + ampm}</p>
                        </div>
                        <p className={"to_do_text"} onClick={(e)=> eventOn(listId,currentInd)}>{a}</p>
                    </li>);
                }
            }
        }
    });

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

        if (a.name.length != 0){
            if (courseFilter == "" || a.course == courseFilter){
                return (<li id={listId} key={i} className={"course_" + courseNum + " eventOn_"+eventOnStr}
                            onClick={(e)=> eventOnAlt(e.target.id,i)} >
                    <div id={"d"+listId} className={props.day_of_week + " event_card_false text-start text-wrap"}>
                        <h5>{a.name}</h5>
                        <p className={"my-0 text-start fs-6"}>Course: {a.course}</p>
                        <p className={"mb-1 text-start fs-6"}>Due: {month + " " + props.day_of_month + ", " + timeString}</p>
                    </div>
                    <p id={"p"+listId} className={"to_do_text"} onClick={(e)=> eventOnAlt(e.target.id,i)}>{a.name}</p>
                </li>);
            }
        }
    });


    useEffect(() =>
        {
            getAssignments();

        }, []
    );



    return(
        <Col style={{width:"14.28%"}} className={"px-0 " + props.day_type}>
            <div className={"px-1 isToday_" + (date == props.day_of_month && thisMonth === props.month).toString()}>
                <p className={"my-0 mx-0 text-end cal_date"}>
                    {props.day_of_month}</p>
            </div>
            <div className={"cal_content "+ ((filterCountAlt(courseFilter) > 3) && "many")}>
                <ul className={"assign_events_list"}>
                    {displayAssignmentsAlt}
                </ul>
            </div>
        </Col>
    );
}

export default CalDay;