import React, { useState } from 'react';
import AssgnList from './components/AssgnList';
import {Link} from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import cheerio from 'cheerio';
import cx from 'classnames';
import '../style/wkOverview.css'




function WeeklyOverview(){

// ---------  Controls the date and time for this component ------------ //

    const [currentTime, setCurrentTime] = useState(moment().format('h:mm A')); // current time
    const [weekControl, setWeekControl] = useState(0) // shifts displayed week by # of weeks
    const [seeClock, setSeeClock] = useState(false) // controls if the live clock is shown
    const todayDate = moment().format('dddd MMMM Do, YYYY') // today's date to show under the clock widget

    // ---- Controls which week is displayed in the overview ----
    const startWeekData = moment().startOf('week').add(weekControl, 'week'); // calculates the date a given week starts on
    
    // Provides the dates in a week based on the start week date above
    function dayInMonth(shift){
        return (moment(startWeekData).add(shift, 'day').format('M/D').toString())
    }

   // Toggles if the live clock is shown
    const handleClock = () => {
        setSeeClock(current => !current)
    }

    // Updates the current time state every second
    function getTime(){
        setCurrentTime(moment().format('h:mm A'))
    }

    setInterval(() => {
        getTime()
    },60000)
   

// --------------- GRADESCOPE SCRAPING FUNCTIONS ----------------- //


    const [show, setShow] = useState(false)
    const [loggedIn, setStatus] = useState(false)
    const [email, setEmail] = useState(''); // Holds a user's login email
    const [pass, setPass] = useState('') // Holds a user's login password
    const [error, setError] = useState('')


    // Holds the class and assignment data from Gradescope
    const [assignments, setAssignments] = useState([])
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
        //console.log(pog)
        return(assignments)
    }


    

// ----------- GRADESCOPE FUNCTIONS END ------------



// ------------------ COMPONENT FUNCTIONS ------------------- //

    // Runs through the assignment data and returns a single array with assignments due on a certain date
    // Used to distribute assignments in the weekly oveview table by date

    function sortMe(assignments, format, dateTime){
        let emptyArray = []
        for (let i = 0; i < assignments.length; i++) {
            for (let j = 0; j < assignments[i].length; j++){
                if (moment(((assignments[i])[j].dueData).substring(0,17), 'MMM Do [at] h:mmA').format(format) === dateTime) {
                    emptyArray.push((assignments[i])[j])
                }}}
        
        // Sorts the returned array in chrolonogical order
        emptyArray.sort((a,b) => 
            Number(new moment((a.dueData).substring(0,17), 'MMM Do [at] h:mmA').format('MMDDHHmm')) - 
            Number(new moment((b.dueData).substring(0,17), 'MMM Do [at] h:mmA').format('MMDDHHmm')))

        
        return (emptyArray)
        
    }


    // Calculates a given week date based on the week start date and returns that day's assignment table
    // (Controls each section of the weekly overview [Sunday #/##, Monday #/##, etc])

    function getDayData(weekDay, shift){

        return (
            <div className = "dayInWeek">   
                <div className = "line" />
                        <h3
                            className = {cx({
                                'highlightMeToday': (moment().format('M/D')).toString() == dayInMonth(shift),
                                'wOTitle': 1 == 1,
                            })}
                        >
                            {weekDay} {dayInMonth(shift)}
                        </h3>
            
                {assignments.length > 1 ? (
                    <div>
                        <AssgnList courseClicked = {courseClicked} assignments = {sortMe(assignments, 'M/D', dayInMonth(shift))} />
                    </div>
                        
                ) : (<h4 className = "no-assignments"> loading assignments... </h4>)}
            </div>
            )
        }

    // Regulates which course assignments are highlighted in the overview table
    // Index number is used to designate each course a specific color

    const [courseClicked, setCourseClicked] = useState(["HMC Wizardry 42", 42]) // ["course", index number from scraped data]

    function toggleCourseClick(className, indexNumber){
        if(className == courseClicked[0]){
            setCourseClicked(["HMC Wizardry 42", 42])
        } else {
            setCourseClicked([className, indexNumber])
        }
    }
 
    const [dueTime, setDueTime] = useState(false)
    const handleDueTime = () => {
        setDueTime(current => !current)
    }

// -------- CLASS LIST HELPER FUNCTIONS -------- //

    function courseClass(num){
        return ("class-" + num + " " + "class-table")
    }
    function courseClassClicked(num){
        return ("class-clicked-" + num + " " + "class-table")
    }

