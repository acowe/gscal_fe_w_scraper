import {Col, Row} from "react-bootstrap";

// Generates display for days of the week (above the calendar grid)

function CalWkDays(){
    return (
        <Row className={"mx-0 mt-1 mt-sm-3 mt-md-3 px-0 cal_days"}>
            <Col style={{width:"14.28%"}} className={"px-0"}>
                <p className={"my-0 px-1 fs-6 dow_full"}>sunday</p>
                <p className={"my-0 px-1 fs-6 dow_short"}>sun</p>
            </Col>
            <Col style={{width:"14.28%"}} className={"px-0"}>
                <p className={"my-0 px-1 fs-6 dow_full"}>monday</p>
                <p className={"my-0 px-1 fs-6 dow_short"}>mon</p>
            </Col>
            <Col style={{width:"14.28%"}} className={"px-0"}>
                <p className={"my-0 px-1 fs-6 dow_full"}>tuesday</p>
                <p className={"my-0 px-1 fs-6 dow_short"}>tues</p>
            </Col>
            <Col style={{width:"14.28%"}} className={"px-0"}>
                <p className={"my-0 px-1 fs-6 dow_full"}>wednesday</p>
                <p className={"my-0 px-1 fs-6 dow_short"}>wed</p>
            </Col>
            <Col style={{width:"14.28%"}} className={"px-0"}>
                <p className={"my-0 px-1 fs-6 dow_full"}>thursday</p>
                <p className={"my-0 px-1 fs-6 dow_short"}>thu</p>
            </Col>
            <Col style={{width:"14.28%"}} className={"px-0"}>
                <p className={"my-0 px-1 fs-6 dow_full"}>friday</p>
                <p className={"my-0 px-1 fs-6 dow_short"}>fri</p>
            </Col>
            <Col style={{width:"14.28%"}} className={"px-0"}>
                <p className={"my-0 px-1 fs-6 dow_full"}>saturday</p>
                <p className={"my-0 px-1 fs-6 dow_short"}>sat</p>
            </Col>
        </Row>
    )
}

export default CalWkDays;