import moment from 'moment';
import { useState } from 'react';
import cx from 'classnames';


function AssgnList({assignments, courseClicked}){
    const [numList, setNumList] = useState([]) // holds highlighted row ids
    const [numStrike, setNumStrike] = useState([]) // holds striked row ids

   // Toggles if a table row is highlighted (stores all highlighted row ids in an array)
    const handleChange = (num) => {
        if (!numList.includes(num)) {
            setNumList(numList => numList.concat(num))
        } else {  
            setNumList(numList.filter ((numList) => numList !== num))
        }
   }

   // Toggles if a table row has strike through (stores all striked row ids in an array)
    const handleStrike= (num) => {
        if (!numStrike.includes(num)) {
            setNumStrike(numStrike => numStrike.concat(num))
        } else { 
            setNumStrike(numStrike.filter ((numStrike) => numStrike !== num))  
        }
    }


    // Toggles if the time due or time remaining is shown in the weekly overview table ------
    const [countdown, setCountdown] = useState(false); 
    
    const toggleTime = () => {
        setCountdown(current => !current);
       
    };
    // --------
  
    // Calulates how soon an assignment is due (3 days from now, 15 hours ago)

    function timeLeft(dueDate){
        var date1 = moment(dueDate, 'MMM Do [at] h:mmA').format("MMDDHmm")
        return moment(date1, "MMDDHmm").fromNow()
    }

    // ------------------  ASSIGNMENT LIST HTML ----------------- //
    return (
        <div className = "assignments-list">
            {assignments.length === 0 ? 
                (<h4 className = "no-assignments"> no assignments today! </h4>):
                (<table className = "table table-hover table-borderless">
                    <thead>
                        <tr>
                            <th className = "boundary tDue" >
                                <div className = "x-button-position-header ">
                                    <button 
                                        onClick = {(e) => (setNumStrike([]))}
                                        className = "x-mark-clicked black shift-button">

                                    </button>
                                </div>
                            </th>
                            <th className = "boundary tDue" >
                                <div>
                                    <button 
                                        onClick = {(e) => (setNumList([]))}
                                        className = "checked-box-clicked black ">
                                    </button>
                                </div>
                            </th>
                            <th scope= "col"> class name</th>
                            <th className = "space" > </th>
                            <th scope= "col"> assignment</th>
                            <th className = "space" ></th>
                            <th scope= "col" className = "tDue " style = {{fontWeight:"bold"}}
                                onClick = {() => {toggleTime()}}> 
                                {countdown ? ("time due") : ("time remaining")}
                            </th>
                        </tr>
                    </thead>

            {assignments.map((assignment, i) => (
                <tbody>
                    <tr 
                        key = {assignment.name + i}
                        className={cx({
                            'striped': (i%2) == 0,
                            //'past-due': Number(moment((assignment.dueData).substring(0,17), 'MMM Do [at] h:mmA').format('MMDDHmm')) < Number(moment().format('MMDDHmm')),
                            'selected': numList.includes(assignment.name + i),
                            'opacity': numStrike.includes(assignment.name + i),
                            'class-clicked-0': (assignment.course == courseClicked[0] & courseClicked[1] == 0),
                            'class-clicked-1': (assignment.course == courseClicked[0] & courseClicked[1] == 1),
                            'class-clicked-2': (assignment.course == courseClicked[0] & courseClicked[1] == 2),
                            'class-clicked-3': (assignment.course == courseClicked[0] & courseClicked[1] == 3),
                            'class-clicked-4': (assignment.course == courseClicked[0] & courseClicked[1] == 4),
                            'class-clicked-5': (assignment.course == courseClicked[0] & courseClicked[1] == 5),
                            'class-clicked-6': (assignment.course == courseClicked[0] & courseClicked[1] == 6),
                        })}
                    >
                        <td className = "contain-checkbox">
                            <div className = "x-button-position">
                                <button 
                                    className = {cx({
                                        'x-mark': !numStrike.includes(assignment.name + i),
                                        'x-mark-clicked': numStrike.includes(assignment.name + i)
                                    })}
                                    onClick = {(e) => (handleStrike(assignment.name + i))}>
                                </button>
                            </div>
                        </td>

                        <td className = "contain-checkbox">
                            <button 
                                className = {cx({
                                    'checked-box': !numList.includes(assignment.name + i),
                                    'checked-box-clicked': numList.includes(assignment.name + i)
                                })}
                                onClick = {(e) => (handleChange(assignment.name + i))}>
                            </button>
                        </td>
                        
                        <td className = "content"> {assignment.course === "" ? ("GRADED"):(assignment.course)}</td>
                        <td className = "space"></td>
                        <td className = "content"> {assignment.name === "" ? ("GRADED"):(assignment.name)}</td>
                        <td className = "space"></td>
                        <td className = "sub tDue" > 
                            {countdown ? (moment(assignment.dueData, 'MMM Do [at] h:mmA').format('MMM Do [at] h:mmA')) : (timeLeft((assignment.dueData).substring(0,17)))}  </td>
                    </tr>
                </tbody>    
            ))}
                </table>
        )}
        </div>            
        );
}

export default AssgnList

