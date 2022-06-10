import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaBook, FaDrum, FaGuitar, FaPenFancy } from "react-icons/fa";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Layout from "../layout";
import Instructions from "./instructions";
import { getMySubmissionsForAssignment } from "../../api";

export default function StudentAssignment({children, assignment}) {
  const router = useRouter();

  const { slug, piece, actCategory, partType } = router.query;
  console.log('slug, assignmentId', slug, assignment.id)
  const { isLoading, isIdle, error, data: submissions } = useQuery(['submissions',slug,assignment.id], () => getMySubmissionsForAssignment({slug, assignmentId:assignment.id}), {
    enabled: !!assignment && !!slug
  })

  console.log('submissions', submissions)
  return (
    <Layout>
      <Row>
        {/* piece subnav (navigate to next/other activity, else?) */}
        <Col md={2}>
          {/* <h2>{assignment?.part?.piece?.name} Activities</h2> */}
          <h2>{assignment?.part?.piece?.name}</h2>
          {/* Piece Activities */}
          <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
              <Col>
                <ListGroup>
                  <Link href={`/courses/${slug}/${piece}/Perform/Melody`} passHref>
                    <ListGroup.Item action eventKey="Melody" href={`/courses/${slug}/${piece}/Perform/Melody`} active={actCategory === 'Perform' && partType === 'Melody'} as="a">
                      <span><FaGuitar/> Melody</span>
                    </ListGroup.Item>
                  </Link>
                  <Link href={`/courses/${slug}/${piece}/Perform/Bassline`} passHref>
                    <ListGroup.Item action eventKey="Bassline" href={`/courses/${slug}/${piece}/Perform/Bassline`} active={actCategory === 'Perform' && partType === 'Bassline'} as="a">
                      <span><FaDrum/> Bassline</span>
                    </ListGroup.Item>
                  </Link>
                  <Link href={`/courses/${slug}/${piece}/Create`} passHref>
                    <ListGroup.Item action eventKey="Create" href={`/courses/${slug}/${piece}/Create`} active={actCategory === 'Create'} as="a">
                      <span><FaPenFancy/> Create</span>
                    </ListGroup.Item>
                  </Link>
                  <Link href={`/courses/${slug}/${piece}/Respond`} passHref>
                    <ListGroup.Item action eventKey="Respond" href={`/courses/${slug}/${piece}/Respond`} active={actCategory === 'Respond'} as="a">
                      <span><FaBook/> Reflect</span>
                    </ListGroup.Item>
                  </Link>
                </ListGroup>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
        <Col>
          <h1>{assignment?.activity?.part_type !== "Combined" && `${assignment?.activity?.activity_type.category} `}{assignment?.activity?.activity_type.name} Activity</h1>
          {/* {assignment?.activity?.part_type !== "Combined" && <h1>{`${assignment?.activity?.part_type} Activity`}</h1>} */}
          {/* instructions */}
          <Instructions body={assignment?.activity?.body}/>
          {/* tasks */}
          {children}
        </Col>
        {/* <Col md={2}>
          <h2>Assignment</h2>
          { isLoading ? <Spinner as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true">
            <span className="visually-hidden">Loading...</span>
          </Spinner> : <p>{submissions && submissions.length} Submissions: {submissions.length}</p> }
          <Button>Submit</Button>
        </Col> */}
      </Row>
    </Layout>
  )
}