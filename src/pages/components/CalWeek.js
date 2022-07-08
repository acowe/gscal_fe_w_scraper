import {Col, Row} from "react-bootstrap";
import CalDay from "./CalDay";
import { initializeApp } from "firebase/app";
import {getFirestore, collection, doc, addDoc, getDocs, query, orderBy, getDoc, where} from "firebase/firestore";
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


function generateWkDates(startDate, maxDay, prevMaxDay, currentMonth){
    let wkDates = [];
    let month = currentMonth;
    for (let i=0; i<7; i++){
        let dateEntry = startDate + i;
        if (dateEntry > maxDay){
            dateEntry = dateEntry-maxDay;
            month = currentMonth + 1;
        }
        if (dateEntry <= 0){
            dateEntry = dateEntry + prevMaxDay;
            month = currentMonth + 1;
        }
        wkDates.push([dateEntry,month]);
    }
    return wkDates;
}

function generateStart(startDate, maxDay, prevMaxDay, month, year){
    let currentDay = startDate, currentMonth = month, currentYear = year;
    if (startDate > maxDay){
        currentDay = startDate - maxDay;
        currentMonth = month + 1;
        if(currentMonth > 12){
            currentMonth = 1;
            currentYear = year + 1
        }
    }
    if(startDate <= 0){
        currentDay = startDate + prevMaxDay;
        currentMonth = month - 1;
        if (currentMonth < 1){
            currentMonth = 12;
            currentYear = year - 1;
        }
    }
    return [currentDay, currentMonth, currentYear];
}

function CalWeek(props){
    const thisWeekDates = generateWkDates(props.wk_of,props.dayInMonth, props.dayInPrevMonth,props.month);
    const startArr = generateStart(props.wk_of, props.dayInMonth, props.dayInPrevMonth, props.month, props.year);
    const thisWeekAssigns = (props.assignList ? generateDailyAssign() : [])

    function generateDailyAssign() {
        let fullDayAssArr = [];
        if(props.assignList.length > 0){
            for (let i = 0; i<7; i++){
                let dayAssArr = props.assignList.filter((a) => (a.dueData.substring(4,6) == thisWeekDates[i][0] && a.name != ""))
                fullDayAssArr.push(dayAssArr)
            }
        }
        else{
            fullDayAssArr = [[],[],[],[],[],[],[]]
        }
        return fullDayAssArr
    }

    return(
        <Row className={"mx-0 " + props.wk_type}>
            <CalDay startArr={startArr} day_type={"cal_sun"} dayNum={props.wkNum} day_of_month={thisWeekDates[0][0]} day_of_week={"sunday1"}
                    filter={props.filter} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                    month = {thisWeekDates[0][1]} assignList={thisWeekAssigns[0]} courseNameMap={props.courseNameMap}/>
            <CalDay startArr={startArr} day_type={"cal_wkday"} dayNum={props.wkNum+1} day_of_month={thisWeekDates[1][0]} day_of_week={"monday"}
                    filter={props.filter} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                    month = {thisWeekDates[1][1]} assignList={thisWeekAssigns[1]} courseNameMap={props.courseNameMap}/>
            <CalDay startArr={startArr} day_type={"cal_wkday"} dayNum={props.wkNum+2} day_of_month={thisWeekDates[2][0]} day_of_week={"tuesday"}
                    filter={props.filter} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                    month = {thisWeekDates[2][1]} assignList={thisWeekAssigns[2]} courseNameMap={props.courseNameMap}/>
            <CalDay startArr={startArr} day_type={"cal_wkday"} dayNum={props.wkNum+3} day_of_month={thisWeekDates[3][0]} day_of_week={"wednesday"}
                    filter={props.filter} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                    month = {thisWeekDates[3][1]} assignList={thisWeekAssigns[3]} courseNameMap={props.courseNameMap}/>
            <CalDay startArr={startArr} day_type={"cal_wkday"} dayNum={props.wkNum+4} day_of_month={thisWeekDates[4][0]} day_of_week={"thursday"}
                    filter={props.filter} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                    month = {thisWeekDates[4][1]} assignList={thisWeekAssigns[4]} courseNameMap={props.courseNameMap}/>
            <CalDay startArr={startArr} day_type={"cal_wkday"} dayNum={props.wkNum+5} day_of_month={thisWeekDates[5][0]} day_of_week={"friday"}
                    filter={props.filter} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                    month = {thisWeekDates[5][1]} assignList={thisWeekAssigns[5]} courseNameMap={props.courseNameMap}/>
            <CalDay startArr={startArr} day_type={"cal_sat"} dayNum={props.wkNum+6} day_of_month={thisWeekDates[6][0]} day_of_week={"saturday"}
                    filter={props.filter} eventOn={props.eventOn} enableEventOn={props.enableEventOn} eventOnFor={props.eventOnFor} selected={props.selected}
                    month = {thisWeekDates[6][1]} assignList={thisWeekAssigns[6]} courseNameMap={props.courseNameMap}/>
        </Row>
    );
}

export default CalWeek;