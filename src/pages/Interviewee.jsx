import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  Spinner,
  Row,
  Col,
  ListGroup,
  Badge,
} from "react-bootstrap";

const Interviewee = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/summary/${candidateId}`
        );
        setCandidate(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [candidateId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading interview data...</span>
      </div>
    );

  if (!candidate)
    return (
      <p className="text-danger text-center">❌ Candidate not found.</p>
    );

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg rounded-4 mb-4">
            <Card.Body>
              <h3 className="text-center mb-3">🎓 Interviewee Profile</h3>
              <p className="text-muted text-center">
                Detailed report of the interview performance including answers,
                scores, and final feedback.
              </p>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Name:</strong> {candidate.name || "-"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Email:</strong> {candidate.email || "-"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Phone:</strong> {candidate.phone || "-"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Score:</strong>{" "}
                  <Badge bg="info">
                    {candidate.score !== undefined
                      ? candidate.score.toFixed(2)
                      : "-"}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Status:</strong>{" "}
                  <Badge bg={candidate.finished ? "success" : "warning"}>
                    {candidate.finished ? "Finished" : "In Progress"}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="shadow-sm rounded-4 mb-4">
            <Card.Body>
              <h4 className="mb-3">📝 Question & Answer Log</h4>
              {candidate.messages && candidate.messages.length > 0 ? (
                <ListGroup>
                  {candidate.messages.map((m, i) => (
                    <ListGroup.Item key={i} className="mb-2 rounded-3">
                      <p>
                        <strong>
                          Q{m.question_no || i + 1} ({m.difficulty || "N/A"})
                        </strong>
                        : {m.question || "-"}
                      </p>
                      <p>
                        <strong>A:</strong>{" "}
                        {m.answer ? m.answer : <em className="text-muted">Pending</em>}
                      </p>
                      <p>
                        <strong>Score:</strong>{" "}
                        {m.score !== null && m.score !== undefined ? (
                          <Badge bg="secondary">{m.score}</Badge>
                        ) : (
                          "-"
                        )}
                      </p>
                      {m.time_limit && (
                        <p>
                          <strong>Time Limit:</strong>{" "}
                          <Badge bg="light" text="dark">
                            {m.time_limit}s
                          </Badge>
                        </p>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted text-center">No questions answered yet.</p>
              )}
            </Card.Body>
          </Card>

          {candidate.finished && candidate.summary && (
            <Card className="shadow rounded-4">
              <Card.Body>
                <h4 className="mb-3">📑 Final Interview Summary</h4>
                <p>{candidate.summary}</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Interviewee;
