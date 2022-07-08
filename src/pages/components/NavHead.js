import {Container, Row, Col, Dropdown} from "react-bootstrap";

function NavHead(props){

    return(
        <Row className={"py-4 header"}>
            <Col xs={0} sm={2} md={3} lg={2} className={"h_other"}>
                <a className={"my-0 px-2 h_other_text fs-5 text-decoration-none"} onClick={(e)=>props.enableSidebar()}>
                    Hello Student!</a>
            </Col>
            <Col xs={10} sm={8} md={6} lg={8} className={"d-flex justify-content-sm-center align-middle ps-sm-0"}>
                <h5 className={"my-0 fs-4 fw-bold h_title"} onClick={(e)=>props.getInfo()}>
                    gradescope calendar</h5>
            </Col>
            <Col xs={2} sm={2} md={3} lg={2} className={"h_other"}>
                <a href={"/gscal_front_end/#/sign_out"} className={"w-75 py-0 btn btn-light btn-block shadow-none border-0 rounded-pill h_other_text"}>
                    sign out
                </a>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className={"shadow-none h_dropdown"}>
                        <i className="fa-solid fa-bars"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Hello student!</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => props.isDark(props.dark)}>
                            Dark Mode: {props.dark ? "On": "Off"}
                        </Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item className={"text-danger"} href={"/gscal_front_end/#/sign_out"}>Sign out</Dropdown.Item>

                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
    );
}

export default NavHead;