// ------------ NEXT ASSIGNMENT WIDGET FUNCTIONS ------------- //

    // Runs through the assignment data and returns a single array with assignments due after the current date and time
    // Used to distribute assignments in the next assignments widget
    
    function orderMe(assignments){
        let emptyArray = []

        //Unpacks the assignments in each course array
        for (let i = 0; i < assignments.length; i++) {
            for (let j = 0; j < assignments[i].length; j++){
                if (Number(moment(((assignments[i])[j].dueData).substring(0,17), 'MMM Do [at] h:mmA').format('MMDDHHmm')) > Number(moment().format('MMDDHHmm'))) {
                    emptyArray.push((assignments[i])[j])
                }}}
        
        // Sorts the returned array in chrolonogical order
        emptyArray.sort((a,b) => 
            Number(new moment((a.dueData).substring(0,17), 'MMM Do [at] h:mmA').format('MMDDHHmm')) - 
            Number(new moment((b.dueData).substring(0,17), 'MMM Do [at] h:mmA').format('MMDDHHmm')))

        return (emptyArray)
    }
    
  
    // Checks if the assignments have been scraped before rendering the next assignments widget
    function nxtAssgnmntsChecker(){
        if (assignments.length > 1){
            
            // Checks if there are no upcoming assignments before rendering the widget
            if((orderMe(assignments)).length < 1){
                return (<p className = "box"> no upcoming assignments!</p>)
            } else {
            return (nxtAssgnmnts())}
        } else {
            return (<p>loading upcoming assignments...</p>)
        }
    }

    // Creates a range of numbers based on a given value
    // The range has a max length of 5
    // Used to calibrate the next assignment slider

    function createRange(num){
        let emptyNumArray = []

        if(num > 6){
            num = 6
        }

        for (let i = 0; i < num; i++) {
            emptyNumArray.push(i)
        }

        
        return(emptyNumArray.slice(1,))
    }

    // Holds the values from the next assignments slider to display X amount of upcoming assignments
    const [numControl, setNumControl] = useState(1)


    // Creates the Next Assignment widget (acts as a component)

    function nxtAssgnmnts(){
        
        const nextUp = createRange((orderMe(assignments)).length) // generates a range of how many next assignments will be shown
        const nxtUpCntrl = nextUp.slice(0,numControl) // controls how many upcoming assignments are shown


        return (
            <div> 
                <div>
                    <div className = "nextAssignmentWrapper box">
                    <p className = "tDue class">{(orderMe(assignments))[0].course}</p>
                    <h3 className =  "tDue assignment"><strong>{(orderMe(assignments))[0].name}</strong></h3>
                    <p className = "due h6">due:</p>
                    <h2 className = "h4">
                            {(orderMe(assignments))[0].dueData.substring(0,17)}
                    </h2>
                </div>

                <div>
                    <input 
                        value = {numControl}
                        onChange = {(e) => setNumControl(e.target.value)}
                        tooltip = "auto"
                        type="range" 
                        className="form-range" 
                        min="0" 
                        max="4" 
                        id="customRange2"               
                    />

                    <p className = "small secondary"> slide to see more upcoming assignments</p>
                    <p className = "mt-3 h5">Upcoming assignments:</p>

                </div>
                
                <div className = "upcoming-assignments">
                    {nxtUpCntrl.map((i) => (
                        <div>
                            <div className="upcomingAssgnsWrapper">
                                <div className = "class+Assignments">
                                    <p className = "tDue class">{((orderMe(assignments))[i]).course}</p>
                                    <h5 className =  "tDue"><strong>{((orderMe(assignments))[i]).name}</strong></h5>
                                </div>

                                <div>
                                    {/* if the assignment is due this week use the day of the week (Monday) in the due date*/}
                                    <p>due: {moment(((orderMe(assignments))[i]).dueData.substring(0,17), 'MMM Do [at] h:mmA').format('w') == moment().format('w') ? 
                                        (moment(((orderMe(assignments))[i]).dueData.substring(0,17), 'MMM Do [at] h:mmA').format('dddd h:mm A')): 
                                        (moment(((orderMe(assignments))[i]).dueData.substring(0,17), 'MMM Do [at] h:mmA').format('MMM Do h:mm A'))}
                                    </p>
                                </div>

                                <div className = "line2"/>
                            </div>
                        </div>
                    ))}
                    </div>                  
                </div>
            </div>
            )
        }

    // ------------------- WEEKLY OVERVIEW HTML ------------------- //

    return (  
        <div>
            <div className = "bodyContainer row">
                <div className = "secondaryBodyContainer col-lg-8 col-xl-8">
                    <div className = "weekly-overview">
                        <div className = "Welcome">
                        <a href = {"#/home"} className = "backToCal btn"> back to calendar </a>
                            <h3 className = "weeklyOverview">weekly overview</h3>
                        </div>

                        <div className = "weeklyContainer overflow-auto">
                            <div className = "month-week-wrapper">
                                <div className="row">
                                    <div className = "col-sm">
                                        <h1 className= "month-year-text">{moment(dayInMonth(0), "M/D").format('MMMM YYYY')}</h1>
                                        <p onClick = {(e) => setWeekControl(0)} >{moment(dayInMonth(0), "M/D").format('dddd, MMM Do')} - {moment(dayInMonth(6), "M/D").format('dddd, MMM Do')}</p>
                                    </div>

                                    <div className = "col-sm week-change">
                                        <button className = "btn prev" onClick = {(e) => setWeekControl(weekControl - 1)}> previous week</button>
                                        <button className = "btn next"  onClick = {(e) => setWeekControl(weekControl + 1)}> next week</button>

                                        <div>
                                            {weekControl != 0 ? (<button className = "btn current" onClick = {(e) => setWeekControl(0)}>current week</button>): (<></>)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {getDayData('Sunday', 0)}
                            {getDayData('Monday', 1)}
                            {getDayData('Tuesday', 2)}
                            {getDayData('Wednesday', 3)}
                            {getDayData('Thursday', 4)}
                            {getDayData('Friday', 5)}
                            {getDayData('Saturday', 6)}
                        </div>
                    </div> 
                </div>

    {/* -------- end of overview section --------- */}

   

    {/* -------------- widget section -------------- */}
            <div className = "widgetWrapper col-lg-4 col-xl-3 d-md-none d-sm-none d-xs-none d-lg-block d-xl-block d-none">
                <div className = "widget-wrapper-1">
                    <div className = "widgetContainer today-date">      
                        <div className = "time-box">
                            <h5>today's date:</h5>
                            <h4 className = "today">{todayDate}</h4>
                        </div>
                        
                        <div className = "box">
                            <h5 className = "time" onClick = {() => handleClock()}>
                                {seeClock ? (currentTime):("(click to see time)")}
                            </h5>
                        </div>
                    </div>

                    <div className = "widgetContainer next-assignment">
                        <h5>next assignment:</h5>
                        {nxtAssgnmntsChecker()}
                    </div>

                            
                    <div className = "widgetContainer next-assignment">
                        <h5>all courses:</h5>
                        <div>
                            {classes.length > 0 ? (
                                <div>
                                    {classes.map((clss, i) => (
                                        <div>
                                            <button 
                                                key = {clss.shortName}
                                                className = {(clss.name == courseClicked[0]) ? (courseClassClicked(i)):(courseClass(i))}
                                                
                                            
                                                onClick = {(e) => toggleCourseClick(clss.name, i)}>
                                                {clss.name} 
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ):(<button className = "class-1 class-table"> loading courses...</button>)}
                        </div>
                    </div>

                    <div className = "widgetContainer next-assignment">
                        <div>
                        <form>
                        <h1 className = 'top'> Log-in </h1>
                        <div className = 'form-group'>
                            <h3> Username </h3>
                            <input type = 'text' className = 'form-control w-100' value = {email} placeholder='JohnDoe@gmail.com' onChange={changeEmail}></input>
                        </div>

                        <div className = 'mb-5 form-group'>
                            <h3> Password </h3>
                            <input type = 'password' className = 'form-control w-100' id = 'password' value ={pass} placeholder='pogchamp' onChange={changePass}></input>
                        </div>

                        <button type="submit" className="mb-5 btn btn-primary w-100" onClick={(e)=>login(email,pass)} >Submit</button>

                        <p id="login_status_text" className="fs-5">status</p>
                        

                    </form>
                    <button 
                        className = "btn mb-2" 
                        onClick = {() => pullClasses()}>
                            click me to get your classes
                    </button>



                    <button 
                        className = "btn" 
                        onClick = {(e) => getAssignments()}>
                            click me to get your assignments
                    </button>
                        </div>
                    </div>
                </div> 
            </div>



            <div className = "widgetWrapper col-lg-3 col-xl-3 d-xs-block d-sm-block d-md-block d-lg-none d-xl-none">
                
                <div className = "widget-overview row ">
                    <div className = "date-course-column1 col-sm col-md">
                        <div className = "widgetContainer today-date">      
                            <div className = "time-box">
                                <h5>today's date:</h5>
                                <h4 className = "today">{todayDate}</h4>
                            </div>
                            
                            <div className = "box">
                                <h5 className = "time" onClick = {() => handleClock()}>
                                    {seeClock ? (currentTime):("(click to see time)")}
                                </h5>
                            </div>
                        </div>

                        <div className = "widgetContainer next-assignment">
                            <h5>all courses:</h5>
                            <div>
                                {classes.length > 0 ? (
                                    <div>
                                        {classes.map((clss, i) => (
                                            <div>
                                                <button 
                                                    key = {clss.shortName}
                                                    className = {(clss.name == courseClicked[0]) ? (courseClassClicked(i)):(courseClass(i))}
                                                    
                                                
                                                    onClick = {(e) => toggleCourseClick(clss.name, i)}>
                                                    {clss.name} 
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ):(<button className = "class-1 class-table"> loading courses...</button>)}
                            </div>
                        </div>
                    </div>

                    <div className = "next-assgns-column2 col-sm-6 col-md">
                        <div className = "widgetContainer next-assignment">
                            <h5>next assignment:</h5>
                            {nxtAssgnmntsChecker()}
                        </div>
                    </div>

                            
                    
                </div>


            </div>
        </div>
    </div>
           


    );
}
 
export default WeeklyOverview;

