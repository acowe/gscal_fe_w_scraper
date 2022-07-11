import axios from 'axios'
import cheerio from 'cheerio'
import {Container, Row, Col, Button, Card, Dropdown} from "react-bootstrap";
import {useState} from "react";
import '../style/Home.css'
import NavHead from "./components/NavHead";
import Calendar from "./components/Calendar";
import TaskList from "./components/TaskList";
import SideBar from "./components/SideBar";


const current = new Date(2022, 2, 1);
const date = current.getDate();
const day = current.getDay();
const month_num = current.getMonth()+1;
const month = num_to_month(month_num);
const year = current.getFullYear();
const current_wk_start = date-day;

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





function Home(){


    // _____________________________login stuff______________________________//

    const [show, setShow] = useState(false)
    const [loggedIn, setStatus] = useState(false)
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')


    const [assignemnts, setAssignments] = useState([])
    const [classes, setClasses] = useState([])


    var showPassword = false

    //UseState functions here
    const changeEmail = (event) =>{
        setEmail(event.target.value)
    }

    const changePass = (event) =>{
        setPass(event.target.value)
    }

    const change = (event) => {
        setShow(true)
    }

    //API functions here
    async function schoolLogin(event){
        const pog = await axios('/school_login')
    }

    async function login(user_in,pass){
        const user = user_in
        const password = pass
        const element = document.getElementById("login_status_text");
        element.innerHTML = "Logging in... (be on the lookout for a duo notification!)"
        try{
            const message = await axios('http://localhost:3001/login?email=' + user + '&pass=' + password);
            if (message.data == "Successfully logged in"){
                setShow(true)
                setStatus(true)
            }
            else{
                console.log("Login failed, please try again")
                element.innerHTML = message.data + ", please try again"
            }
        }
        catch (e){
            console.log("Login failed due to error")
            element.innerHTML = "Login error"
        }
        //This one logs into gradescope with the following information



    }

    async function pullClasses(){
        const classData = await axios('http://localhost:3001/get_classes')
        const parsed = await parseClasses(classData['data'])
        setClasses(parsed)
        console.log(parsed)
    }

    async function parseClasses(data) {
        //Makes the Call to the server which then returns all the html data of all the classes found on the home page
        //Then we upload it to the cheerio module in order to parse it
        var $ = await cheerio.load(data)
        let classes = []

        const headText = $('.pageHeading').eq(0).text();

        if (headText == "Instructor Courses"){
            let frog = $('.courseList')[1]
            $ = await cheerio.load(frog)
        }
        const pog = $('.courseList--coursesForTerm')[0]

        //We then create a new variable with the first courseList courses for term
        //This is my solution to preventing the code from grabbing all of the classes we have for the entire year
        //and making it give us our classes for this sesmeseter
        $ = await cheerio.load(pog)
        //Then we take all the items with the class courseBox, and since we are only looking in one div it will pull the ones for this
        //sesmester
        $('.courseBox').each((i,elem) => {
            let num =$(elem).attr('href'), sNam = $(elem).find('.courseBox--shortname').text(),
                nam =$(elem).find('.courseBox--name').html();
            if(sNam)
            classes.push({
                number: $(elem).attr('href'),
                shortName:  $(elem).find('.courseBox--shortname').text(),
                name: $(elem).find('.courseBox--name').html()
            });
        })
        //This removes the last entry because the last entry is always the add courses box in gradescope
        return(classes)
    }

    async function getAssignments() {
        let allAssignments = []
        for(let i = 0; i< classes.length; i++){
            if(classes[i].number === 'Loading'){

            } else {
                const data = await axios('http://localhost:3001/get_assignments?id=' + classes[i].number)
                let parsedData = await parseAssignments(classes[i].name ,data['data'])
                allAssignments.push(parsedData)
            }
        }
        setAssignments(allAssignments)

    }

    async function parseAssignments(className, data){
        let tempList = [{}]
        // const data = await axios('/get_assignments?id=' + classes[i].number)
        const $ = await cheerio.load(data)
        let assignments = []

        $('tr[role=row]').each((i,elem) => {
            assignments.push({
                course: className,
                name: $(elem).find('a').text(),
                submissionStatus: $(elem).find('.submissionStatus--text').text(),
                dueData: $(elem).find('.submissionTimeChart--dueDate').text()
            })
        })

        assignments.shift()
        let pog = {
            name: className,
            assignments: assignments
        }

        //For right now all this does is just prints this in the console because i dont want to overflow the page with all my assignments
        // console.log(pog)
        return(assignments)
    }

    // _____________________________graphics______________________________//

    const [sidebarOn, setSidebarOn] = useState(false);
    const [eventOn, setEventOn] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [eventOnFor, setEventOnFor] = useState(-1);
    const [dark, setDark] = useState(false);

    function enableSidebar(){
        disableEventOn();
        setSidebarOn(true);
    }

    function disableSidebar(){
        setSidebarOn(false);
    }

    function changeVisualMode(checked){
        console.log(checked);
        if (checked){
            setDark(dark => true);
        }
        else{
            setDark(dark => false);
        }
    }

    function changeVisualModeSmall(isDark){
        setDark(!isDark);
    }

    function enableEventOn(id){
        setSelectedEvent(id);
        setEventOn(true);

    }

    function disableEventOn(){
        if(eventOn){
            let element1 = document.getElementById(selectedEvent);
            let element2 = document.getElementById("d"+selectedEvent);
            const title_elem = document.getElementById("aec_title_default"),
                course_elem = document.getElementById("aec_course"),
                due_elem = document.getElementById("aec_due");
            element2.classList.remove("event_card_true");
            element2.classList.add("event_card_false");
            title_elem.innerText="Select an event to view its details";
            course_elem.innerText = "";
            due_elem.innerText = "";
            setEventOn(false);
        }
    }

    async function getInfo(){
        await pullClasses();
        await getAssignments();
    }



    if (loggedIn) {
        return (
            <div className={"gsc_div"}>
                <Container fluid className={"gscal sidebar_" + sidebarOn.toString() +" darkMode_" + dark.toString()}>
                    <NavHead enableSidebar={enableSidebar} dark={dark} isDark={changeVisualModeSmall} getInfo={getInfo}/>
                    <Row id={"eventOn_" + eventOn.toString()} className={"contents"} onClick={(e)=>disableEventOn()}>
                        <SideBar dark={dark} sidebarOn={sidebarOn} changeVisualMode={changeVisualMode}/>
                        <div className={"sidebar_" +  sidebarOn.toString() + " sidebar_other"} onClick={(e)=>disableSidebar()}>
                        </div>
                        <Col lg={8} className={"px-0 cal_col"}>
                            <Calendar month_num={month_num} year={year} current_wk_start={current_wk_start} num_to_month={num_to_month}
                                      eventOn={eventOn} enableEventOn={enableEventOn} eventOnFor={eventOnFor} selected={selectedEvent}
                                    classes={classes} assignments={assignemnts}/>
                            <div id={"alt_event_card"} className={"pt-3 pb-2 ps-3 pe-1 event_card_alt_true"}>
                                <h3 id={"aec_title_default"} className={"text-start"}>Select an event to view its details</h3>
                                <p id={"aec_course"} className={"text-start fs-5 mb-0"}></p>
                                <p id={"aec_due"} className={"text-start fs-5"}></p>
                            </div>
                            <a id="cal_dnload" href="test_cal.ics" download="test_calendar">
                                <button style={{width:"40%"}} className={"shadow-none btn btn-primary"}>
                                    download calendar
                                </button>
                            </a>
                        </Col>
                        <Col lg={4} className={"px-0 pt-lg-4 pt-md-0 list_col"}>
                            <TaskList month_num={month_num} year={year} current_wk_start={current_wk_start} assignments={assignemnts}/>
                            <div className={"mt-lg-4 dl_button_group"}>
                                <a href={"/gscal_front_end/#/wk_overview"} className={"mb-3 shadow-none btn btn-primary"}>
                                    view weekly overview</a>
                            </div>
                        </Col>
                    </Row>
                    <Row className={"cover_up"}>
                    </Row>
                </Container>
            </div>
        );
    }
    else{
        return (
            <div>
                <form className={"m-5"}>
                    <h1 className = 'top'> Log-in </h1>
                    <div className = 'mb-3 form-group'>
                        <h3> Username </h3>
                        <input type = 'text' className = 'form-control w-25' value = {email} placeholder='JohnDoe@gmail.com' onChange={changeEmail}></input>
                    </div>

                    <div className = 'mb-5 form-group'>
                        <h3> Password </h3>
                        <input type = 'password' className = 'form-control w-25' id = 'password' value ={pass} placeholder='pogchamp' onChange={changePass}></input>
                    </div>

                    <button type="submit" className="mb-5 btn btn-primary w-25" onClick={(e)=>login(email,pass)} >Submit</button>

                    <p id={"login_status_text"} className={"fs-5"}></p>

                </form>
            </div>

        );
    }


};

export default Home;