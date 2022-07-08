import {Container, Row, Col, Button, Card, Dropdown} from "react-bootstrap";
import '../style/OtherPage.css'
import {useState, useEffect} from "react";
import '../style/Home.css'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


async function getStuff2(){
    const colRef = collection(db, "GSCalTestCol", "testCalData", "testWeeks","week_1","days","monday","assignments");
    const colSnap = await getDocs(colRef);

    colSnap.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });

}


function OtherPage(){

    const [displayThing, setDisplayThing] = useState("");
    const [courseLineUp, setCourseLineUp] = useState([]);
    const [timeArr, setTimeArr] = useState([]);

    async function getStuff(){
        const docRef = doc(db, "GSCalTestCol", "testCalData", "testWeeks","week_1","days","monday","assignments","a0");
        const docSnap = await getDoc(docRef).catch(e =>
        {
            console.log("fuck", e)
            setDisplayThing("Lol i can't display shit rn sorry")
        });
        const docData = docSnap.data();

        if (docSnap.exists()) {
            console.log("Document data:", docData.course);
            setDisplayThing(JSON.stringify(docData));

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }


    async function getStuff3() {
        const colRef = collection(db, "GSCalTestCol", "testCalData", "testWeeks","week_1","days","monday","assignments");
        const colSnap = await getDocs(colRef);
        const retArr = colSnap.docs.map(doc => doc.data().name);
    }

    async function getStuff4() {
        const colRef = collection(db, "GSCalTestCol", "testCalData", "testWeeks","week_1","days","monday","assignments");

        const q = query(colRef, orderBy("due"))
        const querySnap = await getDocs(q);
        const courseArr = querySnap.docs.map(doc => doc.data().name);
        const timeArr = querySnap.docs.map(doc => getStuff4helper(doc.data().course, doc.data().due));
        setCourseLineUp(courseArr);
        setTimeArr(timeArr);
    }

    function getStuff4helper(course, timestamp){
        console.log(course);
        console.log(timestamp);
        let time = new Date(timestamp.seconds*1000);
        console.log(time);
        return course + ", due at " + time.getHours().toString() + ":" + time.getMinutes().toString();
    }

    const displayNames = courseLineUp.map((n,index) => { return (<li key={index}>{n}</li>);});
    const displayTimes = timeArr.map((t,index) => { return (<li key={index}>{t}</li>); });
    console.log(timeArr);

    return(

        <div>
            <div className={"mb-5"}>
                <h1 className={"mt-5 mb-4"}>Hello! This is blank page representing the weekly over page to be integrated.</h1>
                <h3 className={"mb-4"}>(It's coming out soon, I promise!)</h3>
           </div>



        </div>
    )

}

export default OtherPage;