function SideBar(props){
    return(
        <div id={"darkMode_" + props.dark.toString()} className={"sidebar_" + props.sidebarOn.toString() + " sidebar"}>
            <img className={"mt-4 mb-3 rounded-circle profile_img"} src={"https://icon-library.com/images/anonymous-user-icon/anonymous-user-icon-2.jpg"}></img>
            <h3 className={"mb-4"}>{props.uName}</h3>
            <ul className={"sidebar_options"}>
                <li className={"mb-3 fs-5"}>My Profile</li>
                <li className={"mb-3 fs-5"}>Settings</li>
                <li className={"fs-5"}>
                    <div>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                            Dark Mode
                        </label>
                    </div>
                    <div className="form-check form-switch d_mode_switch">
                        <input id="visualModeSelect" className="form-check-input default" type="checkbox" role="switch"
                               onChange={(e)=>{props.changeVisualMode(e.target.checked)}}/>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;