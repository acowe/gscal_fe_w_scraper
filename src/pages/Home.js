// Default calendar page
import axios from 'axios'
import cheerio from 'cheerio'
import {Container, Row, Col, Button, Card, Dropdown} from "react-bootstrap";
import {useEffect, useState} from "react";
import '../style/Home.css'
import NavHead from "./components/NavHead";
import Calendar from "./components/Calendar";
import TaskList from "./components/TaskList";
import SideBar from "./components/SideBar";


// Variables to store information about the current day, week, month, and year
// Note: To manually change the current day for testing or debugging, you can enter your own year, numerical month, and day as
// new Date( year_num, month_num-1, date)
let current = new Date(2022, 3, 3),
    date = current.getDate(), day = current.getDay(),
    month_num = current.getMonth()+1, year = current.getFullYear(),
    current_wk_start = date-day, numDayInMonth = new Date(year, month_num, 0).getDate(),
    numDayInPrevMonth = new Date(year, month_num-1, 0).getDate(),
    numDayInNextMonth = new Date(year, month_num+1, 0).getDate();


function getNextMonth(){

    const isNextYear = month_num + 1 > 12,
        moNum = (isNextYear? 0 : month_num), yearNum = (isNextYear? year + 1 : year);
    current = new Date(year, moNum, date)

}

function getPrevMonth(){

    const isLastYear = month_num - 1 < 1,
        moNum = (isLastYear? 11 : month_num - 2), yearNum = (isLastYear? year - 1 : year);
    current = new Date(year, moNum, date)

}
// Converts month number to month name
function num_to_month(n, capAb){
    switch (n) {
        case 1:
            const jan = (capAb? "Jan" : "january")
            return jan;
            break;
        case 2:
            const feb = (capAb? "Feb" : "february")
            return feb;
            break;
        case 3:
            const mar = (capAb? "Mar" : "march")
            return mar;
            break;
        case 4:
            const apr = (capAb? "Apr" : "april")
            return apr
            break;
        case 5:
            const may = (capAb? "May" : "may");
            return may;
            break;
        case 6:
            const jun = (capAb? "Jun" : "june");
            return jun;
            break;
        case 7:
            const jul = (capAb? "Jul" : "july");
            return jul;
            break;
        case 8:
            const aug = (capAb? "Aug" : "august");
            return aug;
            break;
        case 9:
            const sept = (capAb? "Sep" : "september");
            return sept;
            break;
        case 10:
            const oct = (capAb? "Oct" : "october");
            return oct;
            break;
        case 11:
            const nov = (capAb? "Nov" : "november");
            return nov;
            break;
        case 12:
            const dec = (capAb? "Dec" : "december");
            return dec;
            break;
        default:
            return "month";
    }
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

// Generates calendar page display
function Home(){

// _____________________________login stuff & scraping async functions______________________________//

    // State variables to display login page stuff and hold login information
    const [show, setShow] = useState(false)
    const [loggedIn, setStatus] = useState(false)
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('')
    const [passcode, setPasscode] = useState('')
    const [error, setError] = useState('')

    // State variables to hold scraped course and assignment info
    const [assignments, setAssignments] = useState([])
    const [classes, setClasses] = useState([])

    // Change email being held (based on input changes)
    const changeEmail = (event) =>{
        setEmail(event.target.value)
    }

    // Change password being held (based on input changes)
    const changePass = (event) =>{
        setPass(event.target.value)
    }

    const changePasscode = (event) =>{
        setPasscode(event.target.value)
    }

    const change = (event) => {
        setShow(true)
    }

//____________________API functions here_______________________


    async function schoolLogin(event){
        const pog = await axios('/school_login')
    }

    // Given a username and password, logs you into calendar page
    // and provides status of login (loading, fail, and success)
    // (Note: to see login process in more detail, see login and altLogin functions in server.js)
    async function login(user_in,pass,passcode){
        const user = user_in
        const password = pass
        const pcode = passcode
        const element = document.getElementById("login_status_text");
        element.innerHTML = "Logging in... (be on the lookout for a duo notification!)"
        try{
            const message = await axios('http://localhost:3001/login?email=' + user + '&pass=' + password + '&passcode=' + pcode);
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

    async function altLogin(user_in, pass){
        // initialToast('Loading')
        // event.preventDefault()
        const user = user_in
        const password = pass
        const element = document.getElementById("login_status_text");
        element.innerHTML = "Logging in... (be on the lookout for a duo notification!)"
        try{
            //this line needs to be changed
            const message = await axios('https://gscalapi.herokuapp.com' +'/altlogin?email=' + user + '&pass=' + password);
            if (message.data == "Successfully logged in"){
                // toast.update(toastId.current, {
                //     render: message.data,
                //     type: toast.TYPE.SUCCESS
                // })
                setShow(true)
                setStatus(true)
            }
            else{
                console.log("Login failed, please try again")
                // toast.update(toastId.current, {
                //     render: message.data,
                //     type: toast.TYPE.WARNING
                // })
                element.innerHTML = message.data + ", please try again"
            }
        }
        catch (e){
            console.log("Login failed due to error")
            element.innerHTML = "Login error"
        }
    }

    // Gets user's scraped class information from Gradescope
    async function pullClasses(){
        const classData = await axios('http://localhost:3001/get_classes')
        const parsed = await parseClasses(classData['data'])
        setClasses(parsed)
        return parsed;
    }

    // Helper to pullClasses function; The primary scraper function that scrapes class info
    // (i.e. scrapes course names for user's current term courses)
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
            let sNam = $(elem).find('.courseBox--shortname').text();
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

    // Assuming class info is already scraped, gets user's scraped assignment information from Gradescope
    // (i.e. gets assignment course, name, submission status, and due date)
    // Should no class info be available prior, no assignment info will be displayed
    async function getAssignments(classArr) {
        let allAssignments = []
        for(let i = 0; i< classArr.length; i++){
            if(classArr[i].number === 'Loading'){

            } else {
                const data = await axios('http://localhost:3001/get_assignments?id=' + classArr[i].number)
                let parsedData = await parseAssignments(classArr[i].name ,data['data'])
                allAssignments.push(parsedData)
            }
        }
        setAssignments(allAssignments)
        return allAssignments

    }

    async function parseAssignments(className, data){
        let tempList = [{}]
        // const data = await axios('/get_assignments?id=' + classes[i].number)
        const $ = await cheerio.load(data)
        let assignments = []

        $('tr[role=row]').each((i,elem) => {
            let submissionStat = $(elem).find('.submissionStatus--text').text(),
                nameText = (submissionStat != "No Submission"? $(elem).find('a').text() :
                    $(elem).find('.table--primaryLink').text());
            assignments.push({
                course: className,
                name: nameText,
                submissionStatus: submissionStat,
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
        return assignments;
    }

    // Get classes and assignments
    async function getInfo(){
        await pullClasses();
        await getAssignments();
    }

// _____________________________graphics______________________________//

    // State variables to control display of elements on calendar
    const [sidebarOn, setSidebarOn] = useState(false);
    const [eventOn, setEventOn] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [eventOnFor, setEventOnFor] = useState(-1);
    const [dark, setDark] = useState(false);
    const [duoAuth, changeMethod1] = useState();
    const [regular,changeMethod2] = useState();
    const [duoCode, changeMethod3] = useState();

    // Enable sidebar display
    function enableSidebar(){
        disableEventOn();
        setSidebarOn(true);
    }

    // Disables sidebar display
    function disableSidebar(){
        setSidebarOn(false);
    }

    // Toggles between light and dark mode displays (for larger display windows)
    function changeVisualMode(checked){
        console.log(checked);
        if (checked){
            setDark(dark => true);
        }
        else{
            setDark(dark => false);
        }
    }

    // Toggles between light and dark mode displays (for smaller/mobile display windows)
    function changeVisualModeSmall(isDark){
        setDark(!isDark);
    }

    // Enables event card view mode (ie it makes the event card of a selected event visible)
    function enableEventOn(id){
        setSelectedEvent(id);
        setEventOn(true);

    }

    // Disables event card view mode (ie it makes the event card of a selected event invisible)
    function disableEventOn(){
        if(eventOn){
            let idStr = "d"+selectedEvent
            let element = document.getElementById(idStr);
            const title_elem = document.getElementById("aec_title_default"),
                course_elem = document.getElementById("aec_course"),
                due_elem = document.getElementById("aec_due");
            element.classList.remove("event_card_true");
            element.classList.add("event_card_false")
            title_elem.innerText="Select an event to view its details";
            course_elem.innerText = "";
            due_elem.innerText = "";
            setEventOn(false);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function loginMethod(user_in, pass){
        if (duoAuth === true){
            altLogin(user_in, pass)
        } if (regular === true) {
            login(user_in, pass)
        } 
    }

    useEffect(() => {
        // declare the data fetching function
        if (loggedIn){
            const classes = async () => {
                await sleep(2000)
                const classes = await pullClasses();
                const assigns = await getAssignments(classes)
            }
            // call the function
            const classArr = classes()
                // make sure to catch any error
                .catch(console.error);
        }
    }, [loggedIn])

    // Display for users that are logged in
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
                            <Calendar assignments={assignments} classes={classes} current_wk_start={current_wk_start} current = {current}
                                      enableEventOn={enableEventOn} eventOn={eventOn} month_num={month_num} num_to_month={num_to_month}
                                      selected={selectedEvent} timeToNum={timeToNum} year={year} />
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
                            <TaskList assignments={assignments} current_wk_start={current_wk_start}
                                      month_num={month_num} num_to_month={num_to_month} numDayInMonth={numDayInMonth}
                                      numDayInNextMonth={numDayInNextMonth} numDayInPrevMonth={numDayInPrevMonth} year={year} timeToNum={timeToNum}/>
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
    // Display for users that are NOT logged in (default display)
    else{
        return (
            <div>
                <form className={"m-5"}>
                    <h1 className = 'mb-3 top'> Log-in </h1>
                    <div className = 'mb-3 form-group'>
                        <h3> Username </h3>
                        <input type = 'text' className = 'form-control' value = {email} placeholder='JohnDoe@gmail.com' onChange={changeEmail}></input>
                    </div>
                    <div className = 'mb-5 form-group'>
                        <h3> Password </h3>
                        <input type = 'password' className = 'form-control' id = 'password' value ={pass} placeholder='pogchamp' onChange={changePass}></input>
                    </div>

                    <div className = 'form-check'>
                        <input class = 'form-check-input' type='radio' name='DuoAuth' id='inlineCheckbox1' onChange = {(e) => {changeMethod2(true);changeMethod1(false);changeMethod3(false)}}></input>
                        <label class="form-check-label" for="flexRadioCheckedDisabled">Regular Login</label>

                    </div>

                    <div class = 'form-check'>
                        <input class = 'form-check-input' type='radio' name='DuoAuth' id='inlineCheckbox1' onChange={(e) => {changeMethod1(false);changeMethod2(true);changeMethod3(false)}}></input>
                        <label class="form-check-label" for="flexRadioCheckedDisabled">Duo Authentication</label>
                    </div>

                    <div class = 'form-check'>
                        <input class = 'form-check-input' type='radio' name='DuoAuth' id='inlineCheckbox1' onChange={(e) => {changeMethod1(false);changeMethod2(false);changeMethod3(true)}}></input>
                        <label class="form-check-label" for="flexRadioCheckedDisabled">Duo Passcode</label>
                    </div>


                    {duoCode === true &&(
                        <div className = 'mb-5 form-group'>
                            <h4> Duo Passcode </h4>
                            <input type = 'text' className = 'form-control' id = 'passcode' value ={passcode} placeholder='six or seven-digit code' onChange={changePasscode}></input>
                        </div>
                    )}

                    <button type="submit" className="mb-5 btn btn-primary w-25" onClick={(e)=>login(email,pass,passcode)} >Submit</button>
                    <p id={"login_status_text"} className={"fs-5"}></p>
                </form>
            </div>
        );
    }


};

export default Home;