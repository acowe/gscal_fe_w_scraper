import {useState} from "react";
function CalCourses(props){
    const courseFilter = props.filter;
    const displayCourses = props.courseList.map((c,i) => {
        if (courseFilter == ""){
            return(<li id={c} className={"ms-3 me-3 py-2 course_"+(i+1)}
                       onClick={(e) => props.changeFilter(e.target.id)}>
                {c}</li>);
        }
        else{
            if (c == courseFilter){
                return(<li id={c} className={"ms-3 me-3 py-2 course_"+(i+1)}
                           onClick={(e) => props.changeFilter(e.target.id)}>
                    {c}</li>);
            }
            else {
                return(<li id={c} className={"ms-3 me-3 py-2 tp course_"+(i+1)}
                           onClick={(e) => props.changeFilter(e.target.id)}>
                    {c}</li>);
            }
        }
    });

    return(
        <div className={"mb-3 mt-1 mt-sm-3 ps-0 cal_key"}>
            <div className={"text-start mb-0 pe-0 key"}>
                <h4 className={"mb-0 key_text"}>View by class:</h4></div>
            <div className={"courses"}>
                <ul className={"ps-0"}>
                    {displayCourses}

                </ul>
            </div>
        </div>
    );
}
export default CalCourses